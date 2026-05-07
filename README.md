# Pomodoro Task Management API

A robust Node.js and Express.js backend for a Pomodoro Task Management application with JWT authentication, MongoDB integration, and RESTful API endpoints.

## Features

- **User Authentication**: Secure JWT-based authentication with Bcrypt password hashing
- **Task Management**: Create, read, update, and delete tasks with priority levels
- **User Settings**: Customize Pomodoro and break durations
- **Private Routes**: Protected endpoints that require JWT authentication
- **Error Handling**: Comprehensive error handling for 404 and 500 status codes
- **Environment Variables**: Secure configuration using dotenv

## Project Structure

```
pomodoro/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   └── taskController.js     # Task management logic
├── middleware/
│   └── auth.js               # JWT protection middleware
├── models/
│   ├── User.js               # User schema
│   └── Task.js               # Task schema
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   └── taskRoutes.js         # Task endpoints
├── .env                       # Environment variables
├── server.js                  # Entry point
├── package.json               # Dependencies
└── README.md                  # This file
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)

### Setup Steps

1. **Clone or navigate to project directory**
   ```bash
   cd pomodoro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Open `.env` file and update:
     ```
     MONGO_URI=your_mongodb_atlas_uri
     JWT_SECRET=your_secure_jwt_secret
     PORT=5000
     NODE_ENV=development
     ```

4. **Start the server**
   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

The server will run on `http://localhost:5000`

## MongoDB Atlas Setup

Follow these steps to connect to MongoDB Atlas:

### 1. Create MongoDB Atlas Account
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Sign up for a free account
- Create a new project

### 2. Create a Cluster
- Click "Build a Database"
- Choose the free tier (M0)
- Select your preferred region
- Click "Create Deployment"

### 3. Setup Network Access
- In the Atlas dashboard, go to "Network Access"
- Click "Add IP Address"
- Select "Allow access from anywhere" (0.0.0.0/0) for development
- **Note**: For production, use specific IP addresses for security

### 4. Create Database User
- Go to "Database Access"
- Click "Add New Database User"
- Set a username and password
- Grant "Read and write to any database" permissions
- Click "Create User"

### 5. Get Connection String
- Go back to "Databases"
- Click "Connect" on your cluster
- Select "Drivers"
- Choose "Node.js" and version "4.1 or later"
- Copy the connection string
- Replace `<password>` with your database user password
- Replace `<database>` with `pomodoro`

### 6. Update `.env` File
```
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/pomodoro?retryWrites=true&w=majority
JWT_SECRET=your_very_secure_jwt_secret_key_here
```

## API Endpoints

### Authentication Routes (`/auth`)

#### Register User
- **POST** `/auth/register`
- **Body**: `{ email, password }`
- **Response**: JWT token and user data
- **Status**: 201 Created

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

#### Login User
- **POST** `/auth/login`
- **Body**: `{ email, password }`
- **Response**: JWT token and user data
- **Status**: 200 OK

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

#### Get Current User
- **GET** `/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User data with settings
- **Status**: 200 OK

```bash
curl -X GET http://localhost:5000/auth/me \
  -H "Authorization: Bearer your_jwt_token"
```

### Task Routes (`/tasks`)

All task routes require JWT authentication (Bearer token in Authorization header)

#### Get All Tasks
- **GET** `/tasks`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of user's tasks
- **Status**: 200 OK

```bash
curl -X GET http://localhost:5000/tasks \
  -H "Authorization: Bearer your_jwt_token"
```

#### Create Task
- **POST** `/tasks`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Complete project",
    "description": "Finish the backend API",
    "priority": "High",
    "estimated_pomos": 5
  }
  ```
- **Response**: Created task object
- **Status**: 201 Created

```bash
curl -X POST http://localhost:5000/tasks \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the backend API",
    "priority": "High",
    "estimated_pomos": 5
  }'
```

#### Update Task
- **PUT** `/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body** (all fields optional):
  ```json
  {
    "title": "Updated title",
    "status": "In-Progress",
    "completed_pomos": 2
  }
  ```
- **Response**: Updated task object
- **Status**: 200 OK

```bash
curl -X PUT http://localhost:5000/tasks/task_id_here \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In-Progress",
    "completed_pomos": 2
  }'
```

#### Delete Task
- **DELETE** `/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message
- **Status**: 200 OK

```bash
curl -X DELETE http://localhost:5000/tasks/task_id_here \
  -H "Authorization: Bearer your_jwt_token"
```

## Response Format

### Success Response
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "settings": {
      "pomodoroDuration": 25,
      "breakDuration": 5,
      "longBreakDuration": 15
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

## Data Models

### User Schema
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  settings: {
    pomodoroDuration: Number (default: 25),
    breakDuration: Number (default: 5),
    longBreakDuration: Number (default: 15)
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Task Schema
```javascript
{
  userId: ObjectId (reference to User),
  title: String (required),
  description: String,
  priority: String (Low/Med/High, default: Med),
  estimated_pomos: Number (default: 1),
  completed_pomos: Number (default: 0),
  status: String (Todo/In-Progress/Done, default: Todo),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- **Password Hashing**: Bcryptjs with salt rounds = 10
- **JWT Authentication**: 30-day token expiration
- **Protected Routes**: Middleware validates JWT on private endpoints
- **Input Validation**: Schema validation on all models
- **CORS**: Enabled for cross-origin requests
- **Environment Variables**: Sensitive data not hardcoded

## Development

### Run Development Server
```bash
npm run dev
```
The server auto-reloads on file changes using Nodemon.

### Production Build
```bash
npm start
```

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Missing or invalid input data
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: User not authorized to access resource
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Server-side errors

## Testing the API

You can test the API using:
- **Postman**: Import the endpoints and test with GUI
- **cURL**: Use the curl examples provided in the API docs
- **Thunder Client**: VS Code extension for API testing
- **Insomnia**: Open-source API testing tool

## Deployment Considerations

For production deployment:

1. **Update JWT_SECRET**: Use a strong, random secret
2. **Set NODE_ENV=production**: Reduces error details in responses
3. **Use HTTPS**: Ensure all API calls use HTTPS
4. **IP Whitelist**: Restrict MongoDB network access to your server IP
5. **Rate Limiting**: Implement rate limiting to prevent abuse
6. **Logging**: Add comprehensive logging for monitoring

## Troubleshooting

### Connection refused error
- Ensure MongoDB Atlas cluster is running
- Check MONGO_URI in .env file
- Verify network access settings in MongoDB Atlas

### JWT errors
- Ensure JWT_SECRET is set in .env
- Check token format: `Bearer <token>` in Authorization header
- Verify token hasn't expired

### CORS errors
- CORS is enabled by default
- If still having issues, check frontend origin configuration

## Future Enhancements

- [ ] Email verification for new accounts
- [ ] Password reset functionality
- [ ] Task categories/tags
- [ ] Collaborative task sharing
- [ ] Analytics and productivity reports
- [ ] WebSocket for real-time updates
- [ ] Rate limiting and throttling
- [ ] Two-factor authentication

## License

ISC

## Support

For issues or questions, please refer to the API documentation or create an issue in the project repository.
