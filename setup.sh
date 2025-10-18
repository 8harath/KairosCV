#!/bin/bash

# KairosCV Setup Script
echo "🚀 Setting up KairosCV - AI-Powered Resume Enhancement Platform"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to v18 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
if command -v pnpm &> /dev/null; then
    echo "   Using pnpm..."
    pnpm install
else
    echo "   Using npm..."
    npm install
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚠️  .env.local file not found!"
    echo "   Please create .env.local with the following variables:"
    echo ""
    echo "   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kairos-cv"
    echo "   GEMINI_API_KEY=your-gemini-api-key"
    echo ""
    echo "   See README.md for detailed setup instructions."
    echo ""
else
    echo "✅ .env.local file found"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your .env.local file with MongoDB and Gemini API credentials"
echo "2. Run 'npm run dev' or 'pnpm dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For detailed instructions, see README.md"
