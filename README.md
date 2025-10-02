# Issue Tally Counter Project

This is a full-stack web application for counting issues across hospital departments, built with React for the frontend and Node.js/Express for the backend.

The project is structured as a monorepo with a `frontend` and `backend` directory, managed by a single root `package.json` file.

---

## Getting Started (Local Development)

To run this project on your local machine, you'll need to have [Node.js](https://nodejs.org/) (version 18 or higher) installed.

1.  **Clone the repository (if you haven't already).**

2.  **Navigate to the project's root directory.**

3.  **Install all dependencies:**
    This command installs dependencies for both the root project and the frontend.
    ```bash
    npm install && cd frontend && npm install
    ```

4.  **Start the development servers:**
    You will need two separate terminal windows for this.
    
    - In the first terminal, start the **backend server**:
      ```bash
      npm start
      ```
    - In the second terminal, navigate to the `frontend` directory and start the **frontend dev server**:
      ```bash
      cd frontend
      npm run dev
      ```

5.  **Open the application in your browser:**
    The frontend server will give you a local URL to open, typically [http://localhost:5173](http://localhost:5173).

---

## Deployment (on Render)

This application is configured for easy deployment on platforms like Render.

-   **Root Directory**: (leave blank)
-   **Build Command**: `npm run build`
-   **Start Command**: `npm start`

Render will use the `build` script to prepare your frontend and the `start` script to run the server which serves the built frontend files.

### ⚠️ Important Note on Data Persistence

This application uses **SQLite**, which stores data in a file (`database.db`) on the server's filesystem.

Many hosting platforms (including Render's free tier) have **ephemeral filesystems**. This means that any data written to the disk, including your database file, **will be permanently deleted** whenever the server restarts or is redeployed.

For a production application where data persistence is critical, you should:
1.  Use a managed database service (like Render's PostgreSQL, Neon, or Supabase).
2.  Modify the backend code in `database.js` and `server.js` to connect to that database instead of SQLite.
