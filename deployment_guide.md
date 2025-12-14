# Deployment Guide: Dorayaki Sweet Shop

This guide will walk you through hosting your **Backend on Render** and **Frontend on Vercel**. These platforms have excellent free tiers for MERN stack projects.

## 📋 Prerequisites
1.  **GitHub Repository**: Ensure your code is pushed to GitHub (you just did this!).
2.  **MongoDB Atlas**: You need your `MONGO_URI` ready.
3.  **Cloudinary**: You need your Cloudinary API keys ready.

---

## Part 1: Deploy Backend (Render)

1.  **Sign Up/Login**: Go to [render.com](https://render.com) and login with GitHub.
2.  **New Web Service**: Click "New +" -> "Web Service".
3.  **Connect Repo**: Select your `dorayaki-sweet-shop` repository.
4.  **Configure Settings**:
    *   **Name**: `dorayaki-backend` (or unique name)
    *   **Root Directory**: `backend` (Important!)
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
5.  **Environment Variables** (Scroll down to "Environment Variables"):
    Add the following keys from your local `.env` file:
    *   `MONGO_URI`: (Your actual MongoDB connection string)
    *   `JWT_SECRET`: (Any long random string)
    *   `CLOUDINARY_CLOUD_NAME`: ...
    *   `CLOUDINARY_API_KEY`: ...
    *   `CLOUDINARY_API_SECRET`: ...
    *   `PORT`: `10000` (Render default)
6.  **Deploy**: Click "Create Web Service".
    *   ⏳ Wait for it to finish. You will get a URL like `https://dorayaki-backend.onrender.com`. **Copy this URL.**

---

## Part 2: Prepare Frontend for Production

Before deploying the frontend, we need to tell it to talk to your *new* Backend URL, not `localhost`.

1.  **Update API URL**:
    *   Open `frontend/dorayaki/src/api/axios.js`.
    *   Change `baseURL` to use an environment variable:
        ```javascript
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        ```
    *   *I will apply this change for you automatically.*

2.  **Push Changes**:
    *   After I make the edit, you will need to `git commit` and `git push` one more time.

---

## Part 3: Deploy Frontend (Vercel)

1.  **Sign Up/Login**: Go to [vercel.com](https://vercel.com) and login with GitHub.
2.  **Add New Project**: Click "Add New..." -> "Project".
3.  **Import Repo**: Select `dorayaki-sweet-shop`.
4.  **Configure Settings**:
    *   **Framework Preset**: Vite (should detect auto)
    *   **Root Directory**: Click "Edit" and select `frontend/dorayaki`.
5.  **Environment Variables**:
    *   **Key**: `VITE_API_URL`
    *   **Value**: `https://dorayaki-backend.onrender.com/api` (The URL from Part 1 + `/api`)
6.  **Deploy**: Click "Deploy".

---

## Part 4: Final Connection (CORS)

Once the Frontend is live, you will get a URL like `https://dorayaki-frontend.vercel.app`.

1.  Go back to **Render (Backend) Dashboard**.
2.  Add/Update an Environment Variable:
    *   **Key**: `FRONTEND_URL`
    *   **Value**: `https://dorayaki-frontend.vercel.app` (Your actual Vercel URL).
3.  I will update `backend/src/app.js` to accept this CORS origin.

---
**Summary of Next Steps:**
1.  I will code the `CORS` and `VITE_API_URL` logic now.
2.  You push the code.
3.  You follow the steps above on Render and Vercel.
