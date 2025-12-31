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

4. Edit `.env` with API URL:
```
REACT_APP_API_URL=http://localhost:3000/api
```

5. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build production bundle
- `npm test` - Run unit tests

## Project Structure

```
src/
├── App.tsx             # Main application component
├── index.tsx          # React DOM entry point
├── pages/             # Full page components
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   └── AdminPage.tsx
├── components/        # Reusable UI components
│   ├── KudosForm.tsx
│   └── KudosFeed.tsx
├── services/          # API client services
│   └── api.ts
├── types/             # TypeScript type definitions
│   └── index.ts
└── public/            # Static files
    └── index.html
```

## Features

### Pages

**Login Page** (`/login`)
- User authentication
- Demo credentials display

**Dashboard** (`/dashboard`)
- Submit kudos to colleagues
- View kudos feed
- Pagination and filtering

**Admin Dashboard** (`/admin`)
- View all kudos (including hidden)
- Moderation logs
- Admin-only access

### Components

**KudosForm**
- User selection with search
- Message input with character counter
- Validation and error handling
- Success confirmation

**KudosFeed**
- Display kudos cards
- Pagination controls
- Filter by recipient
- Loading states

## Authentication

The app uses JWT tokens stored in localStorage. Tokens are automatically sent with all API requests via the Authorization header.

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Troubleshooting

**Cannot connect to API**
- Verify backend is running
- Check REACT_APP_API_URL in .env
- Check browser console for CORS errors

**Login fails**
- Verify backend is running
- Check credentials
- Check backend logs for errors

**Components not loading**
- Clear browser cache (Ctrl+Shift+Delete)
- Restart development server
- Check browser console for errors
