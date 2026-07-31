/**
 * Newsletter subscribe endpoint for getbtcz.com.
 *
 * The browser posts here instead of calling Brevo directly, so the Brevo API
 * key stays in Cloudflare and is never served to visitors. Bot checks run here
 * too, where they cannot be skipped by calling the endpoint directly.
 */

const BREVO_CONTACTS_URL = 'https://api.brevo.com/v3/contacts';
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const ALLOWED_ORIGINS = [
  'https://getbtcz.com',
  'https://www.getbtcz.com',
  'http://localhost:1313',
];

// A human needs at least this long to type an email address
const MIN_FILL_MS = 2500;
const MAX_EMAIL_LENGTH = 254;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

function corsHeaders(origin) {
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    Vary: 'Origin',
  };
  if (ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
    headers['Access-Control-Max-Age'] = '86400';
  }
  return headers;
}

function reply(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders(origin),
  });
}

/**
 * Bots are told the subscription worked. If they could tell they were blocked,
 * they would tune around the checks.
 */
function silentlyAccept(origin) {
  return reply({ ok: true }, 200, origin);
}

async function verifyTurnstile(token, ip, secret) {
  if (!token) {
    return false;
  }
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) {
    form.append('remoteip', ip);
  }
  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body: form });
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error('Turnstile verify failed:', err);
    return false;
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'POST') {
      return reply({ ok: false, error: 'Method not allowed' }, 405, origin);
    }

    let payload;
    try {
      payload = await request.json();
    } catch (err) {
      return reply({ ok: false, error: 'Invalid request' }, 400, origin);
    }

    // Honeypot: a field hidden from people that bots fill in anyway
    if (typeof payload.companyWebsite === 'string' && payload.companyWebsite !== '') {
      return silentlyAccept(origin);
    }

    // Submitted faster than a person could type the address
    if (typeof payload.elapsed !== 'number' || payload.elapsed < MIN_FILL_MS) {
      return silentlyAccept(origin);
    }

    const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
    if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
      return reply({ ok: false, error: 'Please enter a valid email address.' }, 400, origin);
    }

    const ip = request.headers.get('CF-Connecting-IP') || '';

    if (env.RATE_LIMITER) {
      const { success } = await env.RATE_LIMITER.limit({ key: ip || 'unknown' });
      if (!success) {
        return reply(
          { ok: false, error: 'Too many attempts. Please try again in a minute.' },
          429,
          origin
        );
      }
    }

    const passed = await verifyTurnstile(payload.turnstileToken, ip, env.TURNSTILE_SECRET);
    if (!passed) {
      return reply(
        { ok: false, error: 'Verification failed. Please reload the page and try again.' },
        403,
        origin
      );
    }

    let brevoResponse;
    try {
      brevoResponse = await fetch(BREVO_CONTACTS_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'api-key': env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          email,
          listIds: [parseInt(env.BREVO_LIST_ID, 10)],
          updateEnabled: true,
        }),
      });
    } catch (err) {
      console.error('Brevo request failed:', err);
      return reply({ ok: false, error: 'Subscription failed. Please try again later.' }, 502, origin);
    }

    // Brevo answers 201 with a body, 204 with an empty one when it updates an
    // existing contact
    const raw = await brevoResponse.text();
    let data = {};
    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch (err) {
        data = {};
      }
    }

    if (brevoResponse.ok) {
      return reply({ ok: true }, 200, origin);
    }

    // Already on the list - that is a success from the visitor's point of view
    if (data.code === 'duplicate_parameter') {
      return reply({ ok: true, alreadySubscribed: true }, 200, origin);
    }

    console.error('Brevo error:', brevoResponse.status, data.code || raw.slice(0, 200));
    if (data.code === 'invalid_parameter') {
      return reply({ ok: false, error: 'Please enter a valid email address.' }, 400, origin);
    }
    return reply({ ok: false, error: 'Subscription failed. Please try again later.' }, 502, origin);
  },
};
