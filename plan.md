# Autonomous Niche Site Strategy Plan

## Objective
Build and optimize a niche site targeting ad network thresholds (Ezoic → Mediavine → Raptive) using automated trend research, content generation, and SEO optimization.

## Phase 1: Foundation (Week 1-2)

### 1.1 Niche Selection Criteria
- **Ezoic threshold**: 10k monthly pageviews (easiest entry point)
- **Mediavine threshold**: 50k monthly sessions
- **Raptive threshold**: 100k monthly pageviews

### 1.2 Niche Research Automation
**Tools needed:**
- `undetected-chromedriver` + `browser-use` for Google Trends scraping
- `computer-use` for SERP analysis
- DataForSEO API for keyword volume/difficulty
- Google Search Console API for tracking

**Target niches (low competition, high RPM):**
1. Home organization & storage solutions
2. Pet care for specific breeds
3. Hobbyist crafts (resin art, candle making)
4. Budget travel for specific demographics
5. Plant care for beginners

### 1.3 Trend Research Workflow
```python
# Automated trend discovery
1. Scrape Google Trends "rising" queries in target categories
2. Filter by search volume 1k-10k monthly (sweet spot)
3. Check KD (keyword difficulty) < 30
4. Verify monetization potential (affiliate + display ads)
5. Generate content brief with semantic keywords
```

## Phase 2: Content Production (Week 2-4)

### 2.1 Content Generation Pipeline
**Using SimplerSoftwareIO/seo-ai-agent:**
- Auto-generate 30-50 pillar articles (2000-3000 words each)
- Include schema markup (FAQ, HowTo, Product)
- Optimize for E-E-A-T signals
- Internal linking strategy

### 2.2 Programmatic SEO
**Using coreyhaines31/marketingskills:**
- Generate location-based pages (if applicable)
- Create comparison pages ("X vs Y")
- Build resource directories
- Auto-generate FAQ sections from People Also Ask

### 2.3 Content Quality Gates
- Grammarly/Hemingway score < grade 8
- Readability score > 60
- Original content score > 95%
- Minimum 3 internal links per article
- Schema markup validation

## Phase 3: Technical SEO (Week 3-5)

### 3.1 Site Architecture
```
Homepage
├── Category 1 (pillar page)
│   ├── Article 1
│   ├── Article 2
│   └── Article 3
├── Category 2 (pillar page)
│   ├── Article 1
│   ├── Article 2
│   └── Article 3
└── Resources
    ├── Tools
    ├── Guides
    └── Directory
```

### 3.2 On-Page Optimization
- Title tags: [Primary Keyword] - [Benefit] | [Brand]
- Meta descriptions: 155 chars, include CTA
- H1: Primary keyword
- H2-H3: Semantic variations
- Image alt text: Descriptive + keyword
- URL structure: /category/keyword-phrase

### 3.3 Technical Checklist
- Core Web Vitals optimization (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- Mobile-first responsive design
- XML sitemap auto-generation
- Robots.txt optimization
- Schema markup (Organization, Article, FAQ)
- Internal linking automation

## Phase 4: Distribution & Growth (Week 4-8)

### 4.1 Social Distribution
**Using x-algorithm insights:**
- Post to X/Twitter during peak engagement (9-11am EST)
- Reply velocity optimization
- Thread format for long-form content
- Visual content (infographics, charts)

### 4.2 Link Building Automation
- HARO (Help A Reporter Out) monitoring
- Guest post outreach templates
- Broken link building
- Resource page submissions
- Directory submissions (using DirectoryFast)

### 4.3 Traffic Monitoring
**Using every-app/open-seo MCP:**
- Daily GSC data pull
- Weekly ranking reports
- Monthly traffic analysis
- Competitor tracking

## Phase 5: Monetization Ramp (Month 2-3)

### 5.1 Ezoic Application (10k pageviews)
- Apply at 10k monthly pageviews
- Expected RPM: $5-15
- Revenue target: $50-150/month

### 5.2 Mediavine Application (50k sessions)
- Apply at 50k monthly sessions
- Expected RPM: $15-30
- Revenue target: $750-1500/month

### 5.3 Raptive Application (100k pageviews)
- Apply at 100k monthly pageviews
- Expected RPM: $20-40
- Revenue target: $2000-4000/month

## Automation Stack

### Required Tools
```bash
# Browser automation
pip install undetected-chromedriver browser-use

# Computer use (Anthropic)
pip install computer-use

# SEO data
pip install dataforseo-client

# Content generation
npx skills add coreyhaines31/marketingskills
npx skills add every-app/open-seo --skill '*'

# Agent runtime
git clone https://github.com/SimplerSoftwareIO/seo-ai-agent
```

### Daily Automation Loop
```python
# 1. Morning: Check GSC for opportunities
- Pull yesterday's data
- Identify ranking drops (page 2 → page 3)
- Find new keyword opportunities

# 2. Midday: Content production
- Generate 1-2 new articles
- Update 2-3 existing articles
- Optimize internal linking

# 3. Evening: Distribution
- Post to social media
- Monitor engagement
- Respond to comments

# 4. Weekly: Analysis
- Traffic report
- Revenue tracking
- Competitor analysis
- Strategy adjustment
```

## Success Metrics

### Month 1
- 30+ articles published
- 5k monthly pageviews
- Indexed in Google Search Console
- 10+ keywords on page 1

### Month 2
- 60+ articles published
- 15k monthly pageviews
- Apply for Ezoic
- $50+ monthly revenue

### Month 3
- 100+ articles published
- 35k monthly pageviews
- Ezoic approved
- $200+ monthly revenue

### Month 6
- 200+ articles published
- 50k monthly sessions
- Apply for Mediavine
- $1000+ monthly revenue

## Risk Mitigation

### Content Quality
- Human review before publishing
- Plagiarism check (Copyscape)
- Fact-checking for YMYL topics
- Regular content audits

### Algorithm Updates
- Diversify traffic sources (social, email, direct)
- Build email list from day 1
- Focus on evergreen content
- Monitor Google algorithm updates

### Monetization
- Don't rely on single ad network
- Add affiliate marketing
- Create digital products
- Build brand for long-term value

## Next Steps

1. ✅ Review this plan
2. ⏳ Set up automation tools locally
3. ⏳ Choose niche based on research
4. ⏳ Build WordPress site with GeneratePress theme
5. ⏳ Configure SEO plugins (RankMath)
6. ⏳ Start content generation pipeline
7. ⏳ Monitor and iterate

---

**Note**: This plan requires local execution with Python, browser automation, and API keys. The dashboard app provides tracking and planning tools, but actual automation must run on your machine.
