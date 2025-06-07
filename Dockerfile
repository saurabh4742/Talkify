# Use Node 20 base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

ENV DATABASE_URL="mongodb+srv://saurabhbebi:saurabh4742@cluster0.lpifw.mongodb.net/Talkify"
# Run build (includes Prisma commands)
RUN npm run build

# Expose port
# Expose port - optional, mainly for documentation
EXPOSE 3000 
#3001 3002 3003

# Start the server
CMD ["npm", "start"]
