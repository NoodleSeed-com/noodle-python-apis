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
- **Description:** Generates an image using Stability AI's API with structured prompts, caching, and error handling.
- **Content-Type:** `multipart/form-data`
- **Request Parameters:**
  ```typescript
  {
    subject: string;       // Required: Main description of what to generate
    style?: string;       // Optional: Artistic style or visual approach
    context?: string;     // Optional: Usage context or theme
    negative_prompt?: string; // Optional: What to avoid in the image
  }
  ```
- **Response:**
  ```json
  {
    "image_url": "https://example.com/storage/v1/object/public/generated-images/123e4567-e89b-12d3-a456-426614174000.png"
  }
  ```
- **Features:**
  - Structured prompts for better results
  - Image caching in Supabase
  - Automatic retries with exponential backoff
  - Error handling with detailed messages
  - Content moderation support

#### Testing the Image Generation Endpoint

You can test the image generation endpoint using `curl`:

1. **Basic Usage:**
    ```bash
    curl -X POST -F "subject=A serene mountain landscape" \
         http://localhost:8000/generate_image/
    ```

2. **With Style and Context:**
    ```bash
    curl -X POST \
         -F "subject=A medical cross symbol" \
         -F "style=minimalist line art" \
         -F "context=healthcare app with blue theme" \
         http://localhost:8000/generate_image/
    ```

3. **Error Handling:**
   - 400: Invalid parameters
   - 403: Content moderation triggered
   - 429: Rate limit exceeded
   - 500: Internal server error

## Frontend Setup

The project includes a Next.js frontend with a reusable ImageGenerator component:

```typescript
import ImageGenerator from './components/ImageGenerator';

// Basic usage
<ImageGenerator 
  subject="A serene mountain landscape"
/>

// Advanced usage
<ImageGenerator 
  subject="A medical cross symbol"
  style="minimalist line art"
  context="healthcare app with blue theme"
  negativePrompt="complex, detailed, photorealistic"
  width={200}
  height={200}
  cornerRadius={16}
  onGenerate={(url) => console.log('Generated:', url)}
  onError={(error) => console.error('Error:', error)}
/>
```

### Preset Scenarios

The frontend includes predefined scenarios for common use cases:

1. Basic Usage
2. Medical App Icon
3. E-commerce Product
4. Game Asset

Each scenario demonstrates optimal parameters for specific use cases.

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
