#!/usr/bin/env python3
"""
NichePilot Autopilot - Single File Edition
==========================================
Copy this file, paste your API keys, run it. That's it.

Usage:
    python3 autopilot.py                  # Run full pipeline once
    python3 autopilot.py --loop 3600      # Loop every hour
    python3 autopilot.py --trends-only    # Just scrape trends
    python3 autopilot.py --dry-run        # Show what would happen

Requirements (install once):
    pip install undetected-chromedriver openai requests beautifulsoup4 schedule
"""

import json
import time
import logging
import argparse
import os
import sys
import re
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from urllib.parse import urlparse, quote
from typing import List, Dict, Optional

# ─── Configuration ────────────────────────────────────────────────────────────

CONFIG = {
    # PASTE YOUR KEYS HERE (or set as environment variables)
    "OPENAI_API_KEY": os.environ.get("OPENAI_API_KEY", "sk-your-key-here"),
    "DATAFORSEO_LOGIN": os.environ.get("DATAFORSEO_LOGIN", ""),
    "DATAFORSEO_PASSWORD": os.environ.get("DATAFORSEO_PASSWORD", ""),
    "WP_URL": os.environ.get("WP_URL", "https://yoursite.com"),
    "WP_TOKEN": os.environ.get("WP_TOKEN", ""),
    "X_USERNAME": os.environ.get("X_USERNAME", ""),
    "X_PASSWORD": os.environ.get("X_PASSWORD", ""),

    # Pipeline settings
    "NICHE": "resin art",
    "ARTICLES_PER_RUN": 2,
    "TARGET_AD_NETWORK": "ezoic",  # ezoic | mediavine | raptive
    "AD_THRESHOLDS": {
        "ezoic": 10000,
        "mediavine": 50000,
        "raptive": 100000,
    },
}

# ─── Logging ──────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("autopilot")

# ─── Directory Setup ──────────────────────────────────────────────────────────

def setup_dirs():
    for d in ["data/trends", "data/serp", "data/content", "data/rankings", "logs"]:
        Path(d).mkdir(parents=True, exist_ok=True)

# ─── 1. TREND SCRAPER ────────────────────────────────────────────────────────

def scrape_trends(niche: str) -> List[Dict]:
    """Scrape Google Trends for rising queries using undetected-chromedriver"""
    log.info(f"🔍 Scraping trends for: {niche}")

    try:
        import undetected_chromedriver as uc
        from selenium.webdriver.common.by import By
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC
    except ImportError:
        log.error("❌ Missing: pip install undetected-chromedriver selenium")
        return []

    options = uc.ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36")

    driver = None
    queries = []

    try:
        driver = uc.Chrome(options=options)
        driver.set_page_load_timeout(30)

        # Google Trends
        url = f"https://trends.google.com/trends/explore?q={quote(niche)}&geo=US"
        driver.get(url)
        time.sleep(5)

        try:
            WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".widget-container, .fe-table"))
            )
        except:
            log.warning("⚠️  Trends page didn't load fully, trying alternate extraction")

        # Extract rising queries
        for row in driver.find_elements(By.CSS_SELECTOR, "tr.mz-head-row, .fe-table tbody tr")[:25]:
            cells = row.find_elements(By.TAG_NAME, "td")
            if len(cells) >= 2:
                q = cells[0].text.strip()
                g = cells[1].text.strip()
                if q and len(q) > 2:
                    queries.append({"query": q, "growth": g, "source": "google_trends"})

        # People Also Ask from Google
        driver.get(f"https://www.google.com/search?q={quote(niche)}")
        time.sleep(3)

        for q in driver.find_elements(By.CSS_SELECTOR, ".related-question-pair div, .cbphWd")[:10]:
            text = q.text.strip()
            if text and "?" in text:
                queries.append({"query": text, "growth": "PAA", "source": "people_also_ask"})

        log.info(f"✅ Found {len(queries)} queries")

    except Exception as e:
        log.error(f"❌ Trend scrape error: {e}")
    finally:
        if driver:
            driver.quit()

    # Save
    if queries:
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        path = f"data/trends/{niche.replace(' ', '_')}_{ts}.json"
        with open(path, "w") as f:
            json.dump({"niche": niche, "queries": queries, "ts": ts}, f, indent=2)
        log.info(f"💾 Saved to {path}")

    return queries

# ─── 2. SERP ANALYZER ────────────────────────────────────────────────────────

