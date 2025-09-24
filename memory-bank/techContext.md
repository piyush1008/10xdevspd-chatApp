# Technical Context: Technologies and Setup

## Technology Stack

### Frontend Technologies
- **React 19.1.1**: Modern React with latest features
- **TypeScript 5.8.3**: Type-safe JavaScript development
- **Vite 7.1.2**: Fast build tool and development server
- **React Router DOM 7.8.2**: Client-side routing
- **Tailwind CSS 4.1.12**: Utility-first CSS framework
- **Axios 1.11.0**: HTTP client for API requests
- **ESLint 9.33.0**: Code linting and formatting

### Backend Technologies
- **Node.js**: JavaScript runtime environment
- **Express 5.1.0**: Web application framework
- **TypeScript**: Type-safe server-side development
- **WebSocket (ws 8.18.3)**: Real-time communication
- **MongoDB**: NoSQL database
- **Mongoose 8.18.0**: MongoDB object modeling
- **JWT (jsonwebtoken 9.0.2)**: Authentication tokens
- **bcrypt 6.0.0**: Password hashing
- **CORS 2.8.5**: Cross-origin resource sharing

## Development Setup

### Frontend Setup
```bash
cd frontend
npm install
npm run dev    # Development server
npm run build  # Production build
npm run lint   # Code linting
```

### Backend Setup
```bash
cd backend
npm install
npm run dev    # Development with TypeScript compilation
npm run build  # TypeScript compilation
npm start      # Production server
```

## Environment Configuration

### Frontend Environment Variables
- `VITE_API_URL`: Backend API URL (default: http://localhost:3000)

### Backend Environment Variables
- `PORT`: Server port (default: 8080)
- MongoDB connection string (configured in db.ts)

## Build and Deployment

### Frontend Build Process
1. TypeScript compilation (`tsc -b`)
2. Vite bundling and optimization
3. Static asset generation
4. Output to `dist/` directory

### Backend Build Process
1. TypeScript compilation (`tsc -b`)
2. Output to `dist/` directory
3. Node.js server startup

## Database Configuration

### MongoDB Setup
- Connection established in `backend/src/db.ts`
- Two main collections: `users` and `rooms`
- Mongoose schemas for data validation

### Database Models
- **User Schema**: email, password, username
- **Room Schema**: roomID, username

## API Endpoints

### Authentication Endpoints
- `POST /signup`: User registration
- `POST /signin`: User login
- `POST /me`: Token validation
- `POST /logout`: User logout

### Room Management Endpoints
- `GET /room/:id/exists`: Check room existence
- `POST /getAllParticipants`: Get room participants

### WebSocket Endpoints
- `WS /ws`: WebSocket connection for real-time chat

## Technical Constraints

### Frontend Constraints
- Modern browser support required for WebSocket API
- LocalStorage dependency for authentication persistence
- Responsive design requirements for mobile compatibility

### Backend Constraints
- Node.js runtime environment
- MongoDB database dependency
- WebSocket server integration with Express

## Dependencies Management

### Frontend Dependencies
- React ecosystem (React, React DOM, React Router)
- Build tools (Vite, TypeScript, ESLint)
- Styling (Tailwind CSS)
- HTTP client (Axios)

### Backend Dependencies
- Express ecosystem (Express, CORS)
- Database (MongoDB, Mongoose)
- Authentication (JWT, bcrypt)
- Real-time communication (WebSocket)
- Development tools (TypeScript types)

## Development Workflow
1. Frontend and backend run on separate ports
2. CORS enabled for cross-origin requests
3. Hot reloading available in development
4. TypeScript compilation for both frontend and backend
5. ESLint for code quality enforcement
