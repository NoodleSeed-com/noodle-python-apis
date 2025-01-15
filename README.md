# Noodle Python APIs

Backend APIs for Noodle services built with FastAPI and Supabase.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up Supabase locally:
```bash
# Install Supabase CLI if not already installed
brew install supabase/tap/supabase

# Start Supabase services
supabase start
```

## Development

Run the development server:
```bash
uvicorn src.main:app --reload
```

The API will be available at:
- API: http://localhost:8000
- Interactive API docs: http://localhost:8000/docs
- Alternative API docs: http://localhost:8000/redoc

Supabase services will be available at:
- Database: postgresql://postgres:postgres@localhost:54322/postgres
- Studio: http://localhost:54323
- API: http://localhost:54321
- JWT Secret: super-secret-jwt-token-with-at-least-32-characters-long

## Project Structure

```
.
├── src/
│   └── main.py          # Main FastAPI application
├── supabase/
│   ├── config.toml      # Supabase configuration
│   └── .gitignore      # Supabase-specific ignores
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## API Documentation

The API documentation is automatically generated and can be accessed at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Database

The project uses Supabase as the database and backend service provider. When running locally:

- Database URL: postgresql://postgres:postgres@localhost:54322/postgres
- Supabase Studio: http://localhost:54323
  - Use Studio for:
    - Database management
    - User authentication
    - Storage management
    - API documentation
    - Real-time subscriptions

### Database Migrations

```bash
# Create a new migration
supabase db diff create_users

# Apply migrations
supabase db reset
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests (when added)
4. Create a pull request

## License

[Add appropriate license]
