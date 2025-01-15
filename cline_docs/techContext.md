# Technical Context

## Technologies Used
### Core
- Python 3.11+ (primary language)
- FastAPI (web framework)
- PyTorch/TensorFlow (AI/ML)
- Pydantic (data validation)
- Supabase (Backend as a Service)
  - PostgreSQL with RLS
  - Real-time subscriptions
  - Authentication
  - Storage
  - Edge Functions
- Redis (caching/real-time)
- RabbitMQ/Kafka (messaging)

### Infrastructure
- Docker (containerization)
- Kubernetes (orchestration)
- Nginx (reverse proxy)
- Prometheus/Grafana (monitoring)
- ELK Stack (logging)

### Development Tools
- Git (version control)
- Poetry/pip (dependency management)
- Black (code formatting)
- Flake8 (linting)
- Pytest (testing)
- pre-commit hooks
- Supabase CLI

## Development Setup
1. Requirements:
   - Python 3.11+
   - Docker & Docker Compose
   - Git
   - Poetry/pip
   - Supabase CLI
   - Redis (local)

2. Environment Setup:
   ```bash
   # Install Supabase CLI
   brew install supabase/tap/supabase

   # Python environment setup
   python -m venv venv
   source venv/bin/activate  # or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt

   # Start local Supabase
   supabase init
   supabase start
   ```

3. Local Development:
   - Each service runs in its own virtual environment
   - Docker Compose for local service orchestration
   - Environment variables in .env files (not committed)
   - Hot reload enabled for development

4. Local Supabase Environment:
   - Studio Dashboard: http://localhost:54323
   - API Endpoint: http://localhost:54321
   - Database Connection:
     ```
     Host: localhost
     Port: 54322
     Database: postgres
     User: postgres
     Password: postgres
     ```
   - Inbucket (Email Testing): http://localhost:54324
   - Analytics Dashboard: http://localhost:54327

5. Default Credentials:
   - Database:
     - User: postgres
     - Password: postgres
   - Dashboard:
     - Email: admin@admin.com
     - Password: admin

## Technical Constraints
- Python 3.11+ required for performance optimizations
- Async/await patterns preferred for I/O operations
- Strict typing with mypy
- 100% test coverage required for core services
- API versioning mandatory
- Containerization required for all services
- Stateless service design
- Rate limiting on all public endpoints
- Maximum response time: 500ms for API endpoints
- Memory usage limits per container
