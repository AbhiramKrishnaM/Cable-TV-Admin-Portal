# CableTV Admin Panel Server

A Node.js/Express server with TypeScript and MongoDB integration for the CableTV Admin Panel.

## Features

- Express.js server with TypeScript
- MongoDB integration with Mongoose
- User management API
- CORS enabled
- Environment variable configuration
- Hot reloading with nodemon

## Prerequisites

- Node.js (v14 or higher)
- MongoDB running locally or accessible via connection string

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your MongoDB connection string and other configurations.

## Development

Start the development server with hot reloading:
```bash
npm run dev
```

## Building

Build the TypeScript code:
```bash
npm run build
```

## Production

Start the production server:
```bash
npm start
```

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── models/          # MongoDB models
├── routes/          # API routes
├── middleware/      # Custom middleware
└── server.ts        # Main server file
``` 