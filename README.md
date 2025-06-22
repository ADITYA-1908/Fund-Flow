# FundFlow - Mutual Funds Platform

A comprehensive fullstack web application for discovering, analyzing, and managing mutual funds with real-time data from the MFAPI. Built with modern technologies and designed for production deployment.

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

#### Frontend Environment Variables

```env
VITE_API_URL=https://your-backend-url.com
VITE_APP_NAME=FundFlow
```

#### Backend Environment Variables

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend-url.com
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Happy Investing! 📈**
