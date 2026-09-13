#!/usr/bin/env python3
"""
Ranking Monitor - Pulls GSC data and detects ranking changes
Uses DataForSEO API for keyword tracking
"""

import json
import logging
from datetime import datetime, timedelta
from pathlib import Path
import requests

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('RankingMonitor')

class RankingMonitor:
    def __init__(self, config_file='config.json'):
        with open(config_file, 'r') as f:
            self.config = json.load(f)
        
        self.dataforseo_login = self.config['dataforseo_login']
        self.dataforseo_password = self.config['dataforseo_password']
        self.site_url = self.config['wordpress_url']
        self.api_base = "https://api.dataforseo.com/v3"
        
    def get_auth_header(self):
        """Get DataForSEO auth header"""
        import base64
        credentials = f"{self.dataforseo_login}:{self.dataforseo_password}"
        encoded = base64.b64encode(credentials.encode()).decode()
        return {"Authorization": f"Basic {encoded}"}
    
    def get_gsc_data(self, days=7):
        """Get Google Search Console data via DataForSEO"""
        logger.info(f"📊 Pulling GSC data for last {days} days...")
        
        try:
            endpoint = f"{self.api_base}/dataforseo_labs/google_search_console"
            
            payload = {
                "site_url": self.site_url,
                "date_from": (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d"),
                "date_to": datetime.now().strftime("%Y-%m-%d"),
                "dimensions": ["page", "query"],
                "limit": 100
            }
            
            response = requests.post(
                endpoint,
                headers=self.get_auth_header(),
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                logger.info(f"✅ Retrieved {len(data.get('tasks', []))} GSC records")
                return data.get('tasks', [])
            else:
                logger.error(f"❌ GSC API error: {response.text}")
                return []
                
        except Exception as e:
            logger.error(f"❌ Error fetching GSC data: {e}")
            return []
    
    def get_keyword_rankings(self, keywords):
        """Get current rankings for keywords"""
        logger.info(f"🔍 Checking rankings for {len(keywords)} keywords...")
        
        try:
            endpoint = f"{self.api_base}/keywords_data/google organic/live_advanced"
            
            payload = {
                "keyword": keywords[0],  # DataForSEO processes one at a time
                "location_name": "United States",
                "language_name": "English",
                "depth": 100
            }
            
            rankings = []
            
            for keyword in keywords[:10]:  # Limit to 10 keywords
                payload["keyword"] = keyword
                
                response = requests.post(
                    endpoint,
                    headers=self.get_auth_header(),
                    json=payload,
                    timeout=30
                )
                
                if response.status_code == 200:
                    data = response.json()
                    tasks = data.get('tasks', [])
                    
                    if tasks and tasks[0].get('result'):
                        result = tasks[0]['result'][0]
                        
                        # Find our site in results
                        for item in result.get('items', []):
                            if self.site_url.replace('https://', '') in item.get('url', ''):
                                rankings.append({
                                    "keyword": keyword,
                                    "position": item.get('rank_absolute'),
                                    "url": item.get('url'),
                                    "title": item.get('title')
                                })
                                break
            
            logger.info(f"✅ Found rankings for {len(rankings)} keywords")
            return rankings
            
        except Exception as e:
            logger.error(f"❌ Error checking rankings: {e}")
            return []
    
    def detect_changes(self, current_rankings, historical_data):
        """Detect ranking changes"""
        logger.info("📈 Detecting ranking changes...")
        
        changes = []
        
        for current in current_rankings:
            keyword = current['keyword']
            current_pos = current['position']
            
            # Find historical position
            historical = next((h for h in historical_data if h['keyword'] == keyword), None)
            
            if historical:
                prev_pos = historical['position']
                change = prev_pos - current_pos  # Positive = improved
                
                if abs(change) >= 3:  # Significant change
                    changes.append({
                        "keyword": keyword,
                        "previous_position": prev_pos,
                        "current_position": current_pos,
                        "change": change,
                        "url": current['url'],
                        "status": "improved" if change > 0 else "dropped"
                    })
        
        logger.info(f"✅ Detected {len(changes)} significant changes")
        return changes
    
    def generate_recommendations(self, changes, gsc_data):
        """Generate optimization recommendations"""
        logger.info("💡 Generating recommendations...")
        
        recommendations = []
        
        # Pages that improved - boost them
        improved = [c for c in changes if c['status'] == 'improved']
        for page in improved:
            recommendations.append({
                "type": "boost",
                "keyword": page['keyword'],
                "url": page['url'],
                "action": f"Position improved from {page['previous_position']} to {page['current_position']}. Add internal links and update content to push higher."
            })
        
        # Pages that dropped - recover them
        dropped = [c for c in changes if c['status'] == 'dropped']
        for page in dropped:
            recommendations.append({
                "type": "recover",
                "keyword": page['keyword'],
                "url": page['url'],
                "action": f"Position dropped from {page['previous_position']} to {page['current_position']}. Audit content freshness, check for algorithm penalties, and rebuild backlinks."
            })
        
        # Pages on page 2 - optimize them
        for task in gsc_data:
            if task.get('position', 0) > 10 and task.get('position', 0) <= 20:
                recommendations.append({
                    "type": "page2_optimization",
                    "keyword": task.get('query'),
                    "url": task.get('page'),
                    "action": f"Ranking at position {task.get('position')}. Optimize on-page SEO, add semantic keywords, and build targeted backlinks."
                })
        
        logger.info(f"✅ Generated {len(recommendations)} recommendations")
        return recommendations
    
    def save_report(self, rankings, changes, recommendations):
        """Save monitoring report"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"data/analytics/rankings_{timestamp}.json"
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "rankings": rankings,
            "changes": changes,
            "recommendations": recommendations,
            "summary": {
                "total_keywords": len(rankings),
                "improved": len([c for c in changes if c['status'] == 'improved']),
                "dropped": len([c for c in changes if c['status'] == 'dropped']),
                "recommendations": len(recommendations)
            }
        }
        
        Path(filename).parent.mkdir(parents=True, exist_ok=True)
        
        with open(filename, 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info(f"💾 Report saved to {filename}")
        return filename

def main():
    monitor = RankingMonitor()
    
    # Get GSC data
    gsc_data = monitor.get_gsc_data(days=7)
    
    # Extract keywords from GSC
    keywords = list(set([task.get('query') for task in gsc_data if task.get('query')]))[:10]
    
    if not keywords:
        logger.warning("⚠️  No keywords found in GSC data")
        return
    
    # Get current rankings
    current_rankings = monitor.get_keyword_rankings(keywords)
    
    # Load historical data
    historical_files = list(Path('data/analytics').glob('rankings_*.json'))
    historical_data = []
    
    if historical_files:
        latest = max(historical_files, key=lambda p: p.stat().st_mtime)
        with open(latest, 'r') as f:
            old_report = json.load(f)
            historical_data = old_report.get('rankings', [])
    
    # Detect changes
    changes = monitor.detect_changes(current_rankings, historical_data)
    
    # Generate recommendations
    recommendations = monitor.generate_recommendations(changes, gsc_data)
    
    # Save report
    monitor.save_report(current_rankings, changes, recommendations)
    
    logger.info("\n✅ Ranking monitoring complete!")

if __name__ == '__main__':
    main()
