# Deployment Guide

## Frontend (Netlify) - Already Deployed ✅

The frontend is deployed on Netlify. However, you need to configure the backend API URL.

## Backend API Deployment

You need to deploy the backend API to a hosting service. Here are some options:

### Option 1: Deploy to Heroku (Recommended)

1. **Install Heroku CLI** (if not already installed)
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create a Heroku app**
   ```bash
   cd api
   heroku create your-app-name
   ```

4. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET=your-secret-key-here
   heroku config:set DB_CONNECTION_STRING=your-mongodb-connection-string
   ```

5. **Deploy**
   ```bash
   git subtree push --prefix api heroku main
   ```
   Or use Heroku Git:
   ```bash
   heroku git:remote -a your-app-name
   git subtree push --prefix api heroku main
   ```

### Option 2: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Select the `api` folder as the root
5. Add environment variables:
   - `JWT_SECRET`
   - `DB_CONNECTION_STRING`
   - `PORT` (Railway sets this automatically)

### Option 3: Deploy to Render

1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set root directory to `api`
5. Build command: `npm install`
6. Start command: `npm start`
7. Add environment variables:
   - `JWT_SECRET`
   - `DB_CONNECTION_STRING`

## Configure Netlify Environment Variables

After deploying your backend API, you need to set the `REACT_APP_API_URL` in Netlify:

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Build & deploy** → **Environment**
3. Click **Add variable**
4. Add:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: Your backend API URL (e.g., `https://your-app-name.herokuapp.com` or `https://your-app.onrender.com`)

5. **Redeploy** your site (or trigger a new deployment)

## MongoDB Setup

You'll need a MongoDB database. Options:

1. **MongoDB Atlas** (Free tier available)
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string
   - Update `DB_CONNECTION_STRING` in your backend deployment

2. **Local MongoDB** (for development only)

## Quick Setup Checklist

- [ ] Deploy backend API to hosting service (Heroku/Railway/Render)
- [ ] Set backend environment variables (`JWT_SECRET`, `DB_CONNECTION_STRING`)
- [ ] Get your backend API URL
- [ ] Set `REACT_APP_API_URL` in Netlify environment variables
- [ ] Redeploy Netlify site
- [ ] Test signup/login functionality

## Troubleshooting

### "Network Error" on Signup/Login
- Check that `REACT_APP_API_URL` is set in Netlify
- Verify your backend API is running and accessible
- Check browser console for CORS errors
- Ensure MongoDB connection string is correct

### CORS Errors
- Make sure your backend has CORS enabled (already configured in `api/index.js`)
- Verify the backend URL in Netlify matches your deployed backend URL

