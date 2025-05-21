# BitcoinZ Forum Archive Generator

This tool processes a Discourse PostgreSQL database dump and generates a static HTML archive of the BitcoinZ forum for integration into the main BitcoinZ website.

## Prerequisites

- Python 3.6+
- PostgreSQL database server
- The following Python packages:
  - psycopg2
  - jinja2

## Installation

1. Install the required Python packages:

```bash
pip install psycopg2-binary jinja2
```

2. Set up a PostgreSQL database server (if not already installed):

```bash
# For macOS (using Homebrew)
brew install postgresql
brew services start postgresql

# For Debian/Ubuntu
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Importing the Database Dump

1. Create a new PostgreSQL database:

```bash
createdb bitcoinz_forum
```

2. Import the SQL dump:

```bash
psql -d bitcoinz_forum -f dump/dump.sql
```

Note: This may take some time depending on the size of the dump file.

## Generating the Forum Archive

Run the script with the following command:

```bash
python scripts/generate_forum_archive.py --db-name bitcoinz_forum --db-user your_username --db-password your_password
```

### Command-line Options

- `--db-name`: PostgreSQL database name (required)
- `--db-user`: PostgreSQL database user (required)
- `--db-password`: PostgreSQL database password (required)
- `--db-host`: PostgreSQL database host (default: localhost)
- `--db-port`: PostgreSQL database port (default: 5432)
- `--output-dir`: Output directory for generated files (default: content/ecosystem/forum-archive)

## Output Structure

The script generates the following structure:

```
content/ecosystem/forum-archive/
├── index.html                  # Main archive page
├── categories/                 # Category pages
│   └── {category-id}-{slug}/
│       └── index.html
└── topics/                     # Topic pages
    └── {topic-id}-{slug}/
        └── index.html
```

Additionally, a CSS file is created at:

```
static/css/forum-archive.css
```

## Integration with Hugo

The script generates static HTML files that can be directly served by Hugo. The forum archive will be accessible at:

```
https://your-website.com/ecosystem/forum-archive/
```

## Customization

You can customize the appearance of the forum archive by modifying the CSS file at `static/css/forum-archive.css`.

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues, make sure:
- PostgreSQL server is running
- Database credentials are correct
- The database exists
- Your user has permission to access the database

### Missing Content

If some content is missing or not displaying correctly:
- Check the database schema to ensure the script is querying the correct tables
- Verify that the SQL dump was imported successfully
- Look for any error messages during script execution

## Next Steps

After generating the forum archive:

1. Build your Hugo site to include the new content
2. Test the archive to ensure all links work correctly
3. Deploy the updated site to your web server
