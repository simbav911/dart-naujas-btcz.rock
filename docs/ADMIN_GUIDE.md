# Administrator's Guide for BitcoinZ Website

This guide explains how to manage the BitcoinZ website content using the Content Management System (CMS) and how to handle administrative tasks.

## Table of Contents
- [Accessing the CMS](#accessing-the-cms)
- [Adding New Administrators](#adding-new-administrators)
- [Managing Content](#managing-content)
- [Troubleshooting](#troubleshooting)

## Accessing the CMS

The Content Management System is available at:
`https://simbav911.github.io/dart-naujas-btcz.rock/admin/`

To access the CMS:
1. Visit the CMS URL
2. Click "Login with GitHub"
3. Authenticate with your GitHub account
4. You must have Write or Admin access to the repository to log in successfully

## Adding New Administrators

To add new administrators who can access the CMS:

1. Go to the GitHub repository: `https://github.com/simbav911/dart-naujas-btcz.rock`
2. Click on "Settings" tab
3. Select "Collaborators and teams" from the left sidebar
4. Click the "Add people" button
5. Enter the GitHub username or email of the new administrator
6. Choose their access level:
   - "Write" access: Can edit content through the CMS
   - "Admin" access: Can edit content and manage repository settings

Important Notes:
- New users must have a GitHub account
- They will receive an email invitation to collaborate
- They must accept the invitation before they can access the CMS
- You can revoke access at any time by removing them from the collaborators list

## Managing Content

### Creating News Posts

1. Log in to the CMS
2. Click the "New News" button
3. Fill in the required fields:
   - Title: The headline of your news post
   - Publish Date: When the post should go live
   - Featured Image: (Optional) Add an image to your post
   - Body: The main content of your post (supports Markdown)
4. Preview your post using the preview pane
5. Click "Publish" when ready

### Editing Existing Content

1. Log in to the CMS
2. Select the content you want to edit from the list
3. Make your changes
4. Preview the changes
5. Click "Publish" to save and publish your changes

### Working with Images

- Images should be optimized for web use before uploading
- Recommended image formats: JPG, PNG, WebP
- Maximum image size: 2MB
- Recommended dimensions for featured images: 1200x630 pixels

## Troubleshooting

### Common Issues

1. **Can't Log In**
   - Verify you have accepted the repository collaboration invitation
   - Ensure you have Write or Admin access to the repository
   - Try clearing your browser cache and cookies

2. **Changes Not Appearing**
   - Changes may take a few minutes to appear due to build time
   - Check the repository's Actions tab for build status
   - Clear your browser cache

3. **Image Upload Issues**
   - Ensure images are under 2MB
   - Try using a different browser
   - Check your internet connection

### Getting Help

If you encounter issues:
1. Check the GitHub repository's Issues tab
2. Contact the main administrator
3. Review GitHub Actions logs for build errors

## Security Best Practices

1. Only grant access to trusted team members
2. Regularly review the collaborators list
3. Remove access for inactive team members
4. Use strong passwords for your GitHub account
5. Enable two-factor authentication on GitHub

## Contact

For technical support or questions about administration, please contact the main repository administrator.
