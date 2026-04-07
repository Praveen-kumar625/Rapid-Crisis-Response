@echo off
echo 🛠️ Starting RCR Local Setup...

REM 1. Backend Setup
echo 📂 Setting up backend...
cd backend
if not exist .env (
    copy .env.example .env
    echo ✅ Created backend .env (Please update with your keys^)
)
call npm install
call npm run migrate
cd ..

REM 2. Frontend Setup
echo 📂 Setting up frontend...
cd frontend
if not exist .env (
    copy .env.example .env
    echo ✅ Created frontend .env (Please update with your keys^)
)
call npm install
cd ..

echo 🚀 Setup complete! Use 'docker-compose up' to start the full stack or 'npm run dev' in both backend and frontend.
