# Technical Context

## Technologies Used
- Hugo (Static Site Generator)
- TailwindCSS (Styling)
- JavaScript (Client-side functionality)
- Brevo/Sendinblue API (Newsletter subscription)
- GitHub Pages (Hosting)
- GitHub Actions (CI/CD)

## Development Setup
- Local Hugo development server
- Node.js for build tools
- PostCSS configuration
- GitHub repository secrets for API keys

## Technical Constraints
- Static site limitations
- Client-side only functionality
- API key security considerations
- Cross-origin resource sharing (CORS)
- Browser compatibility requirements

## Integration Requirements
### Brevo Newsletter Integration
- Requires GitHub Secrets configuration:
  * BREVO_API_KEY: Production API key from Brevo dashboard
  * BREVO_LIST_ID: ID of the contact list in Brevo
- API key injected during CI/CD build
- Config generated at: static/js/brevo-config.js
- Configuration:
  - API Key stored in GitHub repository secrets
  - List ID stored in GitHub repository secrets
  - Configuration injected during build time
  
- Build Process:
  - generate-brevo-config.js creates runtime config
  - GitHub Actions injects secrets during build
  - Config served from /js/brevo-config.js

- Security Measures:
  - No API keys in frontend source
  - Proper header casing for API calls
  - Error message sanitization
  - User feedback for all states

- Error Handling:
  - Configuration validation
  - API response validation
  - User-friendly error messages
  - Visual feedback in UI

## Testing Requirements
- Valid email submission
- Invalid email handling
- Missing configuration detection
- API error handling
- UI feedback verification

## Monitoring Considerations
- GitHub Actions build logs
- Brevo API response monitoring
- Error tracking in console
- User feedback monitoring