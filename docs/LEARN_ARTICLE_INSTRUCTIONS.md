# How to Add or Edit Learn Crypto Articles

This guide explains how to properly add or edit articles in the Learn Crypto section of the BitcoinZ website.

## File Structure

Articles are located in:
```
content/learn/your-article-name.md
```

Images should be placed in:
```
static/images/learn-crypto/your-image-name.jpg
```

## Creating a New Article

1. Create a new markdown file in `content/learn/` with a descriptive name, for example: `what-is-mining.md`

2. Start with the required front matter:
```yaml
---
title: "Your Article Title"
description: "A brief description of your article (1-2 sentences)"
image: "images/learn-crypto/your-header-image.jpg"  # IMPORTANT: Use this exact format for header image
weight: [number]  # Controls article order in the list
---
```

3. Add your article content using markdown syntax

## Image Guidelines

1. **Image Placement**
   - Place all article images in `static/images/learn-crypto/`
   - Use descriptive names for images (e.g., `mining-process.jpg`, not `image1.jpg`)

2. **Image Path Format - VERY IMPORTANT**
   - For the header image in front matter (must follow exactly):
     ```yaml
     image: "images/learn-crypto/your-header-image.jpg"
     ```
     - Must include quotes
     - Must start with `images/` (not `../../../images/`)
     - Must be relative to the `static` directory

   - For images in the article content:
     ```markdown
     ![Alt Text](../../../images/learn-crypto/your-image.jpg)
     ```
     - No quotes needed
     - Must include `../../../` to navigate up to root
     - Must be relative to the markdown file

3. **Common Image Path Issues**
   - Header image (front matter) won't work if:
     - You add `../../../` at the start
     - You forget the quotes
     - You use the wrong path format
   - Content images won't work if:
     - You add quotes around the path
     - You forget the `../../../`
     - You use the wrong path format

4. **Image Best Practices**
   - Use JPG for photographs
   - Use PNG for screenshots or images with text
   - Optimize images for web (compress them)
   - Recommended image dimensions:
     - Header images: 1200x630px
     - Content images: 800px width maximum

## Article Structure

1. **Introduction**
   - Start with a brief overview
   - Explain why the topic is important

2. **Main Content**
   - Use clear headings (## for main sections, ### for subsections)
   - Keep paragraphs short and focused
   - Include relevant images to illustrate concepts
   - Use bullet points or numbered lists for better readability

3. **Conclusion**
   - Summarize key points
   - Provide next steps or related articles if applicable

## Example Article Structure

```markdown
---
title: "Understanding Cryptocurrency Mining"
description: "Learn how cryptocurrency mining works and why it's essential for blockchain networks"
image: "images/learn-crypto/mining-header.jpg"  # Correct header image format
weight: 5
---

Introduction paragraph explaining what mining is...

## What is Cryptocurrency Mining?

![Mining Process](../../../images/learn-crypto/mining-process.jpg)  # Correct content image format

Detailed explanation...

## Why is Mining Important?

- Point 1
- Point 2
- Point 3

## Types of Mining

### 1. GPU Mining
Details about GPU mining...

### 2. ASIC Mining
Details about ASIC mining...

## Conclusion
Summary and key takeaways...
```

## Testing Your Article

1. Run Hugo locally to preview your changes:
   ```bash
   hugo server
   ```

2. Check that:
   - The header image loads correctly
   - All content images load correctly
   - The article appears in the Learn section
   - The formatting looks correct
   - Links work properly

## Common Issues and Solutions

1. **Header Image Not Loading**
   - Make sure you're using the exact format: `image: "images/learn-crypto/image.jpg"`
   - Don't add `../../../` to the header image path
   - Keep the quotes around the path

2. **Content Images Not Loading**
   - Use format: `![Alt](../../../images/learn-crypto/image.jpg)`
   - Include `../../../` in the path
   - Don't use quotes around the path

3. **Formatting Problems**
   - Use proper markdown syntax
   - Leave blank lines between paragraphs
   - Use proper heading hierarchy (## before ###)

4. **Article Not Appearing**
   - Check the front matter syntax
   - Verify the weight value
   - Ensure the file is in the correct directory

## Need Help?

If you encounter any issues or need assistance, please:
1. Check existing articles for reference (especially `cryptocurrencies-intro.md`)
2. Review the Hugo documentation
3. Open an issue on GitHub if needed
