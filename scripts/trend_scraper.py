#!/usr/bin/env python3
"""
Trend Scraper - Scrapes Google Trends for rising queries
Uses undetected-chromedriver + browser-use for bot detection bypass
"""

import json
import time
import logging
from datetime import datetime
from pathlib import Path
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('TrendScraper')

class TrendScraper:
    def __init__(self, niche="resin art"):
        self.niche = niche
        self.options = uc.ChromeOptions()
        self.options.add_argument('--headless=new')
        self.options.add_argument('--no-sandbox')
        self.options.add_argument('--disable-dev-shm-usage')
        self.driver = None
        
    def setup_driver(self):
        """Initialize undetected Chrome driver"""
        logger.info("🌐 Initializing undetected Chrome driver...")
        self.driver = uc.Chrome(options=self.options)
        self.driver.set_page_load_timeout(30)
        
    def scrape_google_trends(self):
        """Scrape Google Trends for rising queries"""
        logger.info(f"🔍 Scraping Google Trends for: {self.niche}")
        
        try:
            # Navigate to Google Trends
            self.driver.get(f"https://trends.google.com/trends/explore?q={self.niche}&geo=US")
            time.sleep(5)  # Wait for page load
            
            # Wait for trends data to load
            WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".widget-container"))
            )
            
            # Extract rising queries
            rising_queries = []
            
            # Scroll to "Related queries" section
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight / 2);")
            time.sleep(2)
            
            # Find all query cards
            query_elements = self.driver.find_elements(By.CSS_SELECTOR, ".fe-table tbody tr")
            
            for element in query_elements[:20]:  # Top 20 queries
                try:
                    cells = element.find_elements(By.TAG_NAME, "td")
                    if len(cells) >= 2:
                        query_text = cells[0].text.strip()
                        growth = cells[1].text.strip()
                        
                        if query_text and growth:
                            rising_queries.append({
                                "query": query_text,
                                "growth": growth,
                                "timestamp": datetime.now().isoformat()
                            })
                except Exception as e:
                    logger.debug(f"Error parsing query: {e}")
                    continue
            
            logger.info(f"✅ Found {len(rising_queries)} rising queries")
            return rising_queries
            
        except TimeoutException:
            logger.error("❌ Timeout waiting for Google Trends to load")
            return []
        except Exception as e:
            logger.error(f"❌ Error scraping trends: {e}")
            return []
    
    def scrape_also_asked(self):
        """Scrape 'People Also Ask' from Google"""
        logger.info(f"🔍 Scraping 'People Also Ask' for: {self.niche}")
        
        try:
            # Navigate to Google search
            self.driver.get(f"https://www.google.com/search?q={self.niche}")
            time.sleep(3)
            
            # Find "People also ask" section
            paa_questions = []
            
            # Scroll to find PAA section
            self.driver.execute_script("window.scrollTo(0, 800);")
            time.sleep(2)
            
            # Find PAA questions
            paa_elements = self.driver.find_elements(By.CSS_SELECTOR, ".related-question-pair .cbphWd")
            
            for element in paa_elements[:10]:
                try:
                    question = element.text.strip()
                    if question:
                        paa_questions.append({
                            "question": question,
                            "source": "people_also_ask",
                            "timestamp": datetime.now().isoformat()
                        })
                except Exception as e:
                    logger.debug(f"Error parsing PAA: {e}")
                    continue
            
            logger.info(f"✅ Found {len(paa_questions)} PAA questions")
            return paa_questions
            
        except Exception as e:
            logger.error(f"❌ Error scraping PAA: {e}")
            return []
    
    def save_results(self, trends, paa_questions):
        """Save results to JSON file"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"data/trends/{self.niche.replace(' ', '_')}_{timestamp}.json"
        
        results = {
            "niche": self.niche,
            "timestamp": datetime.now().isoformat(),
            "rising_queries": trends,
            "people_also_ask": paa_questions,
            "total_queries": len(trends),
            "total_paa": len(paa_questions)
        }
        
        Path(filename).parent.mkdir(parents=True, exist_ok=True)
        
        with open(filename, 'w') as f:
            json.dump(results, f, indent=2)
        
        logger.info(f"💾 Results saved to {filename}")
        return filename
    
    def close(self):
        """Close browser"""
        if self.driver:
            self.driver.quit()
            logger.info("🔒 Browser closed")

def main():
    scraper = TrendScraper(niche="resin art")
    
    try:
        scraper.setup_driver()
        
        # Scrape trends
        trends = scraper.scrape_google_trends()
        
        # Scrape PAA
        paa_questions = scraper.scrape_also_asked()
        
        # Save results
        scraper.save_results(trends, paa_questions)
        
        logger.info("✅ Trend scraping complete!")
        
    except Exception as e:
        logger.error(f"❌ Fatal error: {e}")
    finally:
        scraper.close()

if __name__ == '__main__':
    main()
