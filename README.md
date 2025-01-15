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

## API Endpoints

### Health Check

- **URL:** `/health`
- **Method:** `GET`
- **Description:** Checks the health of the application.
- **Response:**
  ```json
  {
    "status": "healthy",
    "version": "0.1.0"
  }
  ```

### Image Generation

- **URL:** `/generate_image/`
- **Method:** `POST`
- **Description:** Generates an image based on a text prompt using Google's Imagen model, with caching and rate limiting.
- **Rate Limit:** 10 requests per minute
- **Request Body:**
  ```json
  {
    "prompt": "A cat wearing a hat"
  }
  ```
- **Response:**
  ```json
  {
    "image_url": "https://example.com/storage/v1/object/public/generated-images/123e4567-e89b-12d3-a456-426614174000.png"
  }
  ```
- **Features:**
  - Caching: Previously generated images are cached to improve response time
  - Rate Limiting: 10 requests per minute per IP
  - Retry Logic: Automatic retries with exponential backoff
  - Error Handling: Detailed error messages and logging
  - Storage: Images stored in Supabase storage

#### Testing the Image Generation Endpoint

You can test the image generation endpoint using `curl`:

1. **Generate a new image:**
    ```bash
    curl -X POST -H "Content-Type: application/json" \
         -d '{"prompt": "A cat wearing a hat"}' \
         http://localhost:8000/generate_image/
    ```
    Response will contain a URL to the generated image.

2. **Test caching (same prompt):**
    ```bash
    # Second request with same prompt will return cached image URL
    curl -X POST -H "Content-Type: application/json" \
         -d '{"prompt": "A cat wearing a hat"}' \
         http://localhost:8000/generate_image/
    ```

3. **Rate Limiting:**
    - Endpoint is limited to 10 requests per minute per IP
    - Exceeding this limit will return a 429 Too Many Requests response

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
