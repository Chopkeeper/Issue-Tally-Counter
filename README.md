# Issue Tally Counter Project

This is a full-stack web application for counting issues across hospital departments, built with React for the frontend and Node.js/Express for the backend.

The project has been structured as a single, unified application to simplify development and deployment. The backend server both provides the API and serves the frontend React application.

---

## Getting Started (Local Development)

To run this project on your local machine, you'll need to have [Node.js](https://nodejs.org/) installed.

1.  **Clone the repository (if you haven't already).**

2.  **Navigate to the project's root directory.**
    This is the directory that contains this `README.md` file.

3.  **Install dependencies:**
    Run this command once to install all the necessary packages for the server.
    ```bash
    npm install
    ```

4.  **Start the application:**
    This command starts the backend server, which will also serve the frontend.
    ```bash
    npm start
    ```

5.  **Open the application in your browser:**
    Once the server is running (you'll see `Server is running on port 3001`), open your web browser and go to:
    [http://localhost:3001](http://localhost:3001)

---

## Deployment (e.g., on Render)

This application is configured for easy deployment on platforms like Render.

-   **Build Command**: You can leave this blank or use `npm install`.
-   **Start Command**: `npm start`

Render will automatically detect the `package.json` in the root, install dependencies, and use the `start` script to run the application.

### ⚠️ Important Note on Data Persistence

This application uses **SQLite**, which stores data in a file (`database.db`) on the server's filesystem.

Many hosting platforms (including Render's free tier) have **ephemeral filesystems**. This means that any data written to the disk, including your database file, **will be permanently deleted** whenever the server restarts or is redeployed.

For a production application where data persistence is critical, you should:
1.  Use a managed database service (like Render's PostgreSQL, Neon, or Supabase).
2.  Modify the backend code in `database.js` and `server.js` to connect to that database instead of SQLite.
