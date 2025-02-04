# Managing News Content

This guide explains how to add and manage news articles on the BitcoinZ website.

## Directory Structure

News articles are stored in the `content/news` directory. Each article is a Markdown file with a specific naming convention and front matter.

## Creating a New Article

### File Naming Convention

News articles should be named using the following format:
```
YYYY-MM-DD-article-title.md
```
Example: `2024-01-16-fundraise-for-changelly-listing.md`

### Required Front Matter

Each article must include the following front matter at the top of the file:

```yaml
---
title: "Your Article Title"
date: YYYY-MM-DDT00:00:00Z
draft: false
subject: "Updates"  # or other relevant category
image: "/images/news/your-image-400x250.jpg"
---
```

Example:
```yaml
---
title: "Fundraise for Changelly Listing"
date: 2024-01-16T00:00:00Z
draft: false
subject: "Updates"
image: "/images/news/changelly-fundraise-400x250.jpg"
---
```

### Image Requirements

1. Place news images in the `static/images/news/` directory
2. Image dimensions should be 400x250 pixels
3. Use descriptive filenames that match your article content
4. Supported formats: jpg, png
5. Keep file sizes optimized for web (recommend under 100KB)

### Content Guidelines

1. Write clear, engaging content
2. Use proper Markdown formatting:
   ```markdown
   ## Headings use double hashtags
   
   Regular paragraphs are written as plain text.
   
   - Use bullet points for lists
   - Each point on a new line
   
   1. Or numbered lists
   2. For sequential items
   
   **Bold text** for emphasis
   ```

3. Include relevant links where appropriate
4. Break content into logical sections using headings
5. End with a clear conclusion or call to action

## Example Article

Here's a complete example of a news article:

```markdown
---
title: "BitcoinZ Listed in New Exchange"
date: 2024-01-20T00:00:00Z
draft: false
subject: "Updates"
image: "/images/news/exchange-listing-400x250.jpg"
---

We are excited to announce that BitcoinZ (BTCZ) is now listed on ExampleExchange! This new listing brings increased accessibility and trading options to our community.

## Trading Details

- Trading Pairs: BTCZ/BTC, BTCZ/USDT
- Deposit: Now Open
- Trading Start: January 21, 2024
- Withdrawal: Available after trading begins

## Why This Matters

This listing provides several benefits:
1. Increased liquidity
2. More trading options
3. Broader market access

## How to Get Started

Visit [ExampleExchange](https://example.com) to create your account and start trading BTCZ.

Join our community channels for more updates and trading discussions!
```

## Publishing Process

1. Create your article file in `content/news/`
2. Add your image to `static/images/news/`
3. Test locally using `hugo server`
4. Commit and push your changes:
   ```bash
   git add content/news/your-article.md static/images/news/your-image.jpg
   git commit -m "feat: add new article about [topic]"
   git push
   ```

## Tips for Success

1. **Plan Your Content**: Outline your article before writing
2. **Use Images**: Always include a relevant featured image
3. **Be Accurate**: Double-check all facts and figures
4. **Stay Consistent**: Follow the formatting guidelines
5. **Preview First**: Always test your content locally before publishing

## Troubleshooting

Common issues and solutions:

1. **Images Not Showing**
   - Check image path is correct
   - Verify image exists in the correct directory
   - Ensure image filename matches the reference in front matter

2. **Formatting Problems**
   - Validate your Markdown syntax
   - Check for proper spacing after headings
   - Ensure front matter is properly formatted with three dashes (---)

3. **Article Not Appearing**
   - Verify draft: false is set in front matter
   - Check file is in correct directory
   - Ensure date is not in the future

## Getting Help

If you encounter any issues or need assistance:
1. Check this documentation first
2. Review existing articles for examples
3. Contact the development team for support

Remember to always backup your content before making major changes.