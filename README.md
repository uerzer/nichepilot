# NichePilot - Autonomous SEO Operations

A complete autonomous SEO pipeline that scrapes trends, analyzes SERPs, generates content, publishes to WordPress, and monitors rankings - all running automatically.

## 📁 Project Structure

```
nichepilot/
├── README.md                 # This file
├── plan.md                   # Full strategy document
├── EXECUTE.md                # Quick-start execution guide
├── autopilot.py              # Single-file Python automation (copy & run)
├── main.py                   # Master orchestrator
├── setup.sh                  # Installation script
├── run_all.sh                # Run pipeline once
├── run_loop.sh               # Run continuously
├── cron_jobs.txt             # Cron job configurations
├── config.example.json       # Configuration template
│
├── docs/                     # Documentation
│   ├── ARCHITECTURE.md       # System architecture
│   ├── SETUP.md              # Detailed setup guide
│   ├── API-KEYS.md           # How to get API keys
│   ├── PIPELINE.md           # How the pipeline works
│   ├── CRON.md               # Scheduling documentation
│   └── TROUBLESHOOTING.md    # Common issues & fixes
│
├── scripts/                  # Python automation scripts
│   ├── trend_scraper.py      # Google Trends scraper
│   ├── serp_analyzer.py      # SERP gap analyzer
│   ├── content_generator.py  # AI content generator
│   ├── ranking_monitor.py    # GSC ranking tracker
│   ├── social_distributor.py # X/Twitter poster
│   └── directory_builder.py  # Directory page generator
│
├── src/                      # React dashboard source
│   ├── App.tsx               # Main dashboard component
│   ├── main.tsx              # Entry point
│   └── index.css             # Styles
│
├── data/                     # Runtime data (created on first run)
│   ├── trends/               # Scraped trend data
│   ├── serp/                 # SERP analysis results
│   ├── content/              # Generated articles
│   ├── rankings/             # Ranking data
│   └── analytics/            # Reports & metrics
│
└── logs/                     # Execution logs (created on first run)
```

## 🚀 Quick Start

### Option 1: Single File (Fastest)
```bash
pip install undetected-chromedriver openai requests schedule selenium
export OPENAI_API_KEY="sk-your-key"
python3 autopilot.py --loop 3600
```

### Option 2: Full Setup
```bash
chmod +x setup.sh run_all.sh run_loop.sh
./setup.sh
cp config.example.json config.json
# Edit config.json with your API keys
./run_all.sh
```

### Option 3: Cron Jobs (Production)
```bash
# Edit cron_jobs.txt with your path
crontab cron_jobs.txt
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/ARCHITECTURE.md) | System design and component overview |
| [Setup Guide](docs/SETUP.md) | Detailed installation instructions |
| [API Keys](docs/API-KEYS.md) | How to obtain and configure API keys |
| [Pipeline](docs/PIPELINE.md) | How each pipeline step works |
| [Cron Jobs](docs/CRON.md) | Scheduling and automation |
| [Troubleshooting](docs/TROUBLESHOOTING.md) | Common issues and solutions |

## 💰 Cost Estimate

| Component | Daily Cost | Monthly Cost |
|-----------|-----------|--------------|
| OpenAI GPT-4 | $3-5 | $90-150 |
| DataForSEO | $1-2 | $30-60 |
| Hosting | - | $10 |
| **Total** | **$4-7** | **$130-220** |

## 📈 Revenue Targets

| Month | Pageviews | Ad Network | Revenue |
|-------|-----------|------------|---------|
| 1 | 5K | - | $0 |
| 2 | 15K | Ezoic | $100-200 |
| 3 | 35K | Ezoic | $350-700 |
| 6 | 50K+ | Mediavine | $1,000+ |

## 🔧 Requirements

- Python 3.10+
- Node.js 18+ (for dashboard)
- Chrome/Chromium browser
- API keys (OpenAI, DataForSEO, WordPress)

## 📄 License

MIT - Use freely for your own projects.
