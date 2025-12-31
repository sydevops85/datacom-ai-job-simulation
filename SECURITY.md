# Security Policy

## Overview

The Kudos System is designed with security as a core principle. This document outlines the security measures implemented and best practices for deployment.

## Sensitive Information

⚠️ **NEVER commit the following to the repository:**
- `.env` files with real credentials
- API keys or secrets
- Database passwords
- JWT secrets
- Private keys
- User credentials or test data with passwords

All `.env` files are listed in `.gitignore` to prevent accidental commits.

## Environment Configuration

### Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Update with secure values:**
   ```bash
   # Database credentials
   DB_HOST=your_host
   DB_USER=your_user
   DB_PASSWORD=your_secure_password

   # Generate a strong JWT secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   # Then set: JWT_SECRET=your_generated_secret
   ```

## Authentication & Authorization

### Password Security
- **In Production**: Use bcrypt (12+ rounds) to hash all passwords before storing
- **Never** store passwords in plain text
- **Implement** password reset functionality with expiring tokens
- **Enforce** strong password policies

### JWT Tokens
- **Secret Key**: Use a strong, randomly generated secret (minimum 256 bits)
- **Expiry**: Set reasonable token expiration times (24 hours recommended)
- **Refresh Tokens**: Implement refresh token rotation for long-lived sessions
- **Secure Storage**: Store tokens in httpOnly cookies or secure session storage

### Role-Based Access Control
- Only authenticated users can access the API
- Admin endpoints require admin role verification
- Moderation operations are restricted to admin users

## Database Security

### Parameterized Queries
All database queries use parameterized statements to prevent SQL injection:
```typescript
// ✅ GOOD - Uses parameterized query
const result = await executeQuery(
  'SELECT * FROM users WHERE username = ?',
  [username]
);

// ❌ BAD - String concatenation (vulnerable)
const result = await executeQuery(
  `SELECT * FROM users WHERE username = '${username}'`
);
```

### Connection Security
- **Use HTTPS**: Always use encrypted connections to the database
- **Connection Pooling**: Implement connection pooling with limits
- **Credentials**: Store DB credentials in environment variables
- **Firewall**: Restrict database access to application servers only

## Input Validation

All user inputs are validated server-side:
- **Message Length**: Max 500 characters enforced
- **Username Format**: Alphanumeric validation
- **Email Format**: RFC 5322 validation
- **Type Checking**: All inputs validated against expected types
- **XSS Prevention**: HTML entity encoding on output

## API Security

### CORS Configuration
```typescript
// Restrict CORS to trusted origins only
const corsOptions = {
  origin: process.env.CORS_ORIGIN, // Set in .env
  credentials: true,
  optionsSuccessStatus: 200
};
```

### Security Headers
- **Helmet.js**: Implements security headers automatically
- **Content Security Policy**: Prevents inline scripts
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME type sniffing

### Rate Limiting
- **Kudos Creation**: Max 1 per hour per user to the same recipient
- **Login Attempts**: Should implement exponential backoff
- **API Endpoints**: Consider global rate limiting in production

## Deployment Security Checklist

- [ ] Remove all `.env` files from repository
- [ ] Generate unique JWT secret for production
- [ ] Use strong database password (minimum 12 characters, mixed case, numbers, symbols)
- [ ] Enable HTTPS/SSL on all endpoints
- [ ] Configure CORS_ORIGIN to actual frontend URL
- [ ] Set NODE_ENV=production
- [ ] Implement HTTPS redirects
- [ ] Enable database encryption at rest
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerting
- [ ] Enable audit logging
- [ ] Use secrets management (AWS Secrets Manager, HashiCorp Vault, etc.)
- [ ] Implement database backups
- [ ] Set up IP whitelisting if applicable

## Security Headers

The application implements the following security headers via Helmet.js:
- `Strict-Transport-Security`: Enforces HTTPS
- `X-Content-Type-Options`: `nosniff`
- `X-Frame-Options`: `DENY`
- `X-XSS-Protection`: `1; mode=block`
- `Content-Security-Policy`: Restricts script sources

## Logging & Monitoring

### What to Log
- Authentication attempts (success and failures)
- Authorization failures
- Admin actions (hide, delete kudos)
- API errors and exceptions
- Unusual patterns or suspicious activities

### What NOT to Log
- Passwords or password hashes
- API keys or secrets
- Full HTTP request/response bodies with sensitive data
- Personal information beyond what's necessary

## Incident Response

In case of a security incident:
1. **Identify** the compromise scope
2. **Contain** the incident (disable accounts, revoke tokens)
3. **Eradicate** the threat
4. **Recover** normal operations
5. **Document** lessons learned
6. **Notify** affected users if necessary

## Vulnerability Disclosure

If you discover a security vulnerability:
1. **Do NOT** create a public issue
2. **Contact** the development team privately
3. **Provide** detailed information about the vulnerability
4. **Allow** reasonable time for remediation before disclosure

## Dependencies Security

- **Regular Updates**: Keep all dependencies up to date
- **Security Audits**: Run `npm audit` regularly
- **Supply Chain**: Use npm lockfile to ensure reproducible installs
- **Known Vulnerabilities**: Monitor advisories from Node.js security mailing list

## Production Deployment

### Database
```bash
# Use environment variables for all credentials
export DB_HOST="secure-host"
export DB_USER="secure-user"
export DB_PASSWORD="secure-password"
export DB_NAME="kudos_system"
```

### Application
```bash
# Set production environment
export NODE_ENV="production"
export JWT_SECRET="$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
export CORS_ORIGIN="https://yourdomain.com"
```

### Reverse Proxy (Nginx Example)
```nginx
server {
  listen 443 ssl http2;
  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;

  location /api {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## Testing Security

- **Penetration Testing**: Regular third-party security testing
- **OWASP Top 10**: Ensure protection against common vulnerabilities
- **Static Analysis**: Use code analysis tools to identify issues
- **Dynamic Testing**: Runtime security validation

## References

- [OWASP Top 10](https://owasp.org/Top10/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Last Updated**: December 31, 2025
**Version**: 1.0
