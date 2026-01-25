# SD IT Rohmatul Ummah - Backend API

Backend API for SD IT Rohmatul Ummah school website built with Express.js and MySQL.

## Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **bcrypt** - Password hashing

## Getting Started

### Prerequisites

- Docker & Docker Compose installed
- Node.js (v20 or higher) - if running without Docker
- MySQL (v8 or higher) - if running without Docker

## Running with Docker (Recommended)

Docker eliminates "works on my machine" issues by containerizing the entire application.

### Quick Start

1. Clone the repository
```bash
git clone <repository-url>
cd sdit-rohum-api
```

2. Create environment file
```bash
cp .env.example .env
```

3. Configure `.env` file (optional - defaults are already set)

4. Start the application
```bash
docker-compose up -d
```

The database schema will be automatically imported on first startup.

5. Verify it's running
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f

# Test health endpoint
curl http://localhost:3000/api/health
```

**Default credentials:**
- Email: `admin@sditrohum.sch.id`
- Password: `password123`

### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f api        # API logs only
docker-compose logs -f mysql      # MySQL logs only

# Rebuild containers
docker-compose up -d --build

# Reset everything (removes volumes)
docker-compose down -v

# Access MySQL shell
npm run db:shell:user
npm run db:shell:root

# Manual MySQL access
docker exec -it sdit-rohum-mysql mysql -u sdit_user -psdit_password sdit_rohum
```

**Services:**
- API: http://localhost:3000
- MySQL: localhost:3306

For detailed Docker documentation, see [DOCKER.md](DOCKER.md)

## Running Locally (Without Docker)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd sdit-rohum-api
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Configure your `.env` file
```env
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=sdit_rohum
```

5. Create database and import schema
```bash
mysql -u your_user -p < database/schema.sql
```

6. Start development server
```bash
npm run dev
```

The API will be running at `http://localhost:3000`

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run db:shell:user` - Access MySQL as sdit_user (Docker)
- `npm run db:shell:root` - Access MySQL as root (Docker)

## API Documentation

### Authentication

**Login**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@sditrohum.sch.id",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Administrator",
      "email": "admin@sditrohum.sch.id",
      "role": "admin"
    }
  }
}
```

**Get Profile** (Protected)
```bash
GET /api/auth/profile
Authorization: Bearer <token>
```

**Logout** (Protected)
```bash
POST /api/auth/logout
Authorization: Bearer <token>
```

### Public Endpoints

- `GET /api/health` - Health check

## Project Structure

```
sdit-rohum-api/
├── src/
│   ├── config/         # Configuration files
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   ├── controllers/    # Route controllers
│   ├── models/         # Database models
│   ├── validators/     # Input validation
│   └── utils/          # Utility functions
├── uploads/            # Uploaded files
├── database/           # Database schema
├── server.js           # Entry point
└── package.json
```

## License

ISC

## Contact

SD IT Rohmatul Ummah
