# Workspace-aware Dockerfile for RCR Backend
# Assumes build context is the 'RCR' directory
FROM node:18-alpine

WORKDIR /app/RCR

# 1. Copy root workspace files
COPY package*.json ./

# 2. Copy workspace package files
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# 3. Install production dependencies for backend
RUN npm ci -w backend --omit=dev

# 4. Copy backend source
COPY backend/ ./backend/

# Set environment
ENV NODE_ENV=production
EXPOSE 5000

# Use non-root user
USER node

# Start from backend directory
WORKDIR /app/RCR/backend
CMD ["npm", "start"]
