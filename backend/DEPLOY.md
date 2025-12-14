# Backend Deployment Guide - Render.com

## Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub

## Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select repository: `sweet-shop-management`
4. Configure:
   - Name: `sweet-shop-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

## Step 3: Set Environment Variables
In Render dashboard, go to Environment section and add:

- `MONGO_URI` - Your MongoDB connection string
  - Get from MongoDB Atlas (free tier available)
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
  
- `JWT_SECRET` - Any random string for JWT signing
  - Example: `your-super-secret-jwt-key-12345`
  
- `PORT` - Leave empty (Render sets this automatically)

## Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Copy the URL (e.g., `https://sweet-shop-backend.onrender.com`)

## Step 5: Create Admin User
After deployment, run this in Render Shell or locally:
```bash
node scripts/createAdmin.js
```

## Your Backend URL
After deployment, your backend will be at:
`https://your-service-name.onrender.com`

Update frontend API URL to use this instead of localhost.

