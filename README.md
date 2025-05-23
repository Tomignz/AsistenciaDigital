# Asistencia QR - Full Stack Attendance System

This project is a full-stack application designed to manage and track attendance using QR codes. It features a React frontend (built with Vite) and a Node.js/Express backend with MongoDB.

## Features

*   User registration and role-based authentication (Admin, Professor).
*   JWT-based secure API.
*   QR code generation by professors for specific subjects and durations.
*   QR code scanning by students/attendees to register attendance.
*   Admin panel for managing attendance records.
*   Professor panel for generating QRs and viewing attendances.
*   Environment variable-based configuration for security.
*   Serves frontend static build from the backend for integrated deployment.
*   Security headers via Helmet and production-ready logging via Morgan.
*   Global error handling in the backend.

## Project Structure

```
.
├── backend/        # Node.js/Express backend
│   ├── models/
│   ├── middleware/
│   ├── routes/
│   ├── server.js   # Main backend server file
│   ├── .env.example # Example environment variables
│   └── package.json
├── frontend/       # React/Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── public/
│   ├── index.html
│   └── package.json
└── README.md       # This file
```

## Prerequisites

*   Node.js (v18.x or higher recommended)
*   npm (usually comes with Node.js)
*   MongoDB (running instance, local or cloud-based)

## Environment Variables (Backend)

Before running the backend (for development or production), you need to set up environment variables.

1.  Navigate to the `backend` directory.
2.  Create a `.env` file by copying the example:
    ```bash
    cp .env.example .env
    ```
3.  Edit the `backend/.env` file and provide values for the following variables:

    *   `PORT`: The port the backend server will listen on (e.g., `3000`).
    *   `MONGODB_URI`: Connection string for your MongoDB database (e.g., `mongodb://127.0.0.1:27017/asistencia-back`).
    *   `JWT_SECRET`: A long, random, and highly secret string used for signing and verifying JSON Web Tokens. This is critical for security.
    *   `CORS_ORIGIN`: Comma-separated list of allowed frontend origins for Cross-Origin Resource Sharing.
        *   For local development with the Vite server, this is typically `http://localhost:5173`.
        *   For production where the backend serves the frontend, you might not need this if they are on the same origin, or you might set it to your production domain.
    *   `NODE_ENV`: Set to `development` or `production`.
        *   In `development`, error messages might include more details (like stack traces).
        *   In `production`, logging might be more concise, and error details are typically suppressed from the client.

## Development Setup

This setup is for active development where frontend and backend run as separate processes.

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd asistencia-qr
    ```

2.  **Backend Setup:**
    *   Navigate to the `backend` directory:
        ```bash
        cd backend
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Set up your `backend/.env` file as described in the "Environment Variables (Backend)" section. Ensure `CORS_ORIGIN` is set correctly for your frontend development server (e.g., `http://localhost:5173`).
    *   Start the backend development server (usually on port 3000 defined in `.env`):
        ```bash
        npm run dev 
        # This typically uses nodemon for auto-restarting on file changes.
        # If no dev script, use: node server.js
        ```

3.  **Frontend Setup:**
    *   Open a new terminal and navigate to the `frontend` directory:
        ```bash
        cd frontend
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Start the Vite development server (usually on port 5173):
        ```bash
        npm run dev
        ```

The application should now be running:
*   Frontend development server at `http://localhost:5173` (or your Vite port).
*   Backend server at `http://localhost:3000` (or your backend `PORT`).
The frontend will make API calls to the backend.

## Building for Production

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install frontend dependencies (if not already done):**
    ```bash
    npm install
    ```
3.  **Build the frontend application:**
    ```bash
    npm run build
    ```
    This will create a `dist` folder in the `frontend` directory containing the optimized static assets.

## Running in Production-like Mode (Integrated)

In this mode, the backend server serves the built frontend static files and handles API requests.

1.  **Ensure the frontend has been built:** Follow the steps in "Building for Production". The `frontend/dist` directory must exist.
2.  **Navigate to the backend directory:**
    ```bash
    cd backend 
    ```
3.  **Install backend dependencies (if not already done):**
    ```bash
    npm install
    ```
4.  **Set up `backend/.env` for production:**
    *   Refer to the "Environment Variables (Backend)" section.
    *   Ensure `MONGODB_URI` points to your production database.
    *   Set a strong, unique `JWT_SECRET`.
    *   Set `NODE_ENV=production`.
    *   `CORS_ORIGIN` might be your application's domain if needed, or if serving from the same origin, default CORS settings might be sufficient (but `helmet` and specific CORS rules are good for security).
5.  **Start the backend server:**
    ```bash
    npm start 
    # Or: node server.js
    ```
The application should now be accessible via `http://localhost:PORT` (where `PORT` is defined in `backend/.env`, e.g., `http://localhost:3000`). The backend serves both the API and the frontend application.

## API Endpoints

A brief overview of key API endpoints:

*   **Authentication:**
    *   `POST /api/auth/register`: User registration.
    *   `POST /api/auth/login`: User login.
*   **Asistencias (Attendance):**
    *   `GET /api/asistencias`: Get all attendance records (protected).
    *   `POST /api/asistencias`: Create a new attendance record (manual entry, protected).
    *   `PUT /api/asistencias/:id`: Update an attendance record (protected).
    *   `DELETE /api/asistencias/:id`: Delete an attendance record (protected).
    *   `POST /api/asistencias/scan`: Register attendance via QR scan (protected).
*   **QR Code Generation:**
    *   `POST /api/qr/generate`: Generate a new QR session ID for attendance (protected).

(Refer to route files in `backend/routes/` for more details on request/response structures.)
```
