# Pipeline Documentation

## Overview

The NichePilot pipeline consists of 6 sequential steps that transform raw trend data into published, optimized content. Each step produces JSON output consumed by the next step.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   TRENDS    │────▶│    SERP     │────▶│   CONTENT   │
│  SCRAPER    │     │  ANALYZER   │     │  GENERATOR  │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                    ┌───────────────────────────┘
                    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  RANKING    │◀────│  SOCIAL     │◀────│  WORDPRESS  │
│  MONITOR    │     │ DISTRIBUTOR │     │  PUBLISHER  │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Step 1: Trend Scraper

**Script**: `scripts/trend_scraper.py`
**Frequency**: Every 6 hours
**Duration**: 2-5 minutes

### What It Does
1. Opens Google Trends in undetected Chrome
2. Extracts rising queries for your niche
3. Scrapes "People Also Ask" from Google
4. Saves results to `data/trends/`

### Input
- Niche keyword (from config)

### Output
```json
{
  "niche": "resin art",
  "queries": [
    {
      "query": "best resin art kit 2026",
      "growth": "250%",
      "source": "google_trends"
    },
    {
      "query": "how to fix resin bubbles",
      "growth": "PAA",
      "source": "people_also_ask"
    }
  ],
  "timestamp": "2026-01-15T10:30:00"
}
```

### How to Run Manually
```bash
python3 scripts/trend_scraper.py
```

### Output Location
`data/trends/resin_art_20260115_103000.json`

---

## Step 2: SERP Analyzer

**Script**: `scripts/serp_analyzer.py`
**Frequency**: Daily at 8am
**Duration**: 5-10 minutes

### What It Does
1. Takes top queries from trend data
2. Searches Google for each query
3. Extracts top 10 results
4. Identifies content gaps
5. Scores opportunity (0-100)

### Input
- Latest trend data from `data/trends/`

### Output
```json
{
  "keyword": "best resin art kit 2026",
  "score": 87,
  "results": [
    {
      "position": 1,
      "title": "Top 10 Resin Kits - SiteA",
      "domain": "sitea.com",
      "url": "https://sitea.com/resin-kits"
    }
  ],
  "gaps": {
    "no_comparison": true,
    "no_howto": false,
    "no_current_year": false
  },
  "recommendations": [
    "Create comparison content (X vs Y)",
    "Include 2026-specific data"
  ]
}
```

### Scoring Criteria
| Factor | Points |
|--------|--------|
| Fewer unique domains (<7) | +25 |
| No comparison content | +20 |
| No how-to content | +20 |
| No current year in titles | +15 |
| Fewer results (<8) | +20 |

### How to Run Manually
```bash
python3 scripts/serp_analyzer.py
```

### Output Location
`data/serp/analysis_20260115_080000.json`

---

## Step 3: Content Generator

**Script**: `scripts/content_generator.py`
**Frequency**: Daily at 10am
**Duration**: 2-5 minutes per article

### What It Does
1. Takes top opportunities from SERP analysis
2. Generates content brief using marketingskills
3. Creates full article with GPT-4
4. Adds schema markup (FAQ, HowTo)
5. Publishes to WordPress as draft

### Input
- SERP analysis from `data/serp/`
- OpenAI API key

### Output
```json
{
  "title": "How to Fix Resin Bubbles: Complete Guide (2026)",
  "meta_description": "Learn how to fix common resin bubbles...",
  "content": "# How to Fix Resin Bubbles\n\n...",
  "faq": [
    {
      "question": "Why do bubbles form in resin?",
      "answer": "Bubbles form when..."
    }
  ],
  "schema": ["FAQPage", "HowTo"],
  "word_count": 2847
}
```

### Content Quality Gates
- Word count: 2000-3000 words
- Readability: Flesch score > 60
- Originality: > 95% unique
- Schema markup: FAQ + HowTo
- Internal links: 3+ per article

### How to Run Manually
```bash
python3 scripts/content_generator.py
```

### Output Location
- Local: `data/content/resin_bubbles_20260115_100000.json`
- WordPress: Draft post in your WP admin

---

## Step 4: Ranking Monitor

**Script**: `scripts/ranking_monitor.py`
**Frequency**: Daily at 6pm
**Duration**: 1-3 minutes

### What It Does
1. Pulls GSC data via DataForSEO
2. Checks current rankings for target keywords
3. Compares to historical data
4. Detects significant changes (±3 positions)
5. Generates optimization recommendations

### Input
- DataForSEO API credentials
- Previous ranking data

### Output
```json
{
  "timestamp": "2026-01-15T18:00:00",
  "rankings": [
    {
      "keyword": "resin art for beginners",
      "position": 7,
      "url": "https://yoursite.com/resin-beginners",
      "change": -2
    }
  ],
  "changes": [
    {
      "keyword": "resin art for beginners",
      "previous_position": 5,
      "current_position": 7,
      "change": -2,
      "status": "dropped"
    }
  ],
  "recommendations": [
    {
      "type": "recover",
      "keyword": "resin art for beginners",
      "action": "Position dropped from 5 to 7. Audit content freshness..."
    }
  ]
}
```

### How to Run Manually
```bash
python3 scripts/ranking_monitor.py
```

### Output Location
`data/rankings/rankings_20260115_180000.json`

---

## Step 5: Social Distributor

