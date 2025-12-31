# Frontend Setup Guide

## Prerequisites

- Node.js 16 or higher
- npm or yarn
- Backend API running (see BACKEND_SETUP.md)

## Installation Steps

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
```bash
cp .env.example .env
```

4. Edit `.env` with your API URL:
```
REACT_APP_API_URL=<your-backend-api-url>
```

Replace `<your-backend-api-url>` with your actual backend URL (e.g., `https://api.yourdomain.com` or `http://localhost:3000/api`)

5. Start the development server:
```bash
npm start
```

The application will open in your default browser.

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build production bundle
- `npm test` - Run unit tests
- `npm run eject` - Eject from Create React App (irreversible)

## Project Structure

```
src/
 App.tsx             # Main application component
 index.tsx          # React DOM entry point
 pages/             # Full page components
    LoginPage.tsx
    DashboardPage.tsx
    AdminPage.tsx
 components/        # Reusable UI components
    KudosForm.tsx
    KudosFeed.tsx
 services/          # API client services
    api.ts
 types/             # TypeScript type definitions
    index.ts
 public/            # Static files
     index.html
```

## Features

### Pages

**Login Page** (`/login`)
- User authentication
- Secure JWT token handling
- Session management

**Dashboard** (`/dashboard`)
- Submit kudos to colleagues
- View kudos feed
- Pagination and filtering
- Real-time feedback

**Admin Dashboard** (`/admin`)
- View all kudos (including moderated)
- Content moderation
- Moderation logs and audit trail
- Administrative actions

## Environment Variables

### Required
- `REACT_APP_API_URL`: Your backend API endpoint

### Example Configuration

Development:
```
REACT_APP_API_URL=http://localhost:3000/api
```

Production:
```
REACT_APP_API_URL=https://api.yourdomain.com/api
```

## Build for Production

```bash
npm run build
```

Creates an optimized production build in the `build/` directory.

## Testing

```bash
npm test
```

Runs tests in interactive mode.

## Troubleshooting

**Blank Page or 404 Error**
- Verify the backend API is running and accessible
- Check `REACT_APP_API_URL` in `.env` file
- Open browser DevTools Console to check for errors

**CORS Errors**
- Ensure backend CORS_ORIGIN is configured to match your frontend URL
- Check backend .env CORS_ORIGIN setting

**API Connection Refused**
- Verify backend server is running
- Check that `REACT_APP_API_URL` points to the correct backend address
- Ensure no firewall is blocking the connection

## Deployment

For production deployment:
1. Build the application: `npm run build`
2. Deploy the `build/` directory to your web server
3. Configure backend API URL for production environment
4. Ensure HTTPS is enabled
5. Set appropriate cache headers
6. Configure error logging and monitoring

See [SECURITY.md](../SECURITY.md) for comprehensive security guidelines.
