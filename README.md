# Talkify Frontend

Welcome to the **Talkify Frontend** repository — the user-facing React & Next.js application for Talkify, a real-time video and chat platform.

---

## 🚀 Project Overview

Talkify is a scalable web app that supports real-time video calls, messaging, and user authentication. The frontend is built with **Next.js 14** and connects to MongoDB via Prisma, using Socket.IO for messaging and LiveKit for video calls.

Multiple frontend instances run simultaneously to support load balancing and failover. Requests are routed dynamically via a custom NGINX reverse proxy setup.

---

## 🛠 Technology Stack

- **Framework:** Next.js 14 with React and TypeScript
- **Backend:** API routes powered by Next.js
- **Database:** MongoDB Atlas accessed through Prisma ORM
- **Authentication:** Clerk.js
- **Real-time Communication:** Socket.IO (chat), LiveKit (video calls)
- **File Uploads:** UploadThing
- **Containerization:** Docker (optional local/development use)
- **Deployment:** Vercel (multiple instances for load balancing)
- **Reverse Proxy / Load Balancer:** NGINX with health checks and dynamic routing

---

## 📦 Docker Setup

This repo includes a `Dockerfile` for containerized deployment and local testing:

```Dockerfile
# Use Node 20 base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the source code
COPY . .

# Set environment variables
ENV AUTH_SECRET=xxyyzzx********
ENV DATABASE_URL="mongodb+srv://saurabhbebi:**************"

# Build the application (includes Prisma schema generation)
RUN npm run build

# Expose port (main app port)
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
