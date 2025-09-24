# Project Brief: 10xDevSpd Chat Application

## Project Overview
A real-time chat application built with React frontend and Node.js/Express backend, featuring WebSocket communication for instant messaging and room-based chat functionality.

## Core Requirements

### Functional Requirements
1. **User Authentication**
   - User registration with email, username, and password
   - User login with email and password
   - JWT-based authentication with token storage
   - Session persistence across browser refreshes

2. **Chat Functionality**
   - Real-time messaging using WebSocket connections
   - Room-based chat system with unique room IDs
   - Create new chat rooms with auto-generated room IDs
   - Join existing rooms by entering room ID
   - Message history display with timestamps
   - Username display for each message

3. **Room Management**
   - Generate random room IDs for new rooms
   - Validate room existence before joining
   - Display all participants in a room
   - Copy room ID to clipboard functionality

4. **User Interface**
   - Clean, modern UI with Tailwind CSS
   - Responsive design for mobile and desktop
   - Loading states and error handling
   - Navigation between different pages

### Technical Requirements
1. **Frontend (React + TypeScript)**
   - React Router for navigation
   - Context API for authentication state management
   - WebSocket client for real-time communication
   - Axios for HTTP requests
   - Tailwind CSS for styling

2. **Backend (Node.js + Express + TypeScript)**
   - Express.js REST API
   - WebSocket server for real-time communication
   - MongoDB with Mongoose for data persistence
   - JWT for authentication
   - bcrypt for password hashing
   - CORS enabled for cross-origin requests

3. **Database Schema**
   - User collection: email, password (hashed), username
   - Room collection: roomID, username (for participant tracking)

## Success Criteria
- Users can register, login, and maintain authenticated sessions
- Real-time messaging works seamlessly across multiple users
- Room creation and joining functionality works reliably
- Clean, intuitive user interface
- Proper error handling and user feedback
- Secure authentication and data storage

## Current Status
The application is functional with basic chat features implemented. Recent improvements include room validation, participant display, and UI enhancements.
