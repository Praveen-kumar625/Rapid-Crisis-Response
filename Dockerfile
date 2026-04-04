# Final Robust Production Dockerfile for RCR Backend
FROM node:18-alpine

WORKDIR /app

# 1. Copy workspace root package files
# We expect the build context to be the absolute root of the repository.
COPY RCR/package*.json ./

# 2. Copy workspace definitions
# npm workspaces need the sub-package files to calculate dependencies correctly.
COPY RCR/backend/package*.json ./backend/
COPY RCR/frontend/package*.json ./frontend/

# 3. Install production dependencies for the backend workspace
# We use npm install instead of ci because sub-directories lack their own lockfiles.
RUN npm install -w backend --omit=dev --no-audit --no-fund

# 4. Copy the backend source code
COPY RCR/backend/ ./backend/

# Set environment variables
ENV NODE_ENV=production
# Cloud providers (Railway/Render) will set the PORT environment variable.
EXPOSE 5000

# Use non-root user
USER node

# Start the application from the backend directory
WORKDIR /app/backend

# Run migrations and then start the API
CMD ["sh", "-c", "npx knex migrate:latest && npm start"]
