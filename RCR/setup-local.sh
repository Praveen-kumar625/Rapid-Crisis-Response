#!/bin/bash
# RCR Local Setup Script

echo "🛠️ Starting RCR Local Setup..."

# 1. Backend Setup
echo "📂 Setting up backend..."
cd backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created backend .env (Please update with your keys)"
fi
npm install
npm run migrate
cd ..

# 2. Frontend Setup
echo "📂 Setting up frontend..."
cd frontend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created frontend .env (Please update with your keys)"
fi
npm install
cd ..

echo "🚀 Setup complete! Use 'docker-compose up' to start the full stack or 'npm run dev' in both backend and frontend."
