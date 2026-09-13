#!/usr/bin/env python3
"""
Directory Builder - Auto-generates niche directory pages
Uses DirectoryFast MCP for schema and taxonomy generation
"""

import json
import logging
from datetime import datetime
from pathlib import Path
import subprocess
import requests

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('DirectoryBuilder')

class DirectoryBuilder:
    def __init__(self, config_file='config.json'):
        with open(config_file, 'r') as f:
            self.config = json.load(f)
        
        self.wp_url = self.config['wordpress_url']
        self.wp_token = self.config['wordpress_token']
        self.niche = self.config.get('niche', 'resin art')
        
    def generate_directory_structure(self):
        """Generate directory structure using DirectoryFast MCP"""
        logger.info(f"📁 Generating directory structure for: {self.niche}")
        
        try:
            # Use DirectoryFast MCP
            result = subprocess.run(
                ['npx', 'skills', 'run', 'directoryfast/mcp', 'generate-directory',
                 '--niche', self.niche,
                 '--categories', 'Tools,Materials,Techniques,Projects,Tutorials',
                 '--items-per-category', '10',
                 '--schema', 'ItemList,Product',
                 '--internal-links', 'true'],
                capture_output=True,
                text=True,
                timeout=120
            )
            
            if result.returncode == 0:
                directory = json.loads(result.stdout)
                logger.info("✅ Directory structure generated via DirectoryFast")
                return directory
            else:
                logger.warning("⚠️  DirectoryFast failed, using fallback")
                return self.fallback_directory()
                
        except Exception as e:
            logger.warning(f"⚠️  Error using DirectoryFast: {e}")
            return self.fallback_directory()
    
    def fallback_directory(self):
        """Fallback directory generation"""
        categories = {
            "Tools": [
                {"name": "Heat Gun", "description": "Essential for removing bubbles", "affiliate_link": "#"},
                {"name": "Silicone Mats", "description": "Non-stick work surface", "affiliate_link": "#"},
                {"name": "Mixing Cups", "description": "Accurate measurement", "affiliate_link": "#"},
                {"name": "Resin Mold Set", "description": "Various shapes and sizes", "affiliate_link": "#"},
                {"name": "Digital Scale", "description": "Precise resin ratios", "affiliate_link": "#"},
            ],
            "Materials": [
                {"name": "Epoxy Resin", "description": "Clear, two-part resin", "affiliate_link": "#"},
                {"name": "Resin Pigments", "description": "Liquid and powder colors", "affiliate_link": "#"},
                {"name": "Glitter", "description": "Fine and chunky varieties", "affiliate_link": "#"},
                {"name": "Dried Flowers", "description": "Preserved botanicals", "affiliate_link": "#"},
                {"name": "UV Resin", "description": "Quick-cure small projects", "affiliate_link": "#"},
            ],
            "Techniques": [
                {"name": "Ocean Art", "description": "Wave and sea effects", "affiliate_link": "#"},
                {"name": "Geode Art", "description": "Crystal-like formations", "affiliate_link": "#"},
                {"name": "Petal Pour", "description": "Flower petal effects", "affiliate_link": "#"},
                {"name": "Dirty Pour", "description": "Marbled patterns", "affiliate_link": "#"},
                {"name": "Swipe Technique", "description": "Linear color blends", "affiliate_link": "#"},
            ],
            "Projects": [
                {"name": "Resin Coasters", "description": "Beginner-friendly project", "affiliate_link": "#"},
                {"name": "River Table", "description": "Advanced furniture piece", "affiliate_link": "#"},
                {"name": "Jewelry Making", "description": "Earrings and pendants", "affiliate_link": "#"},
                {"name": "Wall Art", "description": "Large decorative pieces", "affiliate_link": "#"},
                {"name": "Keychains", "description": "Quick gift ideas", "affiliate_link": "#"},
            ],
            "Tutorials": [
                {"name": "Getting Started Guide", "description": "Complete beginner tutorial", "affiliate_link": "#"},
                {"name": "Bubble Removal", "description": "Fix common mistakes", "affiliate_link": "#"},
                {"name": "Color Mixing", "description": "Create custom colors", "affiliate_link": "#"},
                {"name": "Mold Preparation", "description": "Prevent sticking", "affiliate_link": "#"},
                {"name": "Safety Guide", "description": "Work safely with resin", "affiliate_link": "#"},
            ]
        }
        
        return {
            "niche": self.niche,
            "categories": categories,
            "total_items": sum(len(items) for items in categories.values())
        }
    
    def generate_category_page(self, category_name, items):
        """Generate category page content"""
        items_html = ""
        
        for item in items:
            items_html += f"""
            <div class="directory-item">
                <h3>{item['name']}</h3>
                <p>{item['description']}</p>
                <a href="{item['affiliate_link']}" class="btn">View Details</a>
            </div>
            """
        
        content = f"""
        <h1>Best {category_name} for {self.niche.title()}</h1>
        <p>Complete directory of {category_name.lower()} for {self.niche} enthusiasts.</p>
        
        <div class="directory-grid">
            {items_html}
        </div>
        
        <h2>Related Categories</h2>
        <ul>
            <li><a href="/directory/tools">Tools</a></li>
            <li><a href="/directory/materials">Materials</a></li>
            <li><a href="/directory/techniques">Techniques</a></li>
        </ul>
        """
        
        return content
    
    def publish_directory_pages(self, directory):
        """Publish all directory pages to WordPress"""
        logger.info("📤 Publishing directory pages...")
        
        published = []
        
        # Publish main directory page
        main_content = f"""
        <h1>{self.niche.title()} Directory</h1>
        <p>Complete resource directory for {self.niche}.</p>
        
        <h2>Categories</h2>
        <ul>
        """
        
        for category in directory['categories'].keys():
            slug = category.lower().replace(' ', '-')
            main_content += f'<li><a href="/directory/{slug}">{category}</a></li>\n'
        
        main_content += "</ul>"
        
        main_page = self.publish_page(
            title=f"{self.niche.title()} Directory",
            content=main_content,
            slug="directory"
        )
        
        if main_page:
            published.append(main_page)
        
        # Publish category pages
        for category_name, items in directory['categories'].items():
            content = self.generate_category_page(category_name, items)
            slug = f"directory/{category_name.lower().replace(' ', '-')}"
            
            page = self.publish_page(
                title=f"Best {category_name} - {self.niche.title()}",
                content=content,
                slug=slug
            )
            
            if page:
                published.append(page)
        
        logger.info(f"✅ Published {len(published)} directory pages")
        return published
    
    def publish_page(self, title, content, slug):
        """Publish a single page to WordPress"""
        try:
            headers = {
                'Authorization': f'Bearer {self.wp_token}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'title': title,
                'content': content,
                'status': 'publish',
                'slug': slug
            }
            
            response = requests.post(
                f'{self.wp_url}/wp-json/wp/v2/pages',
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 201:
                page_id = response.json()['id']
                logger.info(f"✅ Published: {title} (ID: {page_id})")
                return page_id
            else:
                logger.error(f"❌ WordPress error: {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error publishing page: {e}")
            return None
    
    def generate_schema_markup(self, directory):
        """Generate schema markup for directory"""
        schema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": f"{self.niche.title()} Directory",
            "itemListElement": []
        }
        
        position = 1
        for category_name, items in directory['categories'].items():
            for item in items:
                schema["itemListElement"].append({
                    "@type": "ListItem",
                    "position": position,
                    "name": item['name'],
                    "description": item['description']
                })
                position += 1
        
        return json.dumps(schema, indent=2)
    
    def save_directory(self, directory):
        """Save directory data locally"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"data/content/directory_{self.niche.replace(' ', '_')}_{timestamp}.json"
        
        Path(filename).parent.mkdir(parents=True, exist_ok=True)
        
        with open(filename, 'w') as f:
            json.dump(directory, f, indent=2)
        
        logger.info(f"💾 Directory saved to {filename}")
        return filename

def main():
    builder = DirectoryBuilder()
    
    # Generate directory structure
    directory = builder.generate_directory_structure()
    
    # Save locally
    builder.save_directory(directory)
    
    # Publish to WordPress
    published = builder.publish_directory_pages(directory)
    
    # Generate schema
    schema = builder.generate_schema_markup(directory)
    logger.info(f"📊 Schema markup generated ({len(schema)} characters)")
    
    logger.info(f"\n✅ Directory builder complete! Published {len(published)} pages")

if __name__ == '__main__':
    main()
