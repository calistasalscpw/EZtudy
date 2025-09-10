# EZtudy - Frontend

This directory contains the source code for the EZtudy frontend, a modern and responsive user interface built with React. It communicates with the backend via a RESTful API to deliver an interactive learning experience.

---

## Features

- **Component-Based Architecture**: Built with reusable React components for maintainability.
- **UI Framework**: Utilizes Ant Design for a high-quality, consistent design system.
- **Styling**: Styled-Components for dynamic and scoped CSS.
- **State Management**: Leverages React Context API for global state management (e.g., authentication).
- **Client-Side Routing**: Handled by React Router DOM for seamless navigation.
- **API Communication**: Uses Axios for making HTTP requests to the backend API.

---

## Getting Started

### Prerequisites

- Node.js and npm installed.
- The backend server must be running.

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

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Bundles the application for production.
- `npm run preview`: Serves the production build locally.