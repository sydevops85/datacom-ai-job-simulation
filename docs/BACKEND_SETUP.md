# Backend Setup Guide

## Prerequisites

- Node.js 16 or higher
- npm or yarn
- Database (MySQL 8.0 or higher, or compatible alternative)

## Installation Steps

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
```bash
cp .env.example .env
```

4. Edit `.env` with your actual database credentials:
   - `DB_HOST`: Your database server hostname
   - `DB_PORT`: Your database server port (default: 3306)
   - `DB_USER`: Database user account
   - `DB_PASSWORD`: Secure password for database user
   - `DB_NAME`: Name of the database
   - `JWT_SECRET`: Generate a strong random secret

5. Run database migrations:
```bash
npm run migrate
```

6. Start the development server:
```bash
npm run dev
```

The API will be available at the URL configured in your environment.

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm test` - Run unit tests
- `npm run migrate` - Run database migrations

## Project Structure

```
src/
 index.ts           # Main application entry point
 controllers/       # Request handlers for each domain
 routes/           # API endpoint definitions
 middleware/       # Authentication and error handling
 database/         # Database connection and migrations
 types/           # TypeScript type definitions
```

## Generating JWT Secret

Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and set it in your `.env` file as `JWT_SECRET`.

## API Health Check

Test the API is running:
```bash
curl http://<your-api-url>/health
```

You should see: `{"status":"OK"}`

## Troubleshooting

**Database Connection Error**
- Verify database server is running and accessible
- Check credentials in `.env` file
- Ensure database user has appropriate permissions

**Port Already in Use**
- Change the PORT value in `.env` file
- Or kill the process using the port

**Migration Issues**
- Ensure database user has CREATE/ALTER TABLE permissions
- Check database connectivity before running migrations

## Production Deployment

For production deployment:
1. Set `NODE_ENV=production` in `.env`
2. Use a strong, unique JWT_SECRET
3. Configure CORS_ORIGIN to match your frontend domain
4. Use HTTPS connections
5. Enable security headers (Helmet.js is configured)
6. Set up proper logging and monitoring
7. Configure database backups
8. Implement rate limiting

See [SECURITY.md](../SECURITY.md) for comprehensive security guidelines.
