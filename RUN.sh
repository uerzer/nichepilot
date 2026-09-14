# ONE-LINER INSTALL & RUN
# Copy this entire block and paste into your terminal:

pip install undetected-chromedriver openai requests beautifulsoup4 schedule selenium && \
export OPENAI_API_KEY="sk-your-key-here" && \
export DATAFORSEO_LOGIN="your-login" && \
export DATAFORSEO_PASSWORD="your-password" && \
export WP_URL="https://yoursite.com" && \
export WP_TOKEN="your-wp-token" && \
python3 autopilot.py

# Or for continuous loop (every hour):
# python3 autopilot.py --loop 3600

# Or dry run (see what would happen):
# python3 autopilot.py --dry-run

# Or trends only:
# python3 autopilot.py --trends-only --niche "indoor plants"
