# Final Robust Production Dockerfile for RCR Backend
FROM node:18-alpine

# Set working directory
WORKDIR /app

# 1. Copy workspace root configuration
COPY RCR/package*.json ./

# 2. Copy workspace package files
RUN mkdir -p backend frontend
COPY RCR/backend/package*.json ./backend/
COPY RCR/frontend/package*.json ./frontend/

# 3. Install production dependencies
# Using 'npm install' for maximum compatibility with mismatched lockfiles
RUN npm install -w backend --omit=dev --no-audit --no-fund

# 4. Copy the rest of the backend source code
COPY RCR/backend/ ./backend/

# Set environment variables
ENV NODE_ENV=production
# Do not hardcode PORT here, let cloud provider set it
EXPOSE 5000

# Use non-root user
USER node

# Start the application from the backend directory
WORKDIR /app/backend

# 🚨 RUN MIGRATIONS ON START: Ensures database schema is always up to date
# We use sh -c to chain commands.
CMD ["sh", "-c", "npm run migrate && npm start"]
