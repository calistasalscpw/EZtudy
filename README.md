# EZtudy - A Self-Paced Learning Platform

EZtudy is a full-stack web application designed to provide a seamless and interactive self-paced learning experience. It serves as a practical platform where administrators can create, manage, and curate educational courses, and students can enroll, track their progress, and consume learning materials like videos and documents.

This repository contains the complete source code for the EZtudy application, separated into two main packages: `frontend` (React) and `backend` (Node.js/Express). 

[Website Demo Video](https://drive.google.com/file/d/1QB-KZ8pNTD-TL3nWrblqDmjp_CWU4nRZ/view?usp=sharing)

---

## Features

-   **User Authentication**: Secure signup and login for students and administrators, including email verification and Google OAuth 2.0.
-   **Role-Based Access Control**: Distinct roles for Admins (course management) and Students (learning).
-   **Course & Material Management**: Admins can perform full CRUD (Create, Read, Update, Delete) operations on courses and their associated materials.
-   **Dynamic Content Upload**: Supports uploading various file types (PDF, images, documents) and embedding YouTube videos via a dynamic search API.
-   **Student Progress Tracking**: Students' progress is automatically tracked and displayed as they complete materials.
-   **Interactive UI**: A modern, responsive user interface built with React and Ant Design.
-   **RESTful API**: A robust backend API built with Node.js, Express, and MongoDB.

---

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm (v8 or higher)
-   MongoDB instance (local or cloud-based like MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/calistasalscpw/EZtudy.git
    cd eztudy
    ```

2.  **Setup the Backend:**
    -   Navigate to the backend directory: `cd backend`
    -   Install dependencies: `npm install`
    -   Create a `.env` file and populate it with your environment variables (see `backend/README.md` for details).
    -   Start the server: `npm start`

3.  **Setup the Frontend:**
    -   Navigate to the frontend directory: `cd ../frontend`
    -   Install dependencies: `npm install`
    -   Start the client: `npm run dev`

The application should now be running, with the frontend on `http://localhost:5173` and the backend on `http://localhost:5000`.

---

## Tech Stack

-   **Frontend**: React, Vite, Ant Design, Styled-Components, Axios
-   **Backend**: Node.js, Express, MongoDB, Mongoose
-   **Authentication**: Passport.js (JWT, Google OAuth 2.0), bcrypt
-   **API Integration**: YouTube Data API v3

---

## API Documentation & Architecture Analysis

### Technology Stack Justification

* **Frontend Framework: React**
    * **Reasoning**: React was chosen for its component-based architecture, which promotes reusability and maintainability. This is particularly beneficial for a learning platform with repetitive UI elements like course cards and material lists. The vast ecosystem, including libraries like Ant Design, accelerates development and ensures a high-quality user interface.
    * **Alternatives Considered**: Vue.js was considered for its gentle learning curve and excellent documentation. However, React's larger community and my existing familiarity made it a more pragmatic choice for this project, ensuring faster development and easier problem-solving.

* **Backend Language/Framework: Node.js with Express**
    * **Reasoning**: Node.js with Express offers a lightweight and performant solution for building RESTful APIs. Its non-blocking I/O is well-suited for handling concurrent user requests in a web application. Using JavaScript on both the frontend and backend creates a more cohesive development experience.
    * **Alternatives Considered**: Python with Django was considered because of its built-in tools and strong ORM. But for this project, I chose Express since its flexibility and unopinionated design gave us more control over the app’s structure.

* **Database: MongoDB**
    * **Reasoning**: MongoDB was selected for its flexible, document-based data model, which is ideal for a learning platform where course structures and material types might evolve. The use of Mongoose as an ODM provides a familiar, schema-based approach to data modeling, combining the benefits of NoSQL with structured data validation.
    * **Alternatives Considered**: PostgreSQL was considered for its strong data integrity and powerful querying capabilities. However, MongoDB's scalability and ease of use for this application's data structure made it a more suitable choice.

### API Design Philosophy

* **API Endpoint Structure**: The API follows a RESTful design, with endpoints organized around resources (e.g., `/courses`, `/users`, `/materials`). This creates a predictable and intuitive structure for the frontend to consume. Nested routes are used to represent relationships between resources, such as `/courses/:courseId/materials` for managing materials within a specific course.

* **External API Integration**: The **YouTube Data API v3** is integrated to allow administrators to search for and embed video content into their courses. This enriches the learning experience by providing access to a vast library of educational videos without the need for video hosting.

* **API Failure and Rate Limits**: For the YouTube API, error handling is implemented to catch and gracefully handle failures, providing feedback to the user if a search is unsuccessful. Rate limiting is implemented on the application's own API using `express-rate-limit` to prevent abuse and ensure service stability.

* **Authentication/Authorization Strategy**: Authentication is managed using **Passport.js** with two strategies:
    1.  **JWT (JSON Web Tokens)** for local email/password authentication.
    2.  **Google OAuth 2.0** for social login.
    Authorization is implemented with custom middleware (`isAdminValidator` and `isUserValidator`) to protect routes and ensure that only users with the appropriate roles can access certain endpoints.

### Performance & Scalability Considerations

* **Handling Increased Load**: The application is built on the scalable MERN stack. The Node.js backend can be scaled horizontally by running multiple instances behind a load balancer. The MongoDB database can be scaled using sharding and replica sets to distribute the load.

* **Bottlenecks**:
    * **Database Queries**: As the platform grows, complex database queries could become a bottleneck.
    * **External API Calls**: The application's performance is dependent on the response time of the YouTube Data API.

* **Optimization**:
    * **Database Indexing**: Indexes are used on frequently queried fields, such as the `user` and `course` fields in the `Progress` model, to improve query performance.
    * **Pagination**: The API uses pagination for fetching courses to limit the amount of data transferred in a single request.
    * **Caching**: A caching layer (e.g., Redis) could be implemented for frequently accessed data, such as course details, to reduce the load on the database.

---

## Integration Strategy Document

* **External API Choice**: The **YouTube Data API** was chosen for its vast and diverse library of educational content. This allows the platform to offer a rich learning experience without the significant overhead of hosting and managing video files.

* **Error Handling**: The integration with the YouTube API includes `try-catch` blocks to handle potential errors. If an error occurs, such as a quota limit being exceeded, a `500` status code with an informative error message is returned to the client.

* **Security**: API keys for the YouTube Data API are stored securely in a `.env` file and are not exposed to the frontend. All communication with the YouTube API is handled by the backend server to protect the API key.

---

## Critical Thinking Evaluation

* **API Design Decisions**: The RESTful API design provides a standardized and easy-to-understand structure for the frontend. The use of middleware for authentication and validation keeps the route handlers clean and focused on their core logic. (see `backend/README.md` for details).

* **Integration Choices**: The YouTube Data API was a strategic choice that leverages a massive, existing content library, allowing the platform to provide a rich learning experience without the cost and complexity of content creation and hosting.

* **Performance Tradeoffs**: The current design prioritizes rapid development and ease of implementation. For example, the absence of a caching layer means that every request for course data results in a database query. While acceptable for a small-scale application, this would be a performance bottleneck at scale. This trade-off was made to deliver the core features within the project's scope. A caching strategy would be a key area for future performance optimization.

## Sample test data/documents

Sample documents for demonstration are included in the the backend/public/uploads/ directory. These files include:

* **A PDF document** (materialFile-1757425295060.pdf)
* **A PNG image** (materialFile-1757501016827.png)
* **A PowerPoint** presentation (materialFile-1757506139596.pptx)
* Other supported files to be uploaded include jpg, jpeg, png, gif, ppt, pptx, doc, docx, and pdf

Since the video material is covered by the YouTube Data API, files such as video can't be uploaded. In exchange, administrator can search YouTube video name directly in the add material to be uploaded within the page.