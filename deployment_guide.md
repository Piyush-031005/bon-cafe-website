# Bon Café & Sweets — Deployment Guide

This guide describes how to deploy the Bon Café & Sweets website to **Render** (to host both the animated frontend and the Node.js Express booking backend/admin panel) or **Vercel** (for static frontend reviews only).

---

## Option 1: Deploy to Render (Recommended — Hosts Frontend + Backend)

Render hosts your Express server and serves the static frontend out of the box for free.

### Step 1: Initialize Git and Commit Your Code
Run the following commands in your terminal (`e:\Pekalauncher\Project1`):
```bash
# Initialize git
git init

# Create .gitignore to prevent committing node_modules
echo "node_modules/" > .gitignore
echo ".DS_Store" >> .gitignore

# Add and commit all files
git add .
git commit -m "feat: initial commit of cinematic café app"
```

### Step 2: Create a GitHub Repository & Push
1. Go to [GitHub](https://github.com/) and create a new public or private repository named `bon-cafe-website`.
2. Link your local project and push:
```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/bon-cafe-website.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Render
1. Sign up/log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select your repository `bon-cafe-website`.
4. Configure the Web Service settings:
   - **Name**: `bon-cafe-sweets`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Click **Deploy Web Service**. Render will build and deploy the app. Once finished, you will receive a public URL (e.g. `https://bon-cafe-sweets.onrender.com`).

---

## Option 2: Deploy to Vercel (Static Frontend Only)

If you only want to share the visual design and animations with others (without testing active form submissions or the admin dashboard):

### Step 1: Deploy via Vercel CLI
You can deploy your project to Vercel in 1 minute using the terminal:
```bash
# Run Vercel CLI in the project root
npx vercel
```
1. Follow the interactive prompts:
   - *Set up and deploy?* **Yes**
   - *Which scope?* (Select your Vercel account)
   - *Link to existing project?* **No**
   - *What's your project's name?* `bon-cafe-sweets`
   - *In which directory is your code located?* `./`
   - *Want to modify settings?* **No**
2. Vercel will upload your static files and provide a preview URL (e.g., `https://bon-cafe-sweets.vercel.app`).
