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

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

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

4. Configure your `.env` file with your database credentials

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

## API Documentation

### Public Endpoints

- `GET /api/health` - Health check
- `GET /api/news` - Get news list
- `GET /api/news/:slug` - Get single news article
- `GET /api/teachers` - Get teachers list
- `GET /api/students` - Get students list
- More endpoints documented in BACKEND_CONTEXT.md

### Admin Endpoints (Require JWT)

- `POST /api/auth/login` - Admin login
- `POST /api/admin/news` - Create news
- More endpoints documented in BACKEND_CONTEXT.md

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
