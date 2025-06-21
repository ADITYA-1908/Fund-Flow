# FundFlow API Documentation

## Overview

The FundFlow API is a comprehensive RESTful service for managing mutual funds data and user interactions. Built with Node.js, Express, and MongoDB, it provides secure authentication, fund management, and user data operations.

## Base URLs

- **Development**: `http://localhost:5000`
- **Production**: `https://api.fundflow.com`
- **Staging**: `https://staging-api.fundflow.com`

## Interactive Documentation

Visit the interactive Swagger UI documentation:
- **Development**: http://localhost:5000/api/docs
- **Production**: https://api.fundflow.com/api/docs

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Lifecycle
- **Expiration**: 7 days
- **Refresh**: Not implemented (user must re-login)
- **Storage**: Client-side (localStorage recommended)

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **General endpoints**: 100 requests per 15 minutes per IP
- **Authentication endpoints**: 5 requests per minute per IP

## API Endpoints

### Health Check

#### GET /api/health
Check if the API is running and healthy.

**Response:**
```json
{
  "status": "OK",
  "message": "Mutual Funds API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Authentication

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Validation Rules:**
- `name`: 2-50 characters, required
- `email`: Valid email format, unique, required
- `password`: Minimum 6 characters, required


#### POST /api/auth/login
Authenticate user with email and password.

#### GET /api/auth/verify
Verify JWT token validity and get user information.

**Headers:**
```
Authorization: Bearer <jwt-token>
```
## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Server-side validation using express-validator
- **Rate Limiting**: Protection against API abuse
- **CORS**: Configured for specific origins
- **Helmet**: Security headers for protection
- **Environment Variables**: Sensitive data protection

## External Dependencies

### MFAPI.in Integration
The frontend integrates with [MFAPI.in](https://www.mfapi.in) for mutual fund data:

- **Search**: `https://api.mfapi.in/mf/search?q={query}`
- **Fund Details**: `https://api.mfapi.in/mf/{schemeCode}`

## Testing

### Manual Testing with cURL

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Save Fund
```bash
curl -X POST http://localhost:5000/api/funds/save \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "schemeCode": "120503",
    "schemeName": "Test Fund"
  }'
```

#### Get Saved Funds
```bash
curl -X GET http://localhost:5000/api/funds/saved \
  -H "Authorization: Bearer <your-token>"
```

### Testing with Postman

1. Import the Swagger JSON file into Postman
2. Set up environment variables for base URL and token
3. Use the collection to test all endpoints

## Deployment


### Health Monitoring

Monitor the API health using the `/api/health` endpoint:

```bash
curl http://localhost:5000/api/health
```

Expected response indicates healthy API:
```json
{
  "status": "OK",
  "message": "Mutual Funds API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Support

For API support:
- Check the interactive documentation at `/api/docs`
- Review error messages for specific guidance
- Ensure proper authentication headers
- Verify request body format and required fields

## Changelog

### Version 1.0.0
- Initial API release
- User authentication system
- Fund management endpoints
- Swagger documentation
- Rate limiting and security features