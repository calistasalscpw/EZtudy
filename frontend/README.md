# EZtudy - Frontend

This directory contains the source code for the EZtudy frontend, a modern and responsive user interface built with React. It communicates with the backend via a RESTful API to deliver an interactive learning experience.

---

## Features

-   **Component-Based Architecture**: Built with reusable React components for maintainability and a consistent user experience.
-   **UI Framework**: Utilizes Ant Design for a comprehensive suite of high-quality UI components.
-   **Styling**: Employs Styled-Components for writing component-scoped CSS, enabling dynamic and maintainable styling.
-   **State Management**: Leverages the React Context API for managing global state, such as user authentication, across the application.
-   **Client-Side Routing**: Handled by React Router DOM for seamless navigation and a single-page application experience.
-   **API Communication**: Uses Axios for making HTTP requests to the backend API, with interceptors for handling authentication tokens and global error handling.

---

## Getting Started

### Prerequisites

-   Node.js and npm installed.
-   The backend server must be running.

### Setup Instructions

1.  **Navigate to the frontend directory:**
    ```sh
    cd frontend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Run the development server:**
    ```sh
    npm run dev
    ```

The frontend application will be available at `http://localhost:5173`.

---

## Scripts

-   `npm run dev`: Starts the Vite development server with hot module replacement.
-   `npm run build`: Bundles the application for production.
-   `npm run preview`: Serves the production build locally for testing.