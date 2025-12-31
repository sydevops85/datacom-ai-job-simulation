# Backend Setup Guide

## Prerequisites

- Node.js 16 or higher
- npm or yarn
- MySQL 8.0 or higher

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

4. Edit `.env` with your database credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=kudos_system
PORT=3000
JWT_SECRET=your_secret_key
```

5. Run database migrations:
```bash
npm run migrate
```

6. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm test` - Run unit tests
- `npm run migrate` - Run database migrations

## Project Structure

```
src/
├── index.ts           # Main application entry point
├── controllers/       # Request handlers for each domain
├── routes/           # API endpoint definitions
├── middleware/       # Authentication and error handling
├── database/         # Database connection and migrations
└── types/           # TypeScript type definitions
```

## API Health Check

Test the API is running:
```bash
curl http://localhost:3000/health
```

You should see: `{"status":"OK"}`

## Troubleshooting

**Database Connection Error**
- Verify MySQL is running
- Check credentials in .env file
- Ensure database exists: `CREATE DATABASE kudos_system;`

**Port Already in Use**
- Change PORT in .env file
- Or kill the process using the port

**Migration Fails**
- Check database user has proper privileges
- Run: `GRANT ALL PRIVILEGES ON kudos_system.* TO 'user'@'localhost';`