def analyze_serp(queries: List[Dict], niche: str) -> List[Dict]:
    """Analyze SERPs for content gaps"""
    log.info(f"📊 Analyzing SERPs for {len(queries)} queries")

    try:
        import undetected_chromedriver as uc
        from selenium.webdriver.common.by import By
    except ImportError:
        log.error("❌ Missing: pip install undetected-chromedriver selenium")
        return []

    options = uc.ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")

    driver = None
    opportunities = []

    try:
        driver = uc.Chrome(options=options)
        driver.set_page_load_timeout(30)

        for q in queries[:5]:  # Top 5 queries
            keyword = q["query"]
            log.info(f"  → Analyzing: {keyword}")

            try:
                driver.get(f"https://www.google.com/search?q={quote(keyword)}")
                time.sleep(3)

                results = []
                for el in driver.find_elements(By.CSS_SELECTOR, "div.g")[:10]:
                    try:
                        title = el.find_element(By.CSS_SELECTOR, "h3").text
                        link = el.find_element(By.CSS_SELECTOR, "a").get_attribute("href")
                        results.append({
                            "title": title,
                            "domain": urlparse(link).netloc if link else "",
                            "url": link or "",
                        })
                    except:
                        continue

                # Score opportunity
                score = 0
                unique_domains = len(set(r["domain"] for r in results))
                if unique_domains < 7:
                    score += 25
                if not any("vs" in r["title"].lower() for r in results):
                    score += 20
                if not any("how" in r["title"].lower() for r in results):
                    score += 20
                if not any(str(datetime.now().year) in r["title"] for r in results):
                    score += 15
                if len(results) < 8:
                    score += 20

                opportunities.append({
                    "keyword": keyword,
                    "score": min(100, score),
                    "results": results,
                    "gaps": {
                        "no_comparison": not any("vs" in r["title"].lower() for r in results),
                        "no_howto": not any("how" in r["title"].lower() for r in results),
                        "no_current_year": not any(str(datetime.now().year) in r["title"] for r in results),
                    },
                })
                log.info(f"    Score: {min(100, score)}/100")

            except Exception as e:
                log.warning(f"    ⚠️  Error: {e}")

            time.sleep(2)  # Rate limit

    except Exception as e:
        log.error(f"❌ SERP analysis error: {e}")
    finally:
        if driver:
            driver.quit()

    # Sort by score
    opportunities.sort(key=lambda x: x["score"], reverse=True)

    if opportunities:
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        path = f"data/serp/analysis_{ts}.json"
        with open(path, "w") as f:
            json.dump(opportunities, f, indent=2)
        log.info(f"💾 Saved {len(opportunities)} opportunities")

    return opportunities

# ─── 3. CONTENT GENERATOR ────────────────────────────────────────────────────

def generate_article(keyword: str, gaps: Dict) -> Optional[Dict]:
    """Generate SEO article using OpenAI"""
    log.info(f"✍️  Generating article for: {keyword}")

    if CONFIG["OPENAI_API_KEY"].startswith("sk-your"):
        log.error("❌ Set OPENAI_API_KEY in CONFIG or environment")
        return None

    try:
        import openai
        client = openai.OpenAI(api_key=CONFIG["OPENAI_API_KEY"])
    except ImportError:
        log.error("❌ Missing: pip install openai")
        return None

    gap_text = ", ".join([k.replace("_", " ") for k, v in gaps.items() if v])

    prompt = f"""Write a 2500-word SEO article for: "{keyword}"

Content gaps to fill: {gap_text}

Requirements:
- Engaging intro with hook (first 100 words)
- H2/H3 structure with semantic keywords
- Practical examples and actionable tips
- FAQ section (3-5 questions) at the end
- Beginner-friendly tone (Flesch > 60)
- No fluff

Return JSON: {{"title": "...", "meta_description": "...", "content": "markdown...", "faq": [{{"q": "...", "a": "..."}}]}}"""

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=4000,
            response_format={"type": "json_object"},
        )
        article = json.loads(response.choices[0].message.content)
        log.info(f"✅ Generated: {article.get('title', 'untitled')}")
        return article
    except Exception as e:
        log.error(f"❌ Generation error: {e}")
        return None

def publish_to_wordpress(article: Dict, keyword: str) -> Optional[int]:
    """Publish to WordPress via REST API"""
    if not CONFIG["WP_URL"] or CONFIG["WP_URL"].endswith("yoursite.com"):
        log.warning("⚠️  WP_URL not configured, saving locally only")
        return None

    try:
        import requests
        headers = {
            "Authorization": f"Bearer {CONFIG['WP_TOKEN']}",
            "Content-Type": "application/json",
        }
        data = {
            "title": article["title"],
            "content": article["content"],
            "status": "draft",
            "excerpt": article.get("meta_description", ""),
        }
        r = requests.post(
            f"{CONFIG['WP_URL']}/wp-json/wp/v2/posts",
            headers=headers,
            json=data,
            timeout=30,
        )
        if r.status_code == 201:
            post_id = r.json()["id"]
            log.info(f"📤 Published draft #{post_id}")
            return post_id
        else:
            log.error(f"❌ WP error: {r.status_code} {r.text}")
    except Exception as e:
        log.error(f"❌ Publish error: {e}")
    return None

