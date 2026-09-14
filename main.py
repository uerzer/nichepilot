#!/usr/bin/env python3
"""
NichePilot Master Orchestrator
Runs all automation loops and manages the autonomous SEO pipeline
"""

import json
import time
import logging
import argparse
import schedule
from datetime import datetime
from pathlib import Path
import subprocess
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/nichepilot.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('NichePilot')

class NichePilot:
    def __init__(self, config_file='config.json'):
        self.config = self.load_config(config_file)
        self.setup_directories()
        
    def load_config(self, config_file):
        """Load configuration from JSON file"""
        try:
            with open(config_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.error(f"Config file {config_file} not found!")
            logger.info("Copy config.example.json to config.json and fill in your API keys")
            sys.exit(1)
    
    def setup_directories(self):
        """Create necessary directories"""
        dirs = ['logs', 'data', 'data/trends', 'data/content', 'data/analytics']
        for d in dirs:
            Path(d).mkdir(parents=True, exist_ok=True)
    
    def run_trend_scraper(self):
        """Execute trend scraper"""
        logger.info("🔍 Running trend scraper...")
        try:
            result = subprocess.run(
                ['python3', 'scripts/trend_scraper.py'],
                capture_output=True,
                text=True,
                timeout=600
            )
            if result.returncode == 0:
                logger.info("✅ Trend scraper completed successfully")
                return True
            else:
                logger.error(f"❌ Trend scraper failed: {result.stderr}")
                return False
        except Exception as e:
            logger.error(f"❌ Trend scraper error: {e}")
            return False
    
    def run_serp_analyzer(self):
        """Execute SERP analyzer"""
        logger.info("📊 Running SERP analyzer...")
        try:
            result = subprocess.run(
                ['python3', 'scripts/serp_analyzer.py'],
                capture_output=True,
                text=True,
                timeout=600
            )
            if result.returncode == 0:
                logger.info("✅ SERP analyzer completed successfully")
                return True
            else:
                logger.error(f"❌ SERP analyzer failed: {result.stderr}")
                return False
        except Exception as e:
            logger.error(f"❌ SERP analyzer error: {e}")
            return False
    
    def run_content_generator(self):
        """Execute content generator"""
        logger.info("✍️  Running content generator...")
        try:
            result = subprocess.run(
                ['python3', 'scripts/content_generator.py'],
                capture_output=True,
                text=True,
                timeout=1800  # 30 min timeout for content generation
            )
            if result.returncode == 0:
                logger.info("✅ Content generator completed successfully")
                return True
            else:
                logger.error(f"❌ Content generator failed: {result.stderr}")
                return False
        except Exception as e:
            logger.error(f"❌ Content generator error: {e}")
            return False
    
    def run_ranking_monitor(self):
        """Execute ranking monitor"""
        logger.info("📈 Running ranking monitor...")
        try:
            result = subprocess.run(
                ['python3', 'scripts/ranking_monitor.py'],
                capture_output=True,
                text=True,
                timeout=300
            )
            if result.returncode == 0:
                logger.info("✅ Ranking monitor completed successfully")
                return True
            else:
                logger.error(f"❌ Ranking monitor failed: {result.stderr}")
                return False
        except Exception as e:
            logger.error(f"❌ Ranking monitor error: {e}")
            return False
    
    def run_social_distributor(self):
        """Execute social distributor"""
        logger.info("📢 Running social distributor...")
        try:
            result = subprocess.run(
                ['python3', 'scripts/social_distributor.py'],
                capture_output=True,
                text=True,
                timeout=600
            )
            if result.returncode == 0:
                logger.info("✅ Social distributor completed successfully")
                return True
            else:
                logger.error(f"❌ Social distributor failed: {result.stderr}")
                return False
        except Exception as e:
            logger.error(f"❌ Social distributor error: {e}")
            return False
    
    def run_daily_pipeline(self):
        """Run complete daily pipeline"""
        logger.info("=" * 60)
        logger.info("🚀 Starting Daily Pipeline")
        logger.info("=" * 60)
        
        # Morning: Research
        self.run_trend_scraper()
        self.run_serp_analyzer()
        
        # Midday: Content
        self.run_content_generator()
        
        # Afternoon: Monitor
        self.run_ranking_monitor()
        
        # Evening: Distribute
        self.run_social_distributor()
        
        logger.info("=" * 60)
        logger.info("✅ Daily Pipeline Complete")
        logger.info("=" * 60)
    
    def setup_cron_jobs(self):
        """Install cron jobs"""
        logger.info("📅 Setting up cron jobs...")
        
        cron_jobs = """
# NichePilot Automation
0 6 * * * cd /path/to/nichepilot && python3 main.py --task trends >> logs/cron.log 2>&1
0 8 * * * cd /path/to/nichepilot && python3 main.py --task serp >> logs/cron.log 2>&1
0 10 * * * cd /path/to/nichepilot && python3 main.py --task content >> logs/cron.log 2>&1
0 12,17,21 * * * cd /path/to/nichepilot && python3 main.py --task social >> logs/cron.log 2>&1
0 18 * * * cd /path/to/nichepilot && python3 main.py --task rankings >> logs/cron.log 2>&1
0 0 * * 0 cd /path/to/nichepilot && python3 main.py --task full >> logs/cron.log 2>&1
"""
        
        # Write cron file
        with open('cron_jobs.txt', 'w') as f:
            f.write(cron_jobs.strip())
        
        logger.info("✅ Cron jobs written to cron_jobs.txt")
        logger.info("Install with: crontab cron_jobs.txt")
    
    def start_autonomous(self):
        """Start autonomous mode with scheduled tasks"""
        logger.info("🤖 Starting autonomous mode...")
        
        # Schedule tasks
        schedule.every(6).hours.do(self.run_trend_scraper)
        schedule.every().day.at("08:00").do(self.run_serp_analyzer)
        schedule.every().day.at("10:00").do(self.run_content_generator)
        schedule.every().day.at("12:00").do(self.run_social_distributor)
        schedule.every().day.at("17:00").do(self.run_social_distributor)
        schedule.every().day.at("21:00").do(self.run_social_distributor)
        schedule.every().day.at("18:00").do(self.run_ranking_monitor)
        schedule.every().sunday.at("00:00").do(self.run_daily_pipeline)
        
        logger.info("✅ Scheduler configured. Running...")
        logger.info("Press Ctrl+C to stop")
        
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)
        except KeyboardInterrupt:
            logger.info("\n⏹️  Stopping autonomous mode...")
    
    def run_setup(self):
        """Run initial setup"""
        logger.info("🔧 Running initial setup...")
        
        # Test API connections
        logger.info("Testing API connections...")
        
        # Test OpenAI
        try:
            import openai
            client = openai.OpenAI(api_key=self.config['openai_api_key'])
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": "Hello"}],
                max_tokens=5
            )
            logger.info("✅ OpenAI API connected")
        except Exception as e:
            logger.error(f"❌ OpenAI API failed: {e}")
        
        # Test DataForSEO
        try:
            from dataforseo_client import DataForSEOClient
            client = DataForSEOClient(
                login=self.config['dataforseo_login'],
                password=self.config['dataforseo_password']
            )
            logger.info("✅ DataForSEO API connected")
        except Exception as e:
            logger.error(f"❌ DataForSEO API failed: {e}")
        
        logger.info("✅ Setup complete!")

def main():
    parser = argparse.ArgumentParser(description='NichePilot Autonomous SEO Operations')
    parser.add_argument('--setup', action='store_true', help='Run initial setup')
    parser.add_argument('--start', action='store_true', help='Start autonomous mode')
    parser.add_argument('--cron', action='store_true', help='Setup cron jobs')
    parser.add_argument('--task', choices=['trends', 'serp', 'content', 'rankings', 'social', 'full'],
                       help='Run specific task')
    
    args = parser.parse_args()
    
    pilot = NichePilot()
    
    if args.setup:
        pilot.run_setup()
    elif args.start:
        pilot.start_autonomous()
    elif args.cron:
        pilot.setup_cron_jobs()
    elif args.task:
        task_map = {
            'trends': pilot.run_trend_scraper,
            'serp': pilot.run_serp_analyzer,
            'content': pilot.run_content_generator,
            'rankings': pilot.run_ranking_monitor,
            'social': pilot.run_social_distributor,
            'full': pilot.run_daily_pipeline
        }
        task_map[args.task]()
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
