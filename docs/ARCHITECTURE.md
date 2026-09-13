# System Architecture

## Overview

NichePilot is a modular autonomous SEO pipeline composed of 6 independent scripts orchestrated by a master controller. Each script handles one specific task and communicates via JSON files stored in the `data/` directory.

```
┌─────────────────────────────────────────────────────────────────┐
│                     MASTER ORCHESTRATOR                          │
│                        (main.py)                                 │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Schedule │  │  Logger  │  │  Config  │  │  Error   │       │
│  │  Manager │  │  System  │  │  Loader  │  │  Handler │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  DATA LAYER   │   │  LOGIC LAYER  │   │ EXECUTION LAYER│
└───────────────┘   └───────────────┘   └───────────────┘
```

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATA FLOW                                │
│                                                                  │
│  Google Trends ──→ trend_scraper.py ──→ data/trends/*.json      │
│                                              │                   │
│                                              ▼                   │
│  Google SERP ───→ serp_analyzer.py ──→ data/serp/*.json         │
│                                              │                   │
│                                              ▼                   │
│  OpenAI API ───→ content_generator.py ──→ data/content/*.json   │
│                        │                                         │
│                        ▼                                         │
│                  WordPress REST API                              │
│                                                                  │
│  DataForSEO ───→ ranking_monitor.py ──→ data/rankings/*.json    │
│                                                                  │
│  X/Twitter ───→ social_distributor.py ──→ logs/social/*.json    │
│                                                                  │
│  DirectoryFast ──→ directory_builder.py ──→ WordPress pages      │
└─────────────────────────────────────────────────────────────────┘
```

## Data Layer

### Input Sources
- **Google Trends** - Rising queries, search interest
- **Google SERP** - Top 10 results, content gaps
- **Google Search Console** - Ranking positions, impressions
- **DataForSEO API** - Keyword difficulty, volume, SERP features

### Processing
- **OpenAI GPT-4** - Content generation, brief creation
- **marketingskills** - SEO workflow templates
- **browser-use** - AI-powered browser automation

### Output Destinations
- **WordPress REST API** - Article publishing
- **X/Twitter** - Social distribution
- **Local JSON files** - Data persistence

## Script Responsibilities

| Script | Input | Output | Frequency |
|--------|-------|--------|-----------|
| `trend_scraper.py` | Google Trends | Rising queries | Every 6h |
| `serp_analyzer.py` | Trend queries | Content gaps | Daily 8am |
| `content_generator.py` | Gap analysis | Articles | Daily 10am |
| `ranking_monitor.py` | GSC data | Rankings | Daily 6pm |
| `social_distributor.py` | Published articles | Social posts | 3x daily |
| `directory_builder.py` | Niche data | Directory pages | Weekly |

## Security Model

```
┌─────────────────────────────────────────┐
│         ENVIRONMENT VARIABLES           │
│                                         │
│  OPENAI_API_KEY     → content_generator │
│  DATAFORSEO_LOGIN   → ranking_monitor   │
│  DATAFORSEO_PASSWORD→ ranking_monitor   │
│  WP_URL             → content_generator │
│  WP_TOKEN           → content_generator │
│  X_USERNAME         → social_distributor│
│  X_PASSWORD         → social_distributor│
└─────────────────────────────────────────┘
```

- API keys stored in environment variables (never committed)
- `config.json` in `.gitignore`
- No keys logged to files
- WordPress tokens use Application Passwords (revocable)

## Error Handling Strategy

```
Script Error
    │
    ├─→ Retry (3 attempts, exponential backoff)
    │
    ├─→ Log to logs/*.log
    │
    ├─→ Continue pipeline (non-blocking)
    │
    └─→ Alert if critical failure
```

## Scalability

### Horizontal Scaling
- Run multiple instances for different niches
- Each instance uses separate `data/` directory
- Share WordPress installation via categories

### Vertical Scaling
- Increase article frequency (2→10 per day)
- Add more distribution channels
- Integrate additional APIs

## Performance Characteristics

| Operation | Typical Duration | API Calls |
|-----------|-----------------|-----------|
| Trend scrape | 2-5 min | 2-3 |
| SERP analysis | 5-10 min | 5-10 |
| Content generation | 2-5 min/article | 1-2/article |
| Ranking check | 1-3 min | 1 per keyword |
| Social post | 1-2 min | 1-3 |

## Dependencies

```
Python Packages:
├── undetected-chromedriver  # Bot detection bypass
├── selenium                 # Browser automation
├── openai                   # Content generation
├── requests                 # HTTP client
├── beautifulsoup4           # HTML parsing
├── schedule                 # Task scheduling
└── dataforseo-client        # SEO data API

External Services:
├── OpenAI API               # GPT-4 content
├── DataForSEO               # SEO metrics
├── Google Search Console    # Ranking data
├── WordPress                # CMS
└── X/Twitter                # Social distribution
```
