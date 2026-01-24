# Docker Setup and Usage Guide

## Prerequisites
- Docker installed on your system
- Docker Compose installed

## Quick Start

### 1. Start the Application
```bash
docker-compose up -d
```

This will:
- Create and start MySQL database container
- Import the database schema automatically
- Create and start the Express API container

### 2. Check Running Containers
```bash
docker-compose ps
```

### 3. View Logs
```bash
# All services
docker-compose logs -f

# Only API
docker-compose logs -f api

# Only MySQL
docker-compose logs -f mysql
```

### 4. Stop the Application
```bash
docker-compose down
```

### 5. Stop and Remove All Data
```bash
docker-compose down -v
```

## Accessing Services

- **API**: http://localhost:3000
- **MySQL**: localhost:3306
  - Database: `sdit_rohum`
  - User: `sdit_user`
  - Password: `sdit_password`
  - Root Password: `rootpassword`

## Default Admin Credentials

- **Email**: admin@sditrohum.sch.id
- **Password**: password123

## Common Commands

### Rebuild Containers
```bash
docker-compose up -d --build
```

### Execute MySQL Commands
```bash
docker-compose exec mysql mysql -u sdit_user -psdit_password sdit_rohum
```

### Access API Container Shell
```bash
docker-compose exec api sh
```

### Import SQL File Manually
```bash
docker-compose exec -T mysql mysql -u sdit_user -psdit_password sdit_rohum < database/schema.sql
```

### Backup Database
```bash
docker-compose exec mysql mysqldump -u sdit_user -psdit_password sdit_rohum > backup.sql
```

### Restore Database
```bash
docker-compose exec -T mysql mysql -u sdit_user -psdit_password sdit_rohum < backup.sql
```

## Development Workflow

1. Make changes to your code
2. The API container will auto-reload (nodemon)
3. For database changes, update `database/schema.sql` and reimport

## Troubleshooting

### Port Already in Use
If port 3000 or 3306 is already in use, modify the ports in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change 3001 to any available port
```

### Database Not Connecting
Wait for MySQL to be fully ready:
```bash
docker-compose logs mysql
```
Look for: "ready for connections"

### Reset Everything
```bash
docker-compose down -v
docker-compose up -d --build
```

## Production Deployment

1. Update environment variables in `docker-compose.yml`
2. Change JWT_SECRET to a secure random string
3. Update MySQL passwords
4. Set NODE_ENV to `production`
5. Configure proper CORS_ORIGIN

## Notes

- The `uploads` folder is mounted as a volume for persistent file storage
- `node_modules` is excluded from volume mounting for better performance
- Database data persists in the `mysql_data` volume