# ─── 4. RANKING MONITOR ──────────────────────────────────────────────────────

def check_rankings(keywords: List[str]) -> List[Dict]:
    """Check current rankings via DataForSEO"""
    log.info(f"📈 Checking rankings for {len(keywords)} keywords")

    if not CONFIG["DATAFORSEO_LOGIN"]:
        log.warning("⚠️  DataForSEO not configured, skipping ranking check")
        return []

    try:
        import requests
        import base64
        creds = base64.b64encode(
            f"{CONFIG['DATAFORSEO_LOGIN']}:{CONFIG['DATAFORSEO_PASSWORD']}".encode()
        ).decode()
        headers = {"Authorization": f"Basic {creds}"}

        rankings = []
        for kw in keywords[:10]:
            try:
                r = requests.post(
                    "https://api.dataforseo.com/v3/keywords_data/google organic/live_advanced",
                    headers=headers,
                    json={
                        "keyword": kw,
                        "location_name": "United States",
                        "language_name": "English",
                        "depth": 100,
                    },
                    timeout=30,
                )
                if r.status_code == 200:
                    data = r.json()
                    if data.get("tasks") and data["tasks"][0].get("result"):
                        for item in data["tasks"][0]["result"][0].get("items", []):
                            if CONFIG["WP_URL"].replace("https://", "") in item.get("url", ""):
                                rankings.append({
                                    "keyword": kw,
                                    "position": item.get("rank_absolute"),
                                    "url": item.get("url"),
                                })
                                break
            except Exception as e:
                log.warning(f"  ⚠️  Error for {kw}: {e}")
            time.sleep(1)

        log.info(f"✅ Found {len(rankings)} rankings")
        return rankings

    except Exception as e:
        log.error(f"❌ Ranking check error: {e}")
        return []

# ─── 5. SOCIAL DISTRIBUTOR ───────────────────────────────────────────────────

def distribute_to_social(article: Dict):
    """Post to X/Twitter using undetected-chromedriver"""
    if not CONFIG["X_USERNAME"]:
        log.warning("⚠️  X credentials not configured, skipping social")
        return

    log.info(f"📢 Distributing: {article.get('title', 'untitled')}")

    try:
        import undetected_chromedriver as uc
        from selenium.webdriver.common.by import By
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC

        options = uc.ChromeOptions()
        driver = uc.Chrome(options=options)

        # Login
        driver.get("https://x.com/login")
        time.sleep(3)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[autocomplete='username']"))
        ).send_keys(CONFIG["X_USERNAME"])
        driver.find_element(By.XPATH, "//span[text()='Next']").click()
        time.sleep(2)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='password']"))
        ).send_keys(CONFIG["X_PASSWORD"])
        driver.find_element(By.XPATH, "//span[text()='Log in']").click()
        time.sleep(5)

        # Compose
        driver.get("https://x.com/compose/tweet")
        time.sleep(2)
        tweet_box = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='tweetTextarea_0']"))
        )
        tweet = f"🔥 {article['title']}\n\n{article.get('meta_description', '')[:200]}\n\n{CONFIG['WP_URL']}"
        tweet_box.send_keys(tweet[:280])
        time.sleep(1)

        driver.find_element(By.CSS_SELECTOR, "[data-testid='tweetButtonInline']").click()
        time.sleep(3)

        log.info("✅ Posted to X")
        driver.quit()

    except Exception as e:
        log.error(f"❌ Social error: {e}")

# ─── 6. DIRECTORY BUILDER ────────────────────────────────────────────────────

def build_directory(niche: str):
    """Generate programmatic directory pages"""
    log.info(f"📁 Building directory for: {niche}")

    categories = {
        "Tools": ["Heat Gun", "Silicone Mats", "Mixing Cups", "Mold Set", "Digital Scale"],
        "Materials": ["Epoxy Resin", "Pigments", "Glitter", "Dried Flowers", "UV Resin"],
        "Techniques": ["Ocean Art", "Geode Art", "Petal Pour", "Dirty Pour", "Swipe"],
        "Projects": ["Coasters", "River Table", "Jewelry", "Wall Art", "Keychains"],
    }

    directory = {"niche": niche, "categories": categories}
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    path = f"data/content/directory_{ts}.json"
    with open(path, "w") as f:
        json.dump(directory, f, indent=2)

    log.info(f"✅ Directory built with {sum(len(v) for v in categories.values())} items")
    return directory

