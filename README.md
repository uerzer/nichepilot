# NichePilot - Autonomous SEO Operations

## ⚡ Quick Start

```bash
# 1. Clone and setup
chmod +x setup.sh run_all.sh run_loop.sh
./setup.sh

# 2. Configure
cp config.example.json config.json
# Edit config.json with your API keys

# 3. Run once
./run_all.sh

# 4. Run continuously (every hour)
./run_loop.sh 3600

# 5. Or use cron
crontab cron_jobs.txt
```

## 🎯 What This Does

This is a **complete autonomous SEO pipeline** that:

1. **Scrapes Google Trends** for rising queries in your niche
2. **Analyzes SERPs** to find content gaps and opportunities
3. **Generates SEO articles** using GPT-4 + marketingskills
4. **Publishes to WordPress** with schema markup
5. **Monitors rankings** and detects changes
6. **Distributes to social media** at optimal times
7. **Builds directory pages** for programmatic SEO

## 📁 Project Structure

```
nichepilot/
├── main.py                    # Master orchestrator
├── setup.sh                   # Installation script
├── run_all.sh                 # Run full pipeline once
├── run_loop.sh                # Run continuously
├── cron_jobs.txt              # Cron job configurations
├── config.example.json        # Configuration template
├── plan.md                    # Strategy document
├── scripts/
│   ├── trend_scraper.py       # Google Trends scraper
│   ├── serp_analyzer.py       # SERP gap analyzer
│   ├── content_generator.py   # AI content generator
│   ├── ranking_monitor.py     # GSC ranking tracker
│   ├── social_distributor.py  # X/Twitter poster
│   └── directory_builder.py   # Directory page generator
├── data/
│   ├── trends/                # Scraped trend data
│   ├── analytics/             # SERP & ranking data
│   └── content/               # Generated articles
└── logs/                      # Execution logs
```

## 🔧 Required API Keys

1. **OpenAI API Key** - Content generation
   - Get: https://platform.openai.com/api-keys
   - Cost: ~$0.03 per article (GPT-4)

2. **DataForSEO API** - SEO data
   - Get: https://dataforseo.com/
   - Cost: Pay-as-you-go, ~$0.001 per query

3. **WordPress REST API Token** - Publishing
   - Get: WordPress admin → Users → Application Passwords
   - Cost: Free

4. **X/Twitter Credentials** - Social posting
   - Your X username and password
   - Cost: Free

## 🚀 Execution Modes

### Mode 1: Manual (One-time run)
```bash
./run_all.sh
```

### Mode 2: Continuous Loop
```bash
# Run every hour
./run_loop.sh 3600

# Run every 30 minutes
./run_loop.sh 1800

# Run 10 times then stop
./run_loop.sh 3600 10
```

### Mode 3: Cron Jobs (Recommended)
```bash
# Edit cron_jobs.txt with your path
nano cron_jobs.txt

# Install cron jobs
crontab cron_jobs.txt

# Verify
crontab -l
```

## 📊 Expected Output

After running, you'll have:

- **data/trends/** - Rising queries from Google Trends
- **data/analytics/** - SERP analysis with opportunity scores
- **data/content/** - Generated articles (JSON + WordPress)
- **logs/** - Detailed execution logs
- **WordPress drafts** - Ready-to-publish articles

## 🎯 Niche Selection

The system works best with niches that have:
- 1K-50K monthly searches
- KD < 30 (low competition)
- $15+ RPM (ad revenue potential)
- Evergreen content (12+ month relevance)

**Recommended starting niches:**
1. Resin art & crafts
2. Indoor plant care
3. Small space organization
4. Budget travel
5. Hobbyist DIY projects

## ⚠️ Important Notes

1. **API Costs**: Budget ~$5-10/day for full automation
2. **Rate Limits**: Scripts include delays to avoid bans
3. **Quality Control**: Review generated content before publishing
4. **WordPress Setup**: Install RankMath SEO plugin
5. **Monitoring**: Check logs daily for errors

## 🔍 Troubleshooting

### Chrome driver issues
```bash
# Install Chrome
sudo apt install google-chrome-stable

# Or use Chromium
sudo apt install chromium-browser
```

### Python dependencies
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### API connection errors
- Verify API keys in config.json
- Check internet connection
- Review error logs in logs/

## 📈 Scaling

Once profitable:
1. Increase article frequency (2-5 per day)
2. Add more niches (run multiple instances)
3. Upgrade to Mediavine at 50k sessions
4. Upgrade to Raptive at 100k pageviews

## 🛠️ Customization

Edit scripts to:
- Change target niche
- Adjust content tone/length
- Modify social posting schedule
- Add new distribution channels
- Integrate additional APIs

## 📞 Support

- Check logs for detailed error messages
- Review plan.md for strategy details
- Modify scripts for custom workflows

---

**Ready to launch your autonomous niche site empire? 🚀**
