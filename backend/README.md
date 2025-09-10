# EZtudy - Backend

This directory contains the Node.js backend for the EZtudy platform. It's a RESTful API built with Express and MongoDB that handles all business logic, data persistence, and user authentication.

---

## Features

- **RESTful API**: A well-structured API for managing users, courses, materials, and progress.
- **Database**: Uses MongoDB with Mongoose for flexible and scalable data modeling.
- **Authentication**: Implements local (email/password) and Google OAuth 2.0 authentication strategies using Passport.js, with JWT for session management.
- **Email Verification**: Sends verification emails to new users upon registration using Nodemailer.
- **File Uploads**: Manages file uploads for course materials using Multer.
- **External API Integration**: Connects to the YouTube Data API to search for and add video content.

---

## Getting Started

### Prerequisites

- Node.js and npm installed.
- A running MongoDB instance.

### Setup Instructions

1.  **Navigate to the backend directory:**
    ```sh
    cd backend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Create a `.env` file** in this directory and add the following environment variables:

    ```env
    # MongoDB Connection String
    MONGO_URL=your_mongodb_connection_string

    # JWT Secret for signing tokens
    JWT_SECRET_KEY=your_super_secret_key

    # Google OAuth 2.0 Credentials (from Google Cloud Console)
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret

    # Google App Password for Nodemailer
    GOOGLE_APP_PASSWORD=your_google_app_password

    # YouTube Data API v3 Key
    YOUTUBE_API_KEY=your_youtube_api_key
    ```

4.  **Run the server:**
    ```sh
    npm start
    ```

The backend API will be running on `http://localhost:5000`.