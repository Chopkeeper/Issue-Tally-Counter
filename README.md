# Issue Tally Counter Project

This is a full-stack web application for counting issues across hospital departments, built with React for the frontend and Node.js/Express/MongoDB for the backend.

The project is structured as a monorepo with a `frontend` and `backend` directory.

---

## Getting Started (Local Development)

To run this project on your local machine, you'll need to have [Node.js](https://nodejs.org/) (version 18 or higher) and a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account.

1.  **Clone the repository (if you haven't already).**

2.  **Set up the Backend:**
    a. Navigate to the `backend` directory: `cd backend`
    b. Create a file named `.env`.
    c. Add your MongoDB Atlas connection string to the `.env` file:
       ```
       MONGODB_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority"
       ```
       Replace `<user>`, `<password>`, `cluster.mongodb.net`, and `<dbname>` with your actual credentials and database name.
    d. Go back to the root directory: `cd ..`

3.  **Install all dependencies:**
    This command installs dependencies for both the backend and the frontend.
    ```bash
    npm install && cd frontend && npm install
    ```

4.  **Start the development servers:**
    You will need two separate terminal windows for this.
    
    - In the first terminal (from the root directory), start the **backend server**:
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

### Environment Variables

Before deploying, you must add your `MONGODB_URI` as an **Environment Variable** in your Render service settings.

-   **Key**: `MONGODB_URI`
-   **Value**: `mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority`

This ensures your deployed application can connect to your MongoDB Atlas database. The application is now designed for persistent storage, and data will not be lost on restart or redeployment.
