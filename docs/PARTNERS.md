# BitcoinZ Partners Documentation

This document explains how to add or edit partners on the BitcoinZ website.

## Adding a New Partner

To add a new partner, you need to edit the `/data/partners.yaml` file. Each partner is defined as a YAML entry with specific fields.

### Partner Entry Template

```yaml
- name: "Partner Name"
  icon: "/images/partners/partner-icon.svg"  # Path to partner's icon
  rating: 5  # Rating from 1 to 5
  description: "Brief description of the partner and their relationship with BitcoinZ"
  tags: ["Tag1", "Tag2", "Tag3"]  # Relevant tags
  website: "https://partner-website.com"
  order: 3  # Display order (lower numbers appear first)
```

### Required Fields

- `name`: Partner's name (string)
- `icon`: Path to partner's icon file (must be in `/static/images/partners/`)
- `rating`: Rating from 1 to 5 (number)
- `description`: Brief description (string)
- `tags`: List of relevant tags (array of strings)
- `website`: Partner's website URL (string)
- `order`: Display order position (number)

### Adding Partner Icons

1. Create your partner icon (SVG or PNG format recommended)
2. Place the icon in `/static/images/partners/`
3. Reference the icon in the partner entry using the path `/images/partners/your-icon-name.svg`

### Example Partner Entry

```yaml
- name: "Freedom Voice X"
  icon: "/images/partners/freedom-icon.svg"
  rating: 5
  description: "A pioneering platform dedicated to unrestricted free speech and digital freedom. Like BitcoinZ, we believe in the fundamental right of expression without censorship."
  tags: ["Free Speech", "Privacy", "Decentralization"]
  website: "https://example.com"
  order: 1
```

## Editing Existing Partners

1. Open `/data/partners.yaml`
2. Find the partner entry you want to edit
3. Modify the desired fields
4. Save the file

## Partner Display

Partners are displayed in the following locations:
- Homepage: In the partners section before the community section
- Partners page: At `/partners` URL

## Design Guidelines

- Icons should be:
  - Square format (1:1 aspect ratio)
  - Minimum size: 100x100 pixels
  - Recommended formats: SVG (preferred) or PNG
  - Light/white color scheme preferred

- Descriptions should be:
  - Clear and concise
  - Highlight the partnership value
  - 1-2 sentences maximum

## Testing Changes

After making changes:
1. Run Hugo locally to preview changes
2. Check both desktop and mobile views
3. Verify all links work correctly
4. Ensure icons display properly

## Publishing Changes

After making changes:
1. Commit your changes to Git
2. Push to the main branch
3. The website will automatically update

## Need Help?

If you need assistance or have questions about adding partners:
1. Check existing partner entries for examples
2. Contact the BitcoinZ development team
3. Submit an issue on GitHub
