@echo off
echo 🚀 Setting up KairosCV - AI-Powered Resume Enhancement Platform
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18 or higher.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Install dependencies
echo.
echo 📦 Installing dependencies...
if exist "pnpm-lock.yaml" (
    echo    Using pnpm...
    pnpm install
) else (
    echo    Using npm...
    npm install
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo.
    echo ⚠️  .env.local file not found!
    echo    Please create .env.local with the following variables:
    echo.
    echo    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kairos-cv
    echo    GEMINI_API_KEY=your-gemini-api-key
    echo.
    echo    See README.md for detailed setup instructions.
    echo.
) else (
    echo ✅ .env.local file found
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Configure your .env.local file with MongoDB and Gemini API credentials
echo 2. Run 'npm run dev' or 'pnpm dev' to start the development server
echo 3. Open http://localhost:3000 in your browser
echo.
echo For detailed instructions, see README.md
pause