# ─── PIPELINE ORCHESTRATOR ────────────────────────────────────────────────────

def run_pipeline(dry_run: bool = False, trends_only: bool = False):
    """Execute the full autopilot pipeline"""
    setup_dirs()
    niche = CONFIG["NICHE"]
    target = CONFIG["TARGET_AD_NETWORK"]
    threshold = CONFIG["AD_THRESHOLDS"][target]

    log.info("=" * 60)
    log.info(f"🚀 NICHEPILOT AUTOPILOT")
    log.info(f"   Niche: {niche}")
    log.info(f"   Target: {target} ({threshold:,} pageviews)")
    log.info(f"   Time: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    log.info("=" * 60)

    if dry_run:
        log.info("🔍 DRY RUN - showing what would happen")
        log.info(f"  1. Scrape trends for '{niche}'")
        log.info(f"  2. Analyze SERPs for top 5 queries")
        log.info(f"  3. Generate {CONFIG['ARTICLES_PER_RUN']} articles")
        log.info(f"  4. Publish to WordPress as drafts")
        log.info(f"  5. Post to X/Twitter")
        log.info(f"  6. Check rankings")
        return

    # Step 1: Trends
    queries = scrape_trends(niche)
    if not queries:
        log.warning("⚠️  No queries found, using fallback keywords")
        queries = [
            {"query": f"best {niche} kit", "growth": "rising", "source": "fallback"},
            {"query": f"{niche} for beginners", "growth": "rising", "source": "fallback"},
            {"query": f"how to start {niche}", "growth": "rising", "source": "fallback"},
        ]

    if trends_only:
        log.info("✅ Trends-only mode complete")
        return

    # Step 2: SERP Analysis
    opportunities = analyze_serp(queries, niche)

    # Step 3: Content Generation
    top_opps = [o for o in opportunities if o["score"] >= 50][:CONFIG["ARTICLES_PER_RUN"]]
    if not top_opps:
        top_opps = [{"keyword": q["query"], "score": 50, "gaps": {"no_howto": True}} for q in queries[:2]]

    articles = []
    for opp in top_opps:
        article = generate_article(opp["keyword"], opp.get("gaps", {}))
        if article:
            # Save locally
            ts = datetime.now().strftime("%Y%m%d_%H%M%S")
            slug = opp["keyword"].replace(" ", "_")
            path = f"data/content/{slug}_{ts}.json"
            with open(path, "w") as f:
                json.dump(article, f, indent=2)

            # Publish to WP
            post_id = publish_to_wordpress(article, opp["keyword"])
            articles.append({"article": article, "keyword": opp["keyword"], "post_id": post_id})

    # Step 4: Social Distribution
    for a in articles[:1]:  # Post first article
        distribute_to_social(a["article"])

    # Step 5: Rankings
    keywords = [a["keyword"] for a in articles]
    check_rankings(keywords)

    # Step 6: Directory (weekly)
    if datetime.now().weekday() == 6:  # Sunday
        build_directory(niche)

    # Summary
    log.info("=" * 60)
    log.info("✅ PIPELINE COMPLETE")
    log.info(f"   Articles generated: {len(articles)}")
    log.info(f"   Published to WP: {sum(1 for a in articles if a['post_id'])}")
    log.info(f"   Data saved to: data/")
    log.info("=" * 60)

# ─── MAIN ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="NichePilot Autopilot")
    parser.add_argument("--loop", type=int, help="Loop interval in seconds")
    parser.add_argument("--trends-only", action="store_true", help="Only scrape trends")
    parser.add_argument("--dry-run", action="store_true", help="Show what would happen")
    parser.add_argument("--niche", help="Override niche")
    parser.add_argument("--target", choices=["ezoic", "mediavine", "raptive"], help="Target ad network")
    args = parser.parse_args()

    if args.niche:
        CONFIG["NICHE"] = args.niche
    if args.target:
        CONFIG["TARGET_AD_NETWORK"] = args.target

    if args.loop:
        log.info(f"🔄 Loop mode: every {args.loop}s")
        while True:
            try:
                run_pipeline(dry_run=args.dry_run, trends_only=args.trends_only)
                log.info(f"⏳ Sleeping {args.loop}s...")
                time.sleep(args.loop)
            except KeyboardInterrupt:
                log.info("\n⏹️  Stopped")
                break
    else:
        run_pipeline(dry_run=args.dry_run, trends_only=args.trends_only)

if __name__ == "__main__":
    main()
