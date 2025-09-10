# EZtudy - A Self-Paced Learning Platform

EZtudy is a full-stack web application designed to provide a seamless and interactive self-paced learning experience. It serves as a practical platform where administrators can create, manage, and curate educational courses, and students can enroll, track their progress, and consume learning materials like videos and documents.

This repository contains the complete source code for the EZtudy application, separated into two main packages: `frontend` (React) and `backend` (Node.js/Express).

---

## Features

- **User Authentication**: Secure signup and login for students and administrators, including email verification and Google OAuth 2.0.
- **Role-Based Access Control**: Distinct roles for Admins (course management) and Students (learning).
- **Course & Material Management**: Admins can perform full CRUD (Create, Read, Update, Delete) operations on courses and their associated materials.
- **Dynamic Content Upload**: Supports uploading various file types (PDF, images, documents) and embedding YouTube videos via a dynamic search API.
- **Student Progress Tracking**: Students' progress is automatically tracked and displayed as they complete materials.
- **Interactive UI**: A modern, responsive user interface built with React and Ant Design.
- **RESTful API**: A robust backend API built with Node.js, Express, and MongoDB.

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- MongoDB instance (local or cloud-based like MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/calistasalscpw/EZtudy.git](https://github.com/calistasalscpw/EZtudy.git)
    cd eztudy
    ```

2.  **Setup the Backend:**
    - Navigate to the backend directory: `cd backend`
    - Install dependencies: `npm install`
    - Create a `.env` file and populate it with your environment variables (see `backend/README.md` for details).
    - Start the server: `npm start`

3.  **Setup the Frontend:**
    - Navigate to the frontend directory: `cd ../frontend`
    - Install dependencies: `npm install`
    - Start the client: `npm run dev`

The application should now be running, with the frontend on `http://localhost:5173` and the backend on `http://localhost:5000`.

---

## Tech Stack

- **Frontend**: React, Vite, Ant Design, Styled-Components, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: Passport.js (JWT, Google OAuth 2.0), bcrypt
- **API Integration**: YouTube Data API v3