# Database & Backend

This folder contains all database and backend server code for the Choose Your Own Major quiz application.

## Structure

- **server.js** - Express server with MySQL API endpoints
- **schema.sql** - Database schema and table definitions
- **.env.example** - Environment variables template

## Setup

1. Copy `.env.example` to `.env` and update with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=choose_major
   PORT=3000
   ```

2. Ensure MySQL is running and accessible

3. Start the server from the project root:
   ```
   npm start
   ```

The server will automatically:
- Create the database if it doesn't exist
- Create tables on first run
- Listen on http://localhost:3000

## API Endpoints

### Get Questions
- `GET /api/questions` - All questions
- `GET /api/questions?published=true` - Published questions only

### Create Question
- `POST /api/questions` - Create new question

### Update Question
- `PUT /api/questions/:id` - Update existing question
- `PATCH /api/questions/:id/status` - Change draft/published status

### Delete Question
- `DELETE /api/questions/:id` - Delete question

All endpoints expect and return JSON with status codes.
