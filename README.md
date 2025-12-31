# Kudos System

A comprehensive feature for an internal employee portal that enables employees to recognize and appreciate their colleagues' contributions.

## Project Structure

```
.
├── backend/              # Node.js + Express API server
├── frontend/            # React TypeScript frontend
├── docs/               # Documentation
└── SPECIFICATION.md    # Complete specification document
```

## Features

- **User Authentication**: Secure JWT-based login system
- **Kudos Creation**: Users can give kudos to colleagues with personalized messages (max 500 characters)
- **Public Feed**: Display of recent kudos with filtering and pagination
- **Content Moderation**: Admin functionality to hide or delete inappropriate messages
- **Audit Trail**: Complete moderation logs for compliance
- **Responsive Design**: Works across different screen sizes

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- MySQL for database
- JWT for authentication
- bcrypt for password hashing

### Frontend
- React with TypeScript
- React Router for navigation
- Axios for API calls
- CSS for styling

## Getting Started

### Prerequisites
- Node.js 16+
- MySQL 8.0+
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

The API will be available at `http://localhost:3000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start development server
npm start
```

The application will open at `http://localhost:3000`

## API Documentation

See the full API documentation in [SPECIFICATION.md](./SPECIFICATION.md#api-endpoints)

### Key Endpoints

**Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

**Kudos**
- `POST /api/kudos` - Create new kudos
- `GET /api/kudos/feed` - Get public kudos feed
- `GET /api/kudos/:id` - Get specific kudos

**Admin**
- `GET /api/admin/kudos` - View all kudos
- `PATCH /api/admin/kudos/:id/hide` - Hide inappropriate kudos
- `DELETE /api/admin/kudos/:id` - Delete kudos
- `GET /api/admin/moderation-logs` - View moderation history

## Database Schema

The system includes three main tables:

- **users**: User accounts and roles
- **kudos**: Kudos messages with moderation fields
- **moderation_logs**: Audit trail of moderation actions

See [SPECIFICATION.md](./SPECIFICATION.md#database-schema) for detailed schema information.

## Development

### Running Tests

**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm test
```

### Code Style

TypeScript is configured with strict mode enabled. The project uses ESLint (configured in both projects).

## Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] JWT secret configured securely
- [ ] CORS origins configured
- [ ] SSL/TLS certificates installed
- [ ] Rate limiting configured
- [ ] Monitoring and logging configured

## Architecture Decisions

The system follows a spec-driven development approach with clear separation of concerns:

1. **Backend**: RESTful API with role-based access control
2. **Frontend**: Component-based React application with client-side routing
3. **Database**: Normalized schema with proper indexing for performance
4. **Security**: JWT authentication, password hashing, SQL injection prevention

## Contributing

Please refer to the [SPECIFICATION.md](./SPECIFICATION.md) for:
- Detailed functional requirements
- Technical design specifications
- Implementation plan
- Testing strategy

## License

MIT

## Support

For issues or questions, please refer to the project documentation or contact the development team.
