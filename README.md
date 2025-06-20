# FundFlow - Mutual Funds Platform

A comprehensive fullstack web application for discovering, analyzing, and managing mutual funds with real-time data from the MFAPI. Built with modern technologies and designed for production deployment with CI/CD pipelines.

## 🚀 Features

### Frontend Features

- **Beautiful, Responsive Design**: Production-ready UI with Tailwind CSS and Apple-level aesthetics
- **Smart Search**: Real-time mutual fund search with MFAPI integration
- **User Authentication**: Secure JWT-based login and registration system
- **Fund Details**: Comprehensive fund information with NAV history and analytics
- **Save & Track**: Personal dashboard for saved funds with removal functionality
- **Mobile Responsive**: Optimized for all device sizes with smooth animations
- **Loading States**: Professional loading spinners and error handling
- **Modern UX**: Micro-interactions, hover effects, and smooth transitions

### Backend Features

- **RESTful API**: Clean, documented API endpoints with proper HTTP status codes
- **JWT Authentication**: Secure user authentication and authorization middleware
- **MongoDB Integration**: Robust data storage with Mongoose ODM and validation
- **Security**: Helmet, rate limiting, CORS, and input validation
- **Error Handling**: Comprehensive error handling and logging system
- **Data Validation**: Server-side validation with express-validator
- **Password Security**: bcrypt hashing with salt rounds

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript for type safety
- **React Router DOM** for client-side routing
- **Tailwind CSS** for utility-first styling
- **Axios** for HTTP requests with interceptors
- **React Hot Toast** for elegant notifications
- **Lucide React** for consistent iconography
- **Vite** for fast development and building

### Backend

- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** (jsonwebtoken) for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers
- **Express Rate Limit** for API protection
- **CORS** for cross-origin resource sharing
- **dotenv** for environment configuration

### Development Tools

- **TypeScript** for static type checking
- **ESLint** for code linting
- **Concurrently** for running multiple processes
- **Nodemon** for backend hot reloading

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account or local MongoDB installation
- **Git** for version control

**Application URLs:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## 🔄 Project Workflow

### Development Workflow

1. **Feature Development**: Create feature branches from `main`
2. **Local Testing**: Test features locally with `npm run dev`
3. **Code Review**: Submit pull requests for code review
4. **Integration Testing**: Automated tests run on PR creation
5. **Deployment**: Merge to `main` triggers automated deployment

### API Workflow

1. **Authentication**: Users register/login to receive JWT tokens
2. **Fund Search**: Frontend queries MFAPI.in for mutual fund data
3. **Fund Details**: Detailed fund information with NAV history
4. **Save Funds**: Authenticated users can save favorite funds
5. **Manage Funds**: Users can view and remove saved funds

### Data Flow

```
Frontend (React) ↔ Backend API (Express) ↔ MongoDB Atlas
                ↓
            MFAPI.in (External API)
```

## 📱 API Endpoints

### Authentication Endpoints

```
POST /api/auth/register     # Register new user
POST /api/auth/login        # Login user
GET  /api/auth/verify       # Verify JWT token
```

### Fund Management Endpoints

```
POST   /api/funds/save              # Save a mutual fund
GET    /api/funds/saved             # Get user's saved funds
DELETE /api/funds/saved/:schemeCode # Remove saved fund
```

### Utility Endpoints

```
GET /api/health             # API health check
```

### Request/Response Examples

## 🚀 CI/CD Pipeline Setup

### GitHub Actions Workflows

#### Frontend Deployment Pipeline

````yaml
# .github/workflows/frontend-deploy.yml

#### Backend Deployment Pipeline

```yaml
# .github/workflows/backend-deploy.yml

### Docker Configuration

#### Frontend Dockerfile

```dockerfile
# Dockerfile.frontend

#### Backend Dockerfile

```dockerfile
# Dockerfile.backend
#### Docker Compose

```yaml
# docker-compose.yml

### Deployment Platforms

#### Frontend Deployment Options

1. **Netlify** (Recommended)

   - Automatic deployments from Git
   - Built-in CDN and SSL
   - Environment variables support

2. **Vercel**

   - Zero-configuration deployments
   - Automatic HTTPS
   - Preview deployments for PRs

3. **AWS S3 + CloudFront**
   - Scalable static hosting
   - Global CDN distribution
   - Custom domain support

#### Backend Deployment Options

1. **Railway** (Recommended)

   - Easy Node.js deployments
   - Automatic scaling
   - Built-in monitoring

2. **Render**

   - Free tier available
   - Automatic deployments
   - Environment variables

3. **AWS ECS/Fargate**
   - Container-based deployment
   - Auto-scaling capabilities
   - Production-grade infrastructure

### Environment Variables for Production

#### Frontend Environment Variables

```env
VITE_API_URL=https://your-backend-url.com
VITE_APP_NAME=FundFlow
````

#### Backend Environment Variables

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend-url.com
```

### CI/CD Best Practices

1. **Automated Testing**: Run tests on every PR
2. **Environment Separation**: Different configs for dev/staging/prod
3. **Secret Management**: Use platform secret managers
4. **Rollback Strategy**: Keep previous deployments for quick rollbacks
5. **Monitoring**: Set up error tracking and performance monitoring
6. **Security Scanning**: Automated vulnerability checks
7. **Code Quality**: ESLint, Prettier, and code coverage checks

## 🔧 Development Scripts

```bash
# Root level commands
npm run dev              # Start both frontend and backend
npm run install:all      # Install all dependencies
npm run build           # Build both applications
npm run test            # Run all tests

# Frontend specific
npm run frontend:dev     # Start frontend dev server
npm run frontend:build   # Build frontend for production
npm run frontend:test    # Run frontend tests

# Backend specific
npm run backend:dev      # Start backend dev server
npm run backend:start    # Start backend in production mode
npm run backend:test     # Run backend tests

# Docker commands
docker-compose up        # Start all services with Docker
docker-compose down      # Stop all services
docker-compose build     # Rebuild Docker images
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   ```
   Error: MongoNetworkError
   ```

   - Verify connection string format
   - Check network access settings in MongoDB Atlas
   - Ensure correct username/password

2. **JWT Token Issues**

   ```
   Error: JsonWebTokenError
   ```

   - Verify JWT_SECRET is set and secure (32+ characters)
   - Check token expiration settings
   - Ensure proper token format in requests

3. **CORS Errors**

   ```
   Error: Access to fetch blocked by CORS policy
   ```

   - Verify FRONTEND_URL in backend .env
   - Check CORS configuration in server.js
   - Ensure proper headers in requests

4. **Build Failures**

   ```
   Error: Module not found
   ```

   - Run `npm install` in both frontend and backend
   - Check import paths and file names
   - Verify TypeScript configurations

5. **API Not Loading**
   ```
   Error: Network Error
   ```
   - Ensure both frontend and backend are running
   - Check proxy configuration in vite.config.ts
   - Verify API endpoints and ports

### Debug Commands

```bash
# Check running processes
npm run ps

# View logs
npm run logs

# Test API endpoints
curl http://localhost:5000/api/health

# Check database connection
npm run db:test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MFAPI.in** for providing mutual fund data
- **MongoDB Atlas** for database hosting
- **Tailwind CSS** for the utility-first CSS framework
- **React Team** for the amazing frontend library
- **Express.js** for the robust backend framework

## 📞 Support

**Built with ❤️ for the investment community**

**Happy Investing! 📈**
