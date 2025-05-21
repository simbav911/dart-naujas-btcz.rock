#!/bin/bash
# BitcoinZ Forum Archive Generator Script
# This script automates the process of importing the SQL dump and generating the forum archive

# Set default values
DB_NAME="bitcoinz_forum"
DB_USER="$USER"
DB_PASSWORD=""
DB_HOST="localhost"
DB_PORT="5432"
OUTPUT_DIR="content/ecosystem/forum-archive"

# Display help message
show_help() {
    echo "BitcoinZ Forum Archive Generator"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -h, --help                 Show this help message"
    echo "  -n, --db-name NAME         PostgreSQL database name (default: bitcoinz_forum)"
    echo "  -u, --db-user USER         PostgreSQL database user (default: current user)"
    echo "  -p, --db-password PASS     PostgreSQL database password"
    echo "  --db-host HOST             PostgreSQL database host (default: localhost)"
    echo "  --db-port PORT             PostgreSQL database port (default: 5432)"
    echo "  -o, --output-dir DIR       Output directory (default: content/ecosystem/forum-archive)"
    echo "  --skip-import              Skip database import step"
    echo ""
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -h|--help)
            show_help
            exit 0
            ;;
        -n|--db-name)
            DB_NAME="$2"
            shift 2
            ;;
        -u|--db-user)
            DB_USER="$2"
            shift 2
            ;;
        -p|--db-password)
            DB_PASSWORD="$2"
            shift 2
            ;;
        --db-host)
            DB_HOST="$2"
            shift 2
            ;;
        --db-port)
            DB_PORT="$2"
            shift 2
            ;;
        -o|--output-dir)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        --skip-import)
            SKIP_IMPORT=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL client (psql) is not installed. Please install PostgreSQL first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Create and activate virtual environment if it doesn't exist
if [ ! -d "forum_archive_env" ]; then
    echo "Creating virtual environment..."
    python3 -m venv forum_archive_env
fi

echo "Activating virtual environment..."
source forum_archive_env/bin/activate

# Check if required Python packages are installed
echo "Checking required Python packages..."
pip install psycopg2-binary jinja2

# Set script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DUMP_FILE="$PROJECT_ROOT/dump/dump.sql"

# Check if dump file exists
if [ ! -f "$DUMP_FILE" ]; then
    echo "Error: SQL dump file not found at $DUMP_FILE"
    exit 1
fi

# Import database if not skipped
if [ "$SKIP_IMPORT" != "true" ]; then
    echo "Creating database $DB_NAME if it doesn't exist..."
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database already exists or cannot be created."
    
    echo "Importing SQL dump into database $DB_NAME..."
    echo "This may take some time depending on the size of the dump file."
    
    # Create the discourse role if it doesn't exist
    echo "Creating 'discourse' role if it doesn't exist..."
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'discourse') THEN
        CREATE ROLE discourse WITH LOGIN;
    END IF;
END
\$\$;" 2>/dev/null
    
    if [ -z "$DB_PASSWORD" ]; then
        PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$DUMP_FILE"
    else
        export PGPASSWORD="$DB_PASSWORD"
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$DUMP_FILE"
        unset PGPASSWORD
    fi
    
    if [ $? -ne 0 ]; then
        echo "Error: Failed to import SQL dump."
        exit 1
    fi
    
    echo "SQL dump imported successfully."
fi

# Generate forum archive
echo "Generating forum archive..."
if [ -z "$DB_PASSWORD" ]; then
    python3 "$SCRIPT_DIR/generate_forum_archive.py" --db-name "$DB_NAME" --db-user "$DB_USER" --db-host "$DB_HOST" --db-port "$DB_PORT" --output-dir "$OUTPUT_DIR"
else
    python3 "$SCRIPT_DIR/generate_forum_archive.py" --db-name "$DB_NAME" --db-user "$DB_USER" --db-password "$DB_PASSWORD" --db-host "$DB_HOST" --db-port "$DB_PORT" --output-dir "$OUTPUT_DIR"
fi

# Deactivate virtual environment
deactivate

if [ $? -ne 0 ]; then
    echo "Error: Failed to generate forum archive."
    exit 1
fi

echo "Forum archive generation completed successfully!"
echo "The archive is now available at: $PROJECT_ROOT/$OUTPUT_DIR"
echo ""
echo "Next steps:"
echo "1. Build your Hugo site to include the new content:"
echo "   cd $PROJECT_ROOT && hugo"
echo "2. Test the archive to ensure all links work correctly"
echo "3. Deploy the updated site to your web server"
