# Simple Dockerfile for RCR Backend (skip monorepo complexity)
FROM node:18-alpine

WORKDIR /app

# Copy only backend folder
COPY backend/package*.json ./

# Install backend dependencies only
RUN npm ci --only=production

# Copy backend source
COPY backend/src ./src
COPY backend/knexfile.js ./

# Expose port
EXPOSE 5000

# Start backend directly
CMD ["node", "src/index.js"]
