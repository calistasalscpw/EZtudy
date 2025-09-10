# EZtudy - Backend

This directory contains the Node.js backend for the EZtudy platform. It's a RESTful API built with Express and MongoDB that handles all business logic, data persistence, and user authentication.

---

## Features

-   **RESTful API**: A well-structured API for managing users, courses, materials, and progress.
-   **Database**: Uses MongoDB with Mongoose for flexible and scalable data modeling.
-   **Authentication**: Implements local (email/password) and Google OAuth 2.0 authentication strategies using Passport.js, with JWT for session management.
-   **Email Verification**: Sends verification emails to new users upon registration using Nodemailer.
-   **File Uploads**: Manages file uploads for course materials using Multer.
-   **External API Integration**: Connects to the YouTube Data API to search for and add video content.

---

## Getting Started

### Prerequisites

-   Node.js and npm installed.
-   A running MongoDB instance.

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

---

## API Endpoints

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| `GET` | `/courses` | Get all courses with pagination and search | Public |
| `GET` | `/courses/:courseId` | Get a single course with materials and progress | User |
| `POST` | `/courses` | Create a new course | Admin |
| `PUT` | `/courses/:courseId` | Update a course | Admin |
| `DELETE` | `/courses/:courseId` | Delete a course | Admin |
| `POST` | `/courses/:courseId/enroll` | Enroll in a course | User |
| `POST` | `/courses/:courseId/materials` | Add a new material to a course | Admin |
| `PUT` | `/courses/:courseId/materials/:materialId` | Update a material | Admin |
| `DELETE` | `/courses/:courseId/materials/:materialId` | Delete a material | Admin |
| `POST` | `/auth/signup` | Register a new user | Public |
| `POST` | `/auth/login` | Login a user | Public |
| `POST` | `/auth/logout` | Logout a user | User |
| `GET` | `/auth/profile` | Get the current user's profile | User |
| `GET` | `/auth/login/google` | Initiate Google OAuth 2.0 login | Public |
| `GET` | `/auth/login/google/callback` | Google OAuth 2.0 callback | Public |
| `GET` | `/youtube/search` | Search for YouTube videos | User |

---

## Database Schema Design

### User Schema

| Field | Type | Description |
| --- | --- | --- |
| `username` | String | The user's username. |
| `email` | String | The user's email address. |
| `password` | String | The user's hashed password. |
| `isAdmin` | Boolean | Whether the user is an administrator. |
| `registerType` | String | The registration method ('normal' or 'google'). |
| `socialId` | String | The user's social ID (for Google OAuth). |
| `courses` | Array | An array of course IDs the user is enrolled in. |
| `isVerified` | Boolean | Whether the user has verified their email. |

### Course Schema

| Field | Type | Description |
| --- | --- | --- |
| `title` | String | The title of the course. |
| `description` | String | A description of the course. |
| `materials` | Array | An array of material IDs associated with the course. |
| `enrolledUsers` | Array | An array of user IDs enrolled in the course. |

### Material Schema

| Field | Type | Description |
| --- | --- | --- |
| `title` | String | The title of the material. |
| `type` | String | The type of material ('file' or 'video'). |
| `source` | String | The source of the material (file path or video ID). |
| `fileName` | String | The original name of the uploaded file. |
| `filePath` | String | The path to the uploaded file on the server. |
| `fileType` | String | The MIME type of the uploaded file. |
| `course` | ObjectId | A reference to the course this material belongs to. |

### Progress Schema

| Field | Type | Description |
| --- | --- | --- |
| `user` | ObjectId | A reference to the user. |
| `course` | ObjectId | A reference to the course. |
| `completedMaterials` | Array | An array of material IDs that the user has completed. |