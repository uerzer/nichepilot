#!/usr/bin/env python3
"""
SERP Analyzer - Analyzes top 10 SERP results for content gaps
Uses undetected-chromedriver for scraping
"""

import json
import time
import logging
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('SERPAnalyzer')

class SERPAnalyzer:
    def __init__(self, keyword):
        self.keyword = keyword
        self.options = uc.ChromeOptions()
        self.options.add_argument('--headless=new')
        self.options.add_argument('--no-sandbox')
        self.driver = None
        
    def setup_driver(self):
        """Initialize undetected Chrome driver"""
        logger.info("🌐 Initializing undetected Chrome driver...")
        self.driver = uc.Chrome(options=self.options)
        self.driver.set_page_load_timeout(30)
        
    def analyze_serp(self):
        """Analyze top 10 SERP results"""
        logger.info(f"🔍 Analyzing SERP for: {self.keyword}")
        
        try:
            # Navigate to Google
            self.driver.get(f"https://www.google.com/search?q={self.keyword}")
            time.sleep(3)
            
            # Extract top 10 results
            results = []
            result_elements = self.driver.find_elements(By.CSS_SELECTOR, "div.g")
            
            for i, element in enumerate(result_elements[:10]):
                try:
                    # Extract title
                    title_elem = element.find_element(By.CSS_SELECTOR, "h3")
                    title = title_elem.text.strip()
                    
                    # Extract URL
                    link_elem = element.find_element(By.CSS_SELECTOR, "a")
                    url = link_elem.get_attribute("href")
                    
                    # Extract snippet
                    snippet_elem = element.find_element(By.CSS_SELECTOR, ".VwiC3b")
                    snippet = snippet_elem.text.strip()
                    
                    results.append({
                        "position": i + 1,
                        "title": title,
                        "url": url,
                        "domain": urlparse(url).netloc,
                        "snippet": snippet
                    })
                    
                except Exception as e:
                    logger.debug(f"Error parsing result {i}: {e}")
                    continue
            
            logger.info(f"✅ Found {len(results)} SERP results")
            return results
            
        except Exception as e:
            logger.error(f"❌ Error analyzing SERP: {e}")
            return []
    
    def analyze_content_gaps(self, results):
        """Analyze content gaps from top results"""
        logger.info("🔍 Analyzing content gaps...")
        
        gaps = []
        
        # Analyze domains
        domains = [r['domain'] for r in results]
        domain_counts = {}
        for domain in domains:
            domain_counts[domain] = domain_counts.get(domain, 0) + 1
        
        # Find single-result domains (opportunity)
        for domain, count in domain_counts.items():
            if count == 1:
                gaps.append({
                    "type": "domain_opportunity",
                    "domain": domain,
                    "insight": f"Only {domain} ranks once - opportunity to outrank"
                })
        
        # Analyze title patterns
        titles = [r['title'] for r in results]
        
        # Check for listicle opportunities
        if not any("vs" in title.lower() for title in titles):
            gaps.append({
                "type": "comparison_opportunity",
                "insight": "No comparison content in top 10 - create 'X vs Y' article"
            })
        
        # Check for how-to opportunities
        if not any("how" in title.lower() for title in titles):
            gaps.append({
                "type": "howto_opportunity",
                "insight": "No how-to content in top 10 - create step-by-step guide"
            })
        
        # Check for year-specific content
        current_year = datetime.now().year
        if not any(str(current_year) in title for title in titles):
            gaps.append({
                "type": "freshness_opportunity",
                "insight": f"No {current_year}-specific content - create updated guide"
            })
        
        # Analyze snippet length
        avg_snippet_length = sum(len(r['snippet']) for r in results) / len(results)
        if avg_snippet_length < 150:
            gaps.append({
                "type": "depth_opportunity",
                "insight": "Short snippets indicate shallow content - create comprehensive guide"
            })
        
        logger.info(f"✅ Found {len(gaps)} content gaps")
        return gaps
    
    def calculate_opportunity_score(self, results, gaps):
        """Calculate opportunity score based on gaps"""
        score = 0
        
        # More gaps = higher opportunity
        score += len(gaps) * 15
        
        # Fewer strong domains = higher opportunity
        strong_domains = len(set(r['domain'] for r in results))
        if strong_domains < 7:
            score += 20
        
        # Shorter snippets = higher opportunity
        avg_snippet = sum(len(r['snippet']) for r in results) / len(results)
        if avg_snippet < 120:
            score += 15
        
        return min(100, score)
    
    def save_results(self, results, gaps, opportunity_score):
        """Save results to JSON file"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"data/analytics/serp_{self.keyword.replace(' ', '_')}_{timestamp}.json"
        
        analysis = {
            "keyword": self.keyword,
            "timestamp": datetime.now().isoformat(),
            "serp_results": results,
            "content_gaps": gaps,
            "opportunity_score": opportunity_score,
            "recommendations": [gap['insight'] for gap in gaps]
        }
        
        Path(filename).parent.mkdir(parents=True, exist_ok=True)
        
        with open(filename, 'w') as f:
            json.dump(analysis, f, indent=2)
        
        logger.info(f"💾 Results saved to {filename}")
        logger.info(f"📊 Opportunity Score: {opportunity_score}/100")
        return filename
    
    def close(self):
        """Close browser"""
        if self.driver:
            self.driver.quit()
            logger.info("🔒 Browser closed")

def main():
    # Load keywords from latest trend data
    trend_files = list(Path('data/trends').glob('*.json'))
    if not trend_files:
        logger.error("❌ No trend data found. Run trend_scraper.py first.")
        return
    
    latest_trend = max(trend_files, key=lambda p: p.stat().st_mtime)
    
    with open(latest_trend, 'r') as f:
        trend_data = json.load(f)
    
    # Analyze top 5 rising queries
    keywords = [q['query'] for q in trend_data['rising_queries'][:5]]
    
    for keyword in keywords:
        analyzer = SERPAnalyzer(keyword)
        
        try:
            analyzer.setup_driver()
            
            # Analyze SERP
            results = analyzer.analyze_serp()
            
            if results:
                # Analyze gaps
                gaps = analyzer.analyze_content_gaps(results)
                
                # Calculate opportunity
                score = analyzer.calculate_opportunity_score(results, gaps)
                
                # Save results
                analyzer.save_results(results, gaps, score)
            
        except Exception as e:
            logger.error(f"❌ Error analyzing {keyword}: {e}")
        finally:
            analyzer.close()
        
        time.sleep(2)  # Rate limiting
    
    logger.info("✅ SERP analysis complete!")

if __name__ == '__main__':
    main()
