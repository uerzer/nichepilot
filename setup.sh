#!/bin/bash
# NichePilot Master Setup Script
# Run this first to install all dependencies

set -e

echo "🚀 NichePilot Setup Starting..."

# Check Python version
python3 --version || { echo "❌ Python 3.10+ required"; exit 1; }

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install --upgrade pip
pip install undetected-chromedriver browser-use computer-use dataforseo-client schedule openai anthropic requests beautifulsoup4 selenium

# Install Node.js skills
echo "📦 Installing skill packs..."
npx skills add coreyhaines31/marketingskills
npx skills add every-app/open-seo --skill '*'

# Clone SEO agent
if [ ! -d "seo-ai-agent" ]; then
    git clone https://github.com/SimplerSoftwareIO/seo-ai-agent
    cd seo-ai-agent
    pip install -r requirements.txt
    cd ..
fi

# Create directories
mkdir -p logs data scripts config

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy config.example.json to config.json and fill in API keys"
echo "2. Run: python3 main.py --setup"
echo "3. Run: python3 main.py --start"
