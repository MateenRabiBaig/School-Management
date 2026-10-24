# School Management System

A full-stack school management application for administrators, teachers, and students. It provides role-based access to student records, teacher assignments, attendance, marks, results, report cards, announcements, academic years, and profile data.

## Features

- JWT-based authentication for administrators, teachers, and students
- Admin management of students, teachers, academic years, attendance, marks, and announcements
- Teacher dashboards, class/student views, attendance marking, and marks entry
- Student dashboards, attendance calendars, subjects, results, report cards, and announcements
- Report card PDF generation
- Image uploads through Cloudinary
- MongoDB persistence through Mongoose

## Technology

- Frontend: React, React Router, Create React App
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT and bcryptjs
- File storage: Cloudinary
- Deployment: Vercel for the frontend and Render for the backend

## Project structure

```text
school-management/
├── src/                 React frontend
├── public/              Frontend public assets
├── backend/             Express API and database models
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── scripts/
├── package.json         Frontend dependencies and scripts
└── backend/package.json Backend dependencies and scripts
```

## Requirements

- Node.js 18 or newer
- npm
- MongoDB database, local or MongoDB Atlas
- Cloudinary account for image uploads

## Local setup

Clone the repository and install dependencies for both applications:

```bash
npm install
cd backend
npm install
```

Create a frontend `.env` file in the project root:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/school-management
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Do not commit either `.env` file or real credentials.

## Running locally

Start the backend in one terminal:

```bash
cd backend
npm start
```

Start the frontend in another terminal:

```bash
npm start
```

The frontend runs at `http://localhost:3000` and the API runs at `http://localhost:5000`.

For backend development with automatic restarts:

```bash
cd backend
npm run dev
```

## Initial administrator account

There is no public registration page. This is intentional: administrators create teacher and student accounts from the admin dashboard.

Create the initial administrator using the same `MONGO_URI` as the running backend:

```bash
cd backend
npm run seed:admin
```

The seed script creates:

```text
User ID: ADM001
Password: admin123
Role: Admin
```

Change the default password or remove the default credentials before using the application in production.

## API

The backend API is mounted under `/api`.

| Area | Base route |
| --- | --- |
| Authentication | `/api/auth` |
| Students | `/api/students` |
| Teachers | `/api/teachers` |
| Attendance | `/api/attendance` |
| Marks | `/api/marks` |
| Results | `/api/results` |
| Academic years | `/api/academic-years` |
| Announcements | `/api/announcements` |
| Uploads | `/api/upload` |
| Health check | `/api/health` |

The login endpoint is:

```text
POST /api/auth/login
```

## Deployment

### Backend on Render

Configure the Render service with `backend` as its root directory.

```text
Build Command: npm install
Start Command: npm run seed:admin && node server.js
```

Add these environment variables in Render:

```env
PORT=10000
NODE_ENV=production
MONGO_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRES_IN=1d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Render provides the `PORT` value automatically; do not hard-code a production port in the application.

The seed command is included in the start command so the initial admin can be created without a paid shell. It checks whether `ADM001` already exists and does not create a duplicate on later deployments.

### Frontend on Vercel

Set the following Vercel environment variable before building:

```env
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

The value must include `/api`. After changing it, redeploy the frontend because Create React App embeds `REACT_APP_*` variables during the build.

Never use `localhost` as the production API URL.

## Production checklist

- Set `REACT_APP_API_URL` to the public Render API URL ending in `/api`.
- Set `MONGO_URI` to the production MongoDB Atlas connection string.
- Allow the Render service to connect in MongoDB Atlas Network Access.
- Configure all Cloudinary credentials in Render.
- Use a strong, unique `JWT_SECRET`.
- Replace the default `ADM001` / `admin123` credentials.
- Keep `.env` files and secrets out of Git.
- Verify the health endpoint at `/api/health` after deployment.

## Available scripts

From the project root:

```bash
npm start       # Start the React development server
npm run build   # Create the production frontend build
npm test        # Run frontend tests
```

From `backend/`:

```bash
npm start       # Start the API server
npm run dev     # Start the API with nodemon
npm run seed:admin  # Create the initial administrator if absent
```
