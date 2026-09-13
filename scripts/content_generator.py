#!/usr/bin/env python3
"""
Content Generator - Generates SEO-optimized articles using OpenAI
Integrates with marketingskills for structured workflows
"""

import json
import logging
from datetime import datetime
from pathlib import Path
import subprocess
import openai
import requests

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('ContentGenerator')

class ContentGenerator:
    def __init__(self, config_file='config.json'):
        with open(config_file, 'r') as f:
            self.config = json.load(f)
        
        self.client = openai.OpenAI(api_key=self.config['openai_api_key'])
        self.wp_url = self.config['wordpress_url']
        self.wp_token = self.config['wordpress_token']
        
    def generate_content_brief(self, keyword, competitor_data=None):
        """Generate content brief using marketingskills"""
        logger.info(f"📋 Generating brief for: {keyword}")
        
        try:
            # Use marketingskills CLI
            result = subprocess.run(
                ['npx', 'skills', 'run', 'coreyhaines31/marketingskills', 'content-brief',
                 '--keyword', keyword,
                 '--competitors', '5',
                 '--semantic-keywords', 'true'],
                capture_output=True,
                text=True,
                timeout=120
            )
            
            if result.returncode == 0:
                brief = json.loads(result.stdout)
                logger.info("✅ Brief generated via marketingskills")
                return brief
            else:
                logger.warning("⚠️  marketingskills failed, using fallback")
                return self.fallback_brief(keyword)
                
        except Exception as e:
            logger.warning(f"⚠️  Error using marketingskills: {e}")
            return self.fallback_brief(keyword)
    
    def fallback_brief(self, keyword):
        """Fallback brief generation using OpenAI"""
        prompt = f"""Create a detailed content brief for the keyword: "{keyword}"

Include:
1. Target audience
2. Search intent (informational/transactional/navigational)
3. 5-7 semantic keywords to include
4. Suggested H2 and H3 headings
5. Word count recommendation (2000-3000)
6. Schema markup suggestions (FAQ, HowTo, etc.)
7. Internal linking opportunities

Return as JSON with keys: audience, intent, semantic_keywords, headings, word_count, schema, internal_links"""

        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
    
    def generate_article(self, brief, keyword):
        """Generate full article from brief"""
        logger.info(f"✍️  Generating article for: {keyword}")
        
        headings_text = "\n".join([f"- {h}" for h in brief.get('headings', [])])
        semantic_text = ", ".join(brief.get('semantic_keywords', []))
        
        prompt = f"""Write a comprehensive, SEO-optimized article for the keyword: "{keyword}"

Brief:
- Target audience: {brief.get('audience', 'beginners')}
- Search intent: {brief.get('intent', 'informational')}
- Word count: {brief.get('word_count', 2500)} words
- Semantic keywords to include: {semantic_text}

Structure:
{headings_text}

Requirements:
1. Engaging introduction with hook (first 100 words)
2. Clear, scannable content with short paragraphs
3. Include practical examples and actionable tips
4. Add FAQ section at the end (3-5 questions)
5. Include schema markup suggestions in comments
6. Write in beginner-friendly tone (Flesch score > 60)
7. No fluff or filler content
8. Include internal linking placeholders like [INTERNAL_LINK: topic]

Return as JSON with keys: title, meta_description, content (markdown), faq (array of Q&A objects)"""

        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=4000
        )
        
        article = json.loads(response.choices[0].message.content)
        logger.info(f"✅ Article generated: {len(article['content'])} characters")
        return article
    
    def publish_to_wordpress(self, article, keyword, status='draft'):
        """Publish article to WordPress"""
        logger.info(f"📤 Publishing to WordPress: {article['title']}")
        
        try:
            # Prepare content
            content = article['content']
            
            # Add schema markup
            if 'FAQ' in article.get('schema', []):
                schema_json = self.generate_faq_schema(article['faq'])
                content += f"\n\n<!-- Schema: {schema_json} -->"
            
            # WordPress API request
            headers = {
                'Authorization': f'Bearer {self.wp_token}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'title': article['title'],
                'content': content,
                'status': status,
                'excerpt': article['meta_description'],
                'categories': [1],  # Default category
                'meta': {
                    'rank_math_focus_keyword': keyword,
                    'rank_math_description': article['meta_description']
                }
            }
            
            response = requests.post(
                f'{self.wp_url}/wp-json/wp/v2/posts',
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 201:
                post_id = response.json()['id']
                logger.info(f"✅ Published! Post ID: {post_id}")
                return post_id
            else:
                logger.error(f"❌ WordPress error: {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error publishing: {e}")
            return None
    
    def generate_faq_schema(self, faq_items):
        """Generate FAQ schema markup"""
        schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": []
        }
        
        for item in faq_items:
            schema["mainEntity"].append({
                "@type": "Question",
                "name": item['question'],
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item['answer']
                }
            })
        
        return json.dumps(schema)
    
    def save_locally(self, article, keyword):
        """Save article locally as backup"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"data/content/{keyword.replace(' ', '_')}_{timestamp}.json"
        
        Path(filename).parent.mkdir(parents=True, exist_ok=True)
        
        with open(filename, 'w') as f:
            json.dump(article, f, indent=2)
        
        logger.info(f"💾 Saved locally: {filename}")
        return filename

def main():
    generator = ContentGenerator()
    
    # Load keywords from SERP analysis
    serp_files = list(Path('data/analytics').glob('serp_*.json'))
    if not serp_files:
        logger.error("❌ No SERP data found. Run serp_analyzer.py first.")
        return
    
    # Get top 2 opportunities
    opportunities = []
    for serp_file in serp_files[-5:]:  # Check last 5
        with open(serp_file, 'r') as f:
            data = json.load(f)
            if data['opportunity_score'] > 60:
                opportunities.append(data)
    
    opportunities.sort(key=lambda x: x['opportunity_score'], reverse=True)
    top_opportunities = opportunities[:2]
    
    if not top_opportunities:
        logger.warning("⚠️  No high-opportunity keywords found")
        return
    
    # Generate content for each opportunity
    for opp in top_opportunities:
        keyword = opp['keyword']
        logger.info(f"\n{'='*60}")
        logger.info(f"Processing: {keyword} (Score: {opp['opportunity_score']})")
        logger.info(f"{'='*60}")
        
        try:
            # Generate brief
            brief = generator.generate_content_brief(keyword)
            
            # Generate article
            article = generator.generate_article(brief, keyword)
            
            # Save locally
            generator.save_locally(article, keyword)
            
            # Publish to WordPress (draft)
            post_id = generator.publish_to_wordpress(article, keyword, status='draft')
            
            if post_id:
                logger.info(f"✅ Complete! Post {post_id} created")
            
        except Exception as e:
            logger.error(f"❌ Error processing {keyword}: {e}")
    
    logger.info("\n✅ Content generation complete!")

if __name__ == '__main__':
    main()
