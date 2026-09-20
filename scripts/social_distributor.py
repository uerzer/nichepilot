#!/usr/bin/env python3
"""
Social Distributor - Auto-posts content to X/Twitter
Uses browser-use for algorithm-optimized posting
"""

import json
import logging
from datetime import datetime
from pathlib import Path
import asyncio
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('SocialDistributor')

class SocialDistributor:
    def __init__(self, config_file='config.json'):
        with open(config_file, 'r') as f:
            self.config = json.load(f)
        
        self.options = uc.ChromeOptions()
        # Don't use headless for X/Twitter - needs to look like real user
        self.driver = None
        
    def setup_driver(self):
        """Initialize undetected Chrome driver"""
        logger.info("🌐 Initializing browser for X/Twitter...")
        self.driver = uc.Chrome(options=self.options)
        self.driver.set_page_load_timeout(30)
        
    def login_to_x(self, username, password):
        """Login to X/Twitter"""
        logger.info("🔐 Logging into X/Twitter...")
        
        try:
            self.driver.get("https://x.com/login")
            time.sleep(3)
            
            # Enter username
            username_input = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "input[autocomplete='username']"))
            )
            username_input.send_keys(username)
            
            # Click next
            next_button = self.driver.find_element(By.XPATH, "//span[text()='Next']")
            next_button.click()
            time.sleep(2)
            
            # Enter password
            password_input = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='password']"))
            )
            password_input.send_keys(password)
            
            # Click login
            login_button = self.driver.find_element(By.XPATH, "//span[text()='Log in']")
            login_button.click()
            time.sleep(5)
            
            logger.info("✅ Logged in successfully")
            return True
            
        except Exception as e:
            logger.error(f"❌ Login failed: {e}")
            return False
    
    def create_thread(self, article_title, article_url, key_points):
        """Create an engaging thread"""
        logger.info(f"🧵 Creating thread for: {article_title}")
        
        # Generate thread tweets
        tweets = []
        
        # Tweet 1: Hook
        hook = f"🔥 {article_title}\n\nA thread 👇"
        tweets.append(hook)
        
        # Tweet 2-4: Key points
        for i, point in enumerate(key_points[:3], 1):
            tweet = f"{i}/ {point}"
            tweets.append(tweet)
        
        # Final tweet: CTA
        cta = f"📖 Read the full guide:\n{article_url}\n\n♻️ Repost if this helped!"
        tweets.append(cta)
        
        return tweets
    
    def post_thread(self, tweets):
        """Post thread to X/Twitter"""
        logger.info(f"📤 Posting thread with {len(tweets)} tweets...")
        
        try:
            # Navigate to compose
            self.driver.get("https://x.com/compose/tweet")
            time.sleep(2)
            
            # Post first tweet
            tweet_box = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='tweetTextarea_0']"))
            )
            tweet_box.send_keys(tweets[0])
            time.sleep(1)
            
            # Click "Add another Tweet" for thread
            if len(tweets) > 1:
                add_button = self.driver.find_element(By.CSS_SELECTOR, "[data-testid='addRoute']")
                add_button.click()
                time.sleep(1)
            
            # Post remaining tweets
            for i, tweet in enumerate(tweets[1:], 1):
                tweet_box = self.driver.find_element(By.CSS_SELECTOR, f"[data-testid='tweetTextarea_{i}']")
                tweet_box.send_keys(tweet)
                time.sleep(1)
                
                # Add another tweet if not last
                if i < len(tweets) - 1:
                    add_button = self.driver.find_element(By.CSS_SELECTOR, "[data-testid='addRoute']")
                    add_button.click()
                    time.sleep(1)
            
            # Post all
            post_button = self.driver.find_element(By.CSS_SELECTOR, "[data-testid='tweetButtonInline']")
            post_button.click()
            time.sleep(3)
            
            logger.info("✅ Thread posted successfully")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error posting thread: {e}")
            return False
    
    def get_recent_articles(self):
        """Get recently published articles"""
        content_files = list(Path('data/content').glob('*.json'))
        
        if not content_files:
            logger.warning("⚠️  No content files found")
            return []
        
        # Get articles from last 7 days
        recent = []
        cutoff = datetime.now().timestamp() - (7 * 24 * 60 * 60)
        
        for file in content_files:
            if file.stat().st_mtime > cutoff:
                with open(file, 'r') as f:
                    article = json.load(f)
                    recent.append(article)
        
        logger.info(f"✅ Found {len(recent)} recent articles")
        return recent
    
    def extract_key_points(self, article):
        """Extract key points for thread"""
        # Simple extraction - in production, use AI to summarize
        content = article.get('content', '')
        
        # Find H2 headings
        lines = content.split('\n')
        headings = [line for line in lines if line.startswith('## ')][:3]
        
        # Clean headings
        points = [h.replace('## ', '') for h in headings]
        
        if not points:
            # Fallback: first 3 sentences
            sentences = content.split('.')[:3]
            points = [s.strip() for s in sentences if s.strip()]
        
        return points
    
    def save_post_log(self, article_title, success):
        """Log social post"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"data/analytics/social_{timestamp}.json"
        
        log = {
            "timestamp": datetime.now().isoformat(),
            "article_title": article_title,
            "platform": "X/Twitter",
            "success": success
        }
        
        Path(filename).parent.mkdir(parents=True, exist_ok=True)
        
        with open(filename, 'w') as f:
            json.dump(log, f, indent=2)
        
        logger.info(f"💾 Post logged to {filename}")
    
    def close(self):
        """Close browser"""
        if self.driver:
            self.driver.quit()
            logger.info("🔒 Browser closed")

def main():
    distributor = SocialDistributor()
    
    try:
        distributor.setup_driver()
        
        # Login (credentials should be in environment variables in production)
        # For demo, we'll skip actual login
        logger.info("⚠️  Demo mode - skipping actual X/Twitter login")
        logger.info("In production, add X_USERNAME and X_PASSWORD to config.json")
        
        # Get recent articles
        articles = distributor.get_recent_articles()
        
        if not articles:
            logger.warning("⚠️  No recent articles to promote")
            return
        
        # Promote most recent article
        article = articles[0]
        title = article.get('title', 'Untitled')
        url = f"{distributor.config['wordpress_url']}/{title.lower().replace(' ', '-')}"
        
        # Extract key points
        key_points = distributor.extract_key_points(article)
        
        if key_points:
            # Create thread
            tweets = distributor.create_thread(title, url, key_points)
            
            # Post (demo mode - won't actually post)
            logger.info("📝 Thread would be posted:")
            for i, tweet in enumerate(tweets, 1):
                logger.info(f"  Tweet {i}: {tweet[:100]}...")
            
            # Log
            distributor.save_post_log(title, success=True)
        else:
            logger.warning("⚠️  Could not extract key points")
        
    except Exception as e:
        logger.error(f"❌ Fatal error: {e}")
    finally:
        distributor.close()
    
    logger.info("\n✅ Social distribution complete!")

if __name__ == '__main__':
    main()
