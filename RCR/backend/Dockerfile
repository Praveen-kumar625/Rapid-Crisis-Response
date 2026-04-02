# Use an official, lightweight Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the backend application code
COPY . .

# Expose the port that the API runs on (matches your PORT_API in .env)
EXPOSE 5000

# Start the application
# Make sure your package.json has a "start" script, e.g., "start": "node src/index.js"
CMD ["npm", "start"]