**Script**: `scripts/social_distributor.py`
**Frequency**: 3x daily (12pm, 5pm, 9pm)
**Duration**: 1-2 minutes

### What It Does
1. Finds recently published articles
2. Extracts key points for thread
3. Logs into X/Twitter via undetected Chrome
4. Posts engaging thread with CTA
5. Logs post to analytics

### Input
- Published articles from WordPress
- X/Twitter credentials

### Output
```json
{
  "timestamp": "2026-01-15T12:00:00",
  "article_title": "How to Fix Resin Bubbles",
  "platform": "X/Twitter",
  "thread": [
    "🔥 How to Fix Resin Bubbles: Complete Guide (2026)\n\nA thread 👇",
    "1/ Why bubbles form in resin and how to prevent them",
    "2/ The heat gun technique that saves failed projects",
    "3/ Common mistakes beginners make (and how to fix them)",
    "📖 Read the full guide:\nhttps://yoursite.com/fix-resin-bubbles\n\n♻️ Repost if this helped!"
  ],
  "success": true
}
```

### How to Run Manually
```bash
python3 scripts/social_distributor.py
```

### Output Location
`data/analytics/social_20260115_120000.json`

---

## Step 6: Directory Builder

**Script**: `scripts/directory_builder.py`
**Frequency**: Weekly (Sunday midnight)
**Duration**: 2-3 minutes

### What It Does
1. Generates niche directory structure
2. Creates category pages with items
3. Adds schema markup (ItemList)
4. Publishes to WordPress as pages
5. Builds internal linking structure

### Input
- Niche from config
- WordPress credentials

### Output
```json
{
  "niche": "resin art",
  "categories": {
    "Tools": [
      {"name": "Heat Gun", "description": "...", "affiliate_link": "..."},
      {"name": "Silicone Mats", "description": "...", "affiliate_link": "..."}
    ],
    "Materials": [...],
    "Techniques": [...],
    "Projects": [...]
  },
  "total_items": 20,
  "pages_published": 5
}
```

### How to Run Manually
```bash
python3 scripts/directory_builder.py
```

### Output Location
- Local: `data/content/directory_resin_art_20260115_000000.json`
- WordPress: Published pages at `/directory/*`

---

## Pipeline Orchestration

### Master Orchestrator (`main.py`)

The master script coordinates all steps:

```python
# Daily schedule
06:00 - Ranking Monitor
08:00 - SERP Analyzer
10:00 - Content Generator
12:00 - Social Distributor
17:00 - Social Distributor
21:00 - Social Distributor
18:00 - Ranking Monitor

# Weekly
Sunday 00:00 - Directory Builder
```

### Running the Full Pipeline
```bash
# Once
python3 main.py --task full

# Continuous (every hour)
python3 main.py --start

# Specific task
python3 main.py --task trends
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATA FLOW                                │
│                                                                  │
│  Google Trends ──→ trend_scraper.py                              │
│                          │                                       │
│                          ▼                                       │
│                  data/trends/*.json                              │
│                          │                                       │
│                          ▼                                       │
│                  serp_analyzer.py ──→ Google SERP                │
│                          │                                       │
│                          ▼                                       │
│                  data/serp/*.json                                │
│                          │                                       │
│                          ▼                                       │
│              content_generator.py ──→ OpenAI API                 │
│                    │              │                              │
│                    ▼              ▼                              │
│          data/content/*.json   WordPress                         │
│                    │                                             │
│                    ▼                                             │
│            social_distributor.py ──→ X/Twitter                   │
│                    │                                             │
│                    ▼                                             │
│          data/analytics/social/*.json                            │
│                                                                  │
│  DataForSEO ──→ ranking_monitor.py ──→ data/rankings/*.json     │
│                                                                  │
│  DirectoryFast ──→ directory_builder.py ──→ WordPress pages      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Error Handling

### Retry Strategy
- 3 attempts with exponential backoff
- 1s → 2s → 4s delays between retries

### Failure Modes
| Script | On Failure |
|--------|-----------|
| trend_scraper | Skip, use cached data |
| serp_analyzer | Skip, use cached data |
| content_generator | Log error, continue |
| ranking_monitor | Log error, continue |
| social_distributor | Log error, continue |
| directory_builder | Log error, continue |

### Recovery
- Pipeline continues even if one step fails
- Check logs for errors: `tail -f logs/nichepilot.log`
- Re-run failed step manually if needed

---

## Performance Optimization

### Parallel Execution
Currently sequential. Future improvement:
```python
# Run independent steps in parallel
from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor(max_workers=3) as executor:
    executor.submit(run_trend_scraper)
    executor.submit(run_serp_analyzer)
    executor.submit(run_ranking_monitor)
```

### Caching
- Cache trend data for 6 hours
- Cache SERP data for 24 hours
- Cache keyword rankings for 24 hours

### Rate Limiting
- Respect API rate limits
- Add delays between requests
- Use exponential backoff on 429 errors

---

## Monitoring

### Key Metrics
- Articles generated per day
- Words published per week
- Ranking changes detected
- Social posts published
- API costs per day

### Log Files
- `logs/nichepilot.log` - Main execution log
- `logs/cron_*.log` - Cron job logs
- `logs/pipeline_*.log` - Individual run logs

### Alerts
Set up alerts for:
- API quota exhaustion
- Publishing failures
- Ranking drops > 5 positions
- Unusual cost spikes
