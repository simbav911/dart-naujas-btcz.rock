# Brevo Integration Fix Architecture for GitHub Pages

## Current Issues
1. API key exposed in frontend code
2. Direct API calls to Brevo causing CORS issues
3. Hard-coded configuration
4. Poor error handling

## Revised Architecture for GitHub Pages

### 1. GitHub Repository Configuration
Set up repository secrets in GitHub:
1. Go to repository Settings > Secrets and variables > Actions
2. Add repository secrets:
   - `BREVO_API_KEY`: Your Brevo API key (as a secret for security)
   - `BREVO_LIST_ID`: Your Brevo list ID (as a secret)

### 2. GitHub Action for Build-time Integration
Create/update GitHub Action workflow to inject configuration during build:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # or your default branch

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'
          
      - name: Generate Config
        run: |
          echo "window.BREVO_CONFIG = {" > static/js/brevo-config.js
          echo "  listId: '${{ secrets.BREVO_LIST_ID }}'," >> static/js/brevo-config.js
          echo "  apiUrl: 'https://api.brevo.com/v3'," >> static/js/brevo-config.js
          echo "  apiKey: '${{ secrets.BREVO_API_KEY }}'" >> static/js/brevo-config.js
          echo "};" >> static/js/brevo-config.js
          
      - name: Build
        run: hugo --minify
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

### 3. Updated Frontend Implementation
Update the subscription form implementation:

```html
<!-- Add to head section -->
<script src="/js/brevo-config.js"></script>

<!-- Update form section -->
<form id="sib-form" data-type="subscription" class="space-y-4">
    <div class="relative">
        <input class="w-full px-6 py-4 rounded-lg bg-btcz-gray-800 border border-btcz-gray-700 text-white placeholder-btcz-gray-400 focus:outline-none focus:ring-2 focus:ring-btcz-gold focus:border-transparent transition-all"
               type="email"
               id="EMAIL"
               name="EMAIL"
               autocomplete="off"
               placeholder="Enter your email"
               required>
    </div>
    <button class="w-full px-6 py-4 bg-gradient-to-r from-btcz-gold to-yellow-400 text-btcz-gray-900 font-semibold rounded-lg hover:from-yellow-400 hover:to-btcz-gold transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-btcz-gold focus:ring-offset-2 focus:ring-offset-btcz-gray-950"
            type="submit">
        Subscribe Now
    </button>
</form>
```

```javascript
// Update form handling code
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sib-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('EMAIL').value;
            const button = form.querySelector('button');
            const originalButtonText = button.textContent;
            
            button.disabled = true;
            button.textContent = 'Subscribing...';
            
            try {
                const response = await fetch(`${window.BREVO_CONFIG.apiUrl}/contacts`, {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json',
                        'api-key': window.BREVO_CONFIG.apiKey
                    },
                    body: JSON.stringify({
                        email: email,
                        listIds: [parseInt(window.BREVO_CONFIG.listId)],
                        attributes: {
                            WEBSITE: window.location.hostname
                        }
                    })
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Subscription failed');
                }

                // Show success message
                const message = document.createElement('div');
                message.className = 'subscription-message';
                message.innerHTML = `
                    <div class="message-content">
                        <p>Thank you for subscribing!</p>
                        <button onclick="this.parentElement.parentElement.remove()">OK</button>
                    </div>
                `;
                form.parentElement.appendChild(message);
                
                // Trigger confetti
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                
                form.reset();
            } catch (error) {
                console.error('Subscription error:', error);
                alert(error.message || 'Subscription failed. Please try again later.');
            } finally {
                button.disabled = false;
                button.textContent = originalButtonText;
            }
        });
    }
});
```

## Implementation Steps

1. GitHub Configuration
   - Add repository variables for Brevo API key and list ID
   - Update GitHub Actions workflow file

2. Frontend Update
   - Add brevo-config.js script inclusion
   - Update form submission code
   - Update error handling

3. Testing
   - Test with GitHub Pages deployment
   - Verify variables are properly injected
   - Test subscription flow

4. Monitoring
   - Add console logging for debugging
   - Monitor GitHub Actions build logs
   - Track Brevo API responses

## Security Considerations

1. Repository Variables
   - Use GitHub repository variables for sensitive data
   - Regular rotation of API keys
   - Limited access to repository settings

2. Build Process
   - Verify config injection during build
   - Check published files for exposed secrets

3. Error Handling
    - Sanitize error messages
    - Implement proper user feedback
    - Log errors appropriately
    - Use correct case for API headers ('api-key' instead of 'Api-Key')

This revised architecture leverages GitHub Pages and Actions to securely handle the Brevo integration while maintaining functionality and user experience.