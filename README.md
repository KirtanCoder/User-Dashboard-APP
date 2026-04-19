# User Dashboard App

User Dashboard App is a full-stack authentication dashboard project built with HTML, CSS, JavaScript, Node.js, Express, MongoDB, Mongoose, bcrypt, and JWT.

The application allows users to create an account, log in securely, and access a protected dashboard page.

## Project Features

- User signup
- User login
- Password hashing using bcrypt
- JWT-based authentication
- Protected dashboard page
- Logged-in user profile fetch
- Responsive frontend design
- Express backend API
- MongoDB database connection using Mongoose
- Frontend served from the backend

## Tech Stack

**Frontend**

- HTML
- CSS
- JavaScript

**Backend**

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors

## Folder Structure

```text
User Dashboard APP/
|-- backend/
|   |-- models/
|   |   `-- user.js
|   |-- routes/
|   |   `-- auth.js
|   |-- .env
|   |-- .env.example
|   |-- package.json
|   `-- server.js
|-- frontend/
|   |-- dashboard.html
|   |-- index.html
|   |-- login.html
|   |-- signup.html
|   |-- script.js
|   `-- styles.css
|-- .gitignore
|-- package.json
|-- render.yaml
`-- README.md
```

## Prerequisites

Before running this project, make sure these are installed:

- Node.js
- npm
- MongoDB

You can check Node.js and npm with:

```bash
node -v
npm -v
```

## Environment Variables

Create a `.env` file inside the `backend` folder.

Example:

```env
MONGO_URL=mongodb://127.0.0.1:27017/mydb
JWT_SECRET=replace-this-with-a-long-random-secret
```

The project also includes `backend/.env.example` as a sample reference file.

## Installation and Setup

1. Open the project folder.

```bash
cd "User Dashboard APP"
```

2. Go to the backend folder.

```bash
cd backend
```

3. Install backend dependencies.

```bash
npm install
```

4. Make sure MongoDB is running on your system.

If MongoDB is running locally, this database URL will work:

```env
MONGO_URL=mongodb://127.0.0.1:27017/mydb
```

5. Start the server.

```bash
npm start
```

6. Open the app in your browser.

```text
http://localhost:8080
```

## How to Use

1. Open `http://localhost:8080`.
2. Click `Signup`.
3. Create a new account.
4. Login with the same email and password.
5. After successful login, the dashboard page will open.
6. Click `Logout` to end the session.

## Available Scripts

Run these commands from the project root.

```bash
npm start
```

Starts the Express server.

```bash
npm run install:backend
```

Installs backend dependencies.

```bash
npm run check
```

Checks backend JavaScript files for syntax errors.

You can also run the same commands inside the `backend` folder directly.

## API Endpoints

Base URL:

```text
http://localhost:8080
```

### Health Check

```http
GET /api/health
```

Response:

```json
{
  "status": "ok"
}
```

### Signup

```http
POST /api/auth/signup
```

Request body:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456"
}
```

### Login

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

Successful login returns a JWT token.

### Get Logged-In User

```http
GET /api/auth/me
```

Headers:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

This route is protected and only works with a valid token.

## Authentication Flow

1. User signs up with name, email, and password.
2. Password is hashed using bcrypt before saving to MongoDB.
3. User logs in with email and password.
4. Backend verifies the password.
5. Backend creates a JWT token.
6. Frontend stores the token in localStorage.
7. Dashboard uses the token to fetch the logged-in user profile.
8. If token is missing or invalid, the user is redirected to the login page.

## Important Notes

- Do not upload the real `.env` file to GitHub.
- Use `.env.example` to show which environment variables are required.
- The backend runs on port `8080` by default.
- The frontend is served by the backend, so only one server is needed.
- Password must be at least 6 characters long.

## Round 2 Assignment Checklist

This project satisfies the assignment requirements as follows:

| Requirement | Status | Implementation |
| --- | --- | --- |
| Real user authentication | Completed | Signup and login using bcrypt password hashing and JWT tokens |
| Proper backend system | Completed | Node.js and Express backend with organized routes and models |
| Database integration | Completed | MongoDB database connected with Mongoose User model |
| Store and manage user data | Completed | User name, email, hashed password, and timestamps are stored |
| Deployment | Ready | `render.yaml` and root scripts are added for Render deployment |

## Deployment Guide

This project can be deployed as one web service because the Express backend also serves the frontend files.

Recommended deployment stack:

- Backend and frontend hosting: Render Web Service
- Cloud database: MongoDB Atlas

### Step 1: Push Project to GitHub

Create a GitHub repository and push this project.

Make sure `.env` is not uploaded. The `.gitignore` file already excludes it.

### Step 2: Create MongoDB Atlas Database

1. Go to MongoDB Atlas.
2. Create a free cluster.
3. Create a database user.
4. Add network access.
5. Copy the MongoDB connection string.

The connection string will look similar to this:

```env
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/user-dashboard-app
```

Replace `USERNAME`, `PASSWORD`, and database name with your real values.

### Step 3: Deploy on Render

1. Go to Render.
2. Click `New`.
3. Select `Web Service`.
4. Connect your GitHub repository.
5. Use these settings:

```text
Name: user-dashboard-app
Runtime: Node
Build Command: npm install --prefix backend
Start Command: npm start --prefix backend
```

If Render asks for root directory, keep it empty because the root `package.json` and `render.yaml` are already prepared.

### Step 4: Add Environment Variables on Render

Add these environment variables in the Render service settings:

```env
MONGO_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret_key
```

Do not use quotes around the values.

### Step 5: Open the Live Website

After deployment completes, Render will provide a live URL similar to:

```text
https://user-dashboard-app.onrender.com
```

Open the URL and test:

1. Signup
2. Login
3. Dashboard access
4. Logout

## Deployment Notes

- Render provides a public `onrender.com` URL after successful deployment.
- Render uses the `PORT` environment variable automatically for web services.
- The server is configured to listen on `0.0.0.0`, which is suitable for cloud deployment.
- MongoDB Atlas requires a database user and allowed network access before the app can connect.

## Troubleshooting

### MongoDB connection failed

Make sure MongoDB is installed and running.

Check that this value is correct in `backend/.env`:

```env
MONGO_URL=mongodb://127.0.0.1:27017/mydb
```

### Port already in use

If port `8080` is already being used, stop the old Node process or change the `PORT` environment variable.

On Windows PowerShell, you can stop running Node processes with:

```powershell
Get-Process node | Stop-Process
```

### Login not working

Check these points:

- Backend server is running
- MongoDB is running
- User has signed up first
- Email and password are correct
- Browser is opened at `http://localhost:8080`

