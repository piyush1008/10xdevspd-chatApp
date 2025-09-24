# System Patterns: Architecture and Technical Decisions

## System Architecture

### Overall Architecture
```
Frontend (React + TypeScript) ←→ Backend (Node.js + Express + TypeScript)
                                        ↓
                                 MongoDB Database
                                        ↓
                                 WebSocket Server
```

### Component Structure

#### Frontend Architecture
- **App.tsx**: Main application component with routing
- **AuthContext**: Global authentication state management
- **Pages**: Route-based components (Home, Chat, Signup, Signin, Join)
- **Components**: Reusable UI components (Button, UseWebsocket)

#### Backend Architecture
- **index.ts**: Main server file with Express and WebSocket setup
- **db.ts**: Database connection configuration
- **schema/**: Mongoose models for User and Room
- **Routes**: REST API endpoints for authentication and room management

## Key Technical Decisions

### Authentication Pattern
- **JWT-based Authentication**: Stateless token-based authentication
- **Context API**: React Context for global auth state management
- **localStorage**: Client-side token and user data persistence
- **Token Validation**: `/me` endpoint for token verification

### Real-time Communication
- **WebSocket Integration**: Native WebSocket API with Express server
- **Message Broadcasting**: Room-based message distribution
- **Connection Management**: Automatic reconnection and cleanup

### Data Flow Patterns

#### Authentication Flow
1. User submits credentials → Backend validates → JWT token returned
2. Token stored in localStorage → Context updates → User authenticated
3. Protected routes check authentication status

#### Chat Flow
1. User joins room → WebSocket connection established
2. Messages sent via WebSocket → Broadcasted to all room participants
3. Real-time message updates in UI

#### Room Management Flow
1. Room creation → Generate unique ID → WebSocket room assignment
2. Room joining → Validate room exists → Connect to WebSocket room
3. Participant tracking → Maintain user list per room

## Design Patterns in Use

### Frontend Patterns
- **Context Provider Pattern**: AuthContext for global state
- **Custom Hooks**: useAuth for authentication logic
- **Component Composition**: Reusable components with props
- **Route-based Architecture**: React Router for navigation

### Backend Patterns
- **RESTful API**: Standard HTTP methods for CRUD operations
- **Middleware Pattern**: Express middleware for CORS, JSON parsing
- **Schema-based Validation**: Mongoose schemas for data validation
- **Event-driven Architecture**: WebSocket event handling

## Component Relationships

### Frontend Dependencies
```
App
├── AuthProvider (Context)
├── Navbar
└── Routes
    ├── HomeComponent
    ├── ChatComponent (uses AuthContext)
    ├── Signup (uses AuthContext)
    ├── Signin (uses AuthContext)
    └── JoinChat
```

### Backend Dependencies
```
index.ts
├── Express App
├── WebSocket Server
├── Database Connection
├── User Schema
└── Room Schema
```

## Data Models

### User Model
```typescript
{
  email: string (unique, required)
  password: string (hashed, required)
  username: string (required)
}
```

### Room Model
```typescript
{
  roomID: string (required)
  username: string (required)
}
```

### WebSocket Message Types
```typescript
// Join Room
{
  type: "join"
  payload: { roomID: string, username: string }
}

// Chat Message
{
  type: "chat"
  payload: { message: string }
}
```

## Security Patterns
- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: Secure token-based authentication
- **CORS**: Cross-origin request handling
- **Input Validation**: Basic validation on API endpoints
