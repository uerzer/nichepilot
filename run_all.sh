#!/bin/bash
# NichePilot - Run All Automation Loops
# Execute this to run the complete pipeline once

set -e

echo "🚀 NichePilot - Starting Full Pipeline"
echo "========================================"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Run setup.sh first."
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Check if config exists
if [ ! -f "config.json" ]; then
    echo "❌ config.json not found. Copy config.example.json and fill in your API keys."
    exit 1
fi

# Create logs directory
mkdir -p logs

# Timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="logs/pipeline_${TIMESTAMP}.log"

echo "📝 Logging to: ${LOG_FILE}"
echo ""

# Run pipeline
echo "🔍 Step 1/5: Trend Scraper"
echo "----------------------------------------"
python3 scripts/trend_scraper.py 2>&1 | tee -a "${LOG_FILE}"
echo ""

echo "📊 Step 2/5: SERP Analyzer"
echo "----------------------------------------"
python3 scripts/serp_analyzer.py 2>&1 | tee -a "${LOG_FILE}"
echo ""

echo "✍️  Step 3/5: Content Generator"
echo "----------------------------------------"
python3 scripts/content_generator.py 2>&1 | tee -a "${LOG_FILE}"
echo ""

echo "📈 Step 4/5: Ranking Monitor"
echo "----------------------------------------"
python3 scripts/ranking_monitor.py 2>&1 | tee -a "${LOG_FILE}"
echo ""

echo "📢 Step 5/5: Social Distributor"
echo "----------------------------------------"
python3 scripts/social_distributor.py 2>&1 | tee -a "${LOG_FILE}"
echo ""

echo "========================================"
echo "✅ Pipeline Complete!"
echo "📊 Check logs at: ${LOG_FILE}"
echo "📁 Data saved to: data/"
echo "========================================"
