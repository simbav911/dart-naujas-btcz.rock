const axios = require('axios');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { code } = event.queryStringParameters;

  if (!code) {
    return { 
      statusCode: 400, 
      body: JSON.stringify({ error: 'No code provided' }) 
    };
  }

  try {
    const response = await axios({
      method: 'post',
      url: 'https://github.com/login/oauth/access_token',
      headers: {
        'Accept': 'application/json'
      },
      data: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.SITE_URL + '/admin/'
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Authentication failed' }) 
    };
  }
};
