# Talkify Frontend

**Talkify** is a real-time auto-matching video and chat application, similar in concept to Omegle, but designed with advanced safety and abuse prevention features to protect users — especially children — from vocal and written abuse.

---

## 🚀 Project Overview

Talkify connects users randomly for real-time conversations via video and chat with a seamless "Next" option to move on to another match instantly. Unlike other anonymous chat apps, Talkify integrates **real-time detection of vocal and written abuse** to provide a safer environment for all users, preventing harassment and inappropriate content.

Key highlights:

- Auto-matching of users in real time, with easy “Next” to switch partners
- Real-time voice abuse detection during video calls (using LiveKit integration)
- Written chat abuse detection with instant filtering and warnings
- Scalable frontend built with Next.js & React for smooth user experience
- Multiple backend instances with dynamic load balancing via custom NGINX proxy
- Secure authentication with Clerk.js and data persistence via MongoDB & Prisma

---

## 🛠 Technology Stack

- **Frontend:** Next.js 14 with React and TypeScript
- **Authentication:** Clerk.js for secure user login and management
- **Database:** MongoDB Atlas managed via Prisma ORM
- **Real-time Communication:**  
  - **Video calls:** LiveKit  
  - **Chat:** Socket.IO
- **File Uploads:** UploadThing
- **Containerization:** Docker (for local testing and production builds)
- **Deployment:** Vercel hosting with multiple instances
- **Load Balancing & Reverse Proxy:** NGINX with custom health checks and dynamic routing

---

## 🛡 Safety & Abuse Detection

The core of Talkify’s safety feature set includes:

- **Vocal Abuse Detection:**  
  Audio streams are monitored in real time during LiveKit video calls to detect offensive language or abusive behavior.
  
- **Written Abuse Detection:**  
  Chat messages are filtered and analyzed to block offensive or harmful content immediately.
  
- **Warning & Ban System:**  
  Users who violate abuse policies receive warnings and may be banned automatically to maintain a safe community.

---

## 📦 Docker Setup

The project includes a `Dockerfile` for building and running the frontend app in a containerized environment.

```Dockerfile
# Use Node 20 base image
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire project source
COPY . .

# Set environment variables (example values, replace with your own)
ENV AUTH_SECRET=xxyyzzxxccddssll
ENV DATABASE_URL="mongodb+srv://username:password@cluster0.mongodb.net/Talkify"

# Build the Next.js app including Prisma schema generation
RUN npm run build

# Expose the default port
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
