# Proxy Dockerfile for Root Deployment (Railway/Render)
FROM node:18-alpine

WORKDIR /app

# Copy root and workspace package files
COPY RCR/package*.json ./
COPY RCR/backend/package*.json ./backend/
COPY RCR/frontend/package*.json ./frontend/

# Install only backend dependencies from workspace
RUN npm install -w RCR/backend --omit=dev --no-audit --no-fund

# Copy backend source
COPY RCR/backend/ ./backend/

# Set environment
ENV NODE_ENV=production
EXPOSE 5000

# Use non-root user
USER node

# Start from backend directory
WORKDIR /app/backend
CMD ["sh", "-c", "npx knex migrate:latest && npm start"]
