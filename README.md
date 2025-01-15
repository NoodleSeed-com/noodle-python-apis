# Noodle Python APIs

Backend APIs for Noodle services built with FastAPI.

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

## Development

Run the development server:
```bash
uvicorn src.main:app --reload
```

The API will be available at:
- API: http://localhost:8000
- Interactive API docs: http://localhost:8000/docs
- Alternative API docs: http://localhost:8000/redoc

## Project Structure

```
.
├── src/
│   └── main.py          # Main FastAPI application
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## API Documentation

The API documentation is automatically generated and can be accessed at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests (when added)
4. Create a pull request

## License

[Add appropriate license]
