# Setup Guide

## Prerequisites

### System Requirements
- **OS**: Linux (Ubuntu 20.04+), macOS 11+, or Windows 10+ with WSL2
- **Python**: 3.10 or higher
- **Node.js**: 18+ (for dashboard, optional)
- **Chrome/Chromium**: Latest stable version
- **RAM**: 4GB minimum, 8GB recommended
- **Disk**: 2GB free space

### Check Your Environment
```bash
python3 --version    # Should be 3.10+
node --version       # Should be 18+ (optional)
google-chrome --version  # Or chromium --version
```

## Installation Steps

### Step 1: Clone/Download the Project
```bash
# If using git
git clone <your-repo-url> nichepilot
cd nichepilot

# Or download and extract the zip file
unzip nichepilot.zip
cd nichepilot
```

### Step 2: Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# OR
venv\Scripts\activate     # Windows
```

### Step 3: Install Python Dependencies
```bash
pip install --upgrade pip
pip install undetected-chromedriver selenium openai requests beautifulsoup4 schedule dataforseo-client
```

### Step 4: Install Chrome/Chromium
**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install google-chrome-stable
# OR
sudo apt install chromium-browser
```

**macOS:**
```bash
brew install --cask google-chrome
```

**Windows:**
Download from https://www.google.com/chrome/

### Step 5: Configure API Keys
```bash
cp config.example.json config.json
```

Edit `config.json` with your API keys (see [API-KEYS.md](API-KEYS.md)):
```json
{
  "openai_api_key": "sk-your-key-here",
  "dataforseo_login": "your-login",
  "dataforseo_password": "your-password",
  "wordpress_url": "https://yoursite.com",
  "wordpress_token": "your-wp-token",
  "niche": "resin art"
}
```

### Step 6: Set Up WordPress
1. Install WordPress on your domain
2. Install RankMath SEO plugin
3. Generate Application Password:
   - WordPress Admin → Users → Your Profile
   - Scroll to "Application Passwords"
   - Create new password named "NichePilot"
   - Copy the generated token to `config.json`

### Step 7: Test the Setup
```bash
# Run once to verify everything works
python3 scripts/trend_scraper.py

# Check output
ls data/trends/
```

## Automated Setup (Recommended)

```bash
chmod +x setup.sh
./setup.sh
```

This script:
- Creates virtual environment
- Installs all dependencies
- Clones required repositories
- Creates directory structure
- Verifies installation

## Post-Installation Verification

### Check Python Packages
```bash
pip list | grep -E "undetected|selenium|openai|requests|beautifulsoup4|schedule"
```

Expected output:
```
beautifulsoup4        4.12.x
openai                1.x.x
requests              2.x.x
schedule              1.x.x
selenium              4.x.x
undetected-chromedriver 3.x.x
```

### Check Chrome
```bash
python3 -c "import undetected_chromedriver as uc; driver = uc.Chrome(); print('✅ Chrome works'); driver.quit()"
```

### Check API Connections
```bash
# Test OpenAI
python3 -c "import openai; client = openai.OpenAI(); print(client.models.list().data[0].id)"

# Test DataForSEO
python3 -c "from dataforseo_client import DataForSEOClient; print('✅ DataForSEO configured')"
```

## Dashboard Setup (Optional)

If you want the web dashboard:
```bash
npm install
npm run build
```

The dashboard will be in `dist/index.html`.

## Troubleshooting Installation

### Chrome Driver Issues
```bash
# If Chrome not found
export CHROME_BIN=/usr/bin/google-chrome

# If permission denied
chmod +x /path/to/chromedriver
```

### Python Version Issues
```bash
# If Python 3.10+ not available
sudo apt install python3.11 python3.11-venv
python3.11 -m venv venv
```

### Package Installation Fails
```bash
# Clear pip cache
pip cache purge

# Install with verbose output
pip install -v undetected-chromedriver
```

## Next Steps

After successful installation:
1. Read [API-KEYS.md](API-KEYS.md) to configure your keys
2. Read [PIPELINE.md](PIPELINE.md) to understand how it works
3. Run `./run_all.sh` for your first pipeline execution
4. Set up [CRON.md](CRON.md) for automation

## Support

If you encounter issues:
1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Review logs in `logs/` directory
3. Verify API keys are correct
4. Ensure Chrome is installed and accessible
