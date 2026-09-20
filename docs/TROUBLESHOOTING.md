# Troubleshooting Guide

## Common Issues & Solutions

This guide covers the most common problems you'll encounter when running NichePilot and how to fix them.

---

## Installation Issues

### Problem: `python3: command not found`

**Cause**: Python not installed or not in PATH

**Solution**:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip python3-venv

# macOS
brew install python

# Verify
python3 --version
```

### Problem: `pip: command not found`

**Cause**: pip not installed

**Solution**:
```bash
# Ubuntu/Debian
sudo apt install python3-pip

# macOS (included with Python)
brew install python

# Or use ensurepip
python3 -m ensurepip --upgrade
```

### Problem: Virtual environment creation fails

**Cause**: python3-venv not installed

**Solution**:
```bash
# Ubuntu/Debian
sudo apt install python3-venv

# Then create venv
python3 -m venv venv
source venv/bin/activate
```

### Problem: Package installation fails with "Permission denied"

**Cause**: Trying to install globally without sudo

**Solution**:
```bash
# Use virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# OR use --user flag
pip install --user -r requirements.txt
```

---

## Chrome/Chromium Issues

### Problem: `Message: unknown error: no chrome binary found`

**Cause**: Chrome not installed

**Solution**:
```bash
# Ubuntu/Debian
sudo apt install google-chrome-stable

# macOS
brew install --cask google-chrome

# Verify
google-chrome --version
```

### Problem: `Message: unknown error: Chrome failed to start: crashed`

**Cause**: Missing dependencies or running as root

**Solution**:
```bash
# Install dependencies
sudo apt install -y \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2

# If running as root, add --no-sandbox flag
# Edit scripts to add: options.add_argument('--no-sandbox')
```

### Problem: `Message: session not created: This version of ChromeDriver only supports Chrome version XX`

**Cause**: ChromeDriver version mismatch

**Solution**:
```bash
# undetected-chromedriver handles this automatically
# If still failing, update Chrome
sudo apt update && sudo apt upgrade google-chrome-stable

# Or specify Chrome path
export CHROME_BIN=/usr/bin/google-chrome
```

### Problem: Chrome opens but pages don't load

**Cause**: Network issues or DNS problems

**Solution**:
```bash
# Test network
ping google.com

# Check DNS
nslookup google.com

# Try different DNS
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
```

---

## API Issues

### Problem: `openai.error.AuthenticationError: Incorrect API key provided`

**Cause**: Invalid OpenAI API key

**Solution**:
1. Verify key at https://platform.openai.com/api-keys
2. Check for extra spaces or quotes
3. Ensure account has billing enabled
4. Try regenerating the key

```bash
# Test key
python3 -c "import openai; client = openai.OpenAI(api_key='sk-your-key'); print(client.models.list())"
```

### Problem: `openai.error.RateLimitError: You exceeded your current quota`

**Cause**: OpenAI usage limit reached

**Solution**:
1. Check usage at https://platform.openai.com/usage
2. Add billing if not enabled
3. Increase usage limits in account settings
4. Wait for quota reset (usually monthly)

### Problem: `DataForSEO: 401 Unauthorized`

**Cause**: Invalid DataForSEO credentials

**Solution**:
1. Verify login/password at https://app.dataforseo.com
2. Check account has credit
3. Ensure credentials are base64 encoded correctly

```bash
# Test credentials
curl -u "login:password" https://api.dataforseo.com/v3/tasks_get
```

### Problem: `WordPress: 401 Unauthorized`

**Cause**: Invalid WordPress token or permissions

**Solution**:
1. Regenerate Application Password in WordPress
2. Ensure user has "Author" or "Editor" role
3. Check REST API is enabled
4. Verify URL is correct (include https://)

```bash
# Test WordPress API
curl -u "username:application-password" https://yoursite.com/wp-json/wp/v2/posts
```

### Problem: `WordPress: 403 Forbidden`

**Cause**: REST API disabled or firewall blocking

**Solution**:
1. Check WordPress REST API is enabled
2. Disable security plugins temporarily
3. Check .htaccess for REST API blocks
4. Ensure permalink structure is not "Plain"

---

## Script Execution Issues

### Problem: `ModuleNotFoundError: No module named 'undetected_chromedriver'`

**Cause**: Package not installed or wrong Python environment

**Solution**:
```bash
# Activate virtual environment
source venv/bin/activate

# Install package
pip install undetected-chromedriver

# Verify installation
pip list | grep undetected
```

### Problem: `FileNotFoundError: [Errno 2] No such file or directory: 'config.json'`

**Cause**: config.json not in current directory

**Solution**:
```bash
# Copy example config
cp config.example.json config.json

# Or run from project root
cd /path/to/nichepilot
python3 scripts/trend_scraper.py
```

### Problem: Script hangs indefinitely

**Cause**: Network timeout or Chrome not responding

**Solution**:
```bash
# Kill hanging processes
pkill -f chrome
pkill -f chromedriver

# Add timeout to scripts
# In trend_scraper.py:
driver.set_page_load_timeout(30)

# Run with timeout command
timeout 300 python3 scripts/trend_scraper.py
```

### Problem: `JSONDecodeError: Expecting value: line 1 column 1`

**Cause**: API returned empty or invalid response

**Solution**:
1. Check API response manually
2. Verify API key has sufficient credits
3. Add error handling to parse response

```python
# Add to scripts:
try:
    data = response.json()
except json.JSONDecodeError:
    print(f"Invalid response: {response.text}")
    return None
```

---

## Data Issues

### Problem: No data in `data/trends/` directory

**Cause**: Trend scraper failed or didn't run

**Solution**:
```bash
# Check logs
tail -f logs/nichepilot.log

# Run manually
python3 scripts/trend_scraper.py

# Check for errors
ls -la data/trends/
```

### Problem: Generated articles are low quality

**Cause**: Poor prompt or GPT-4 not used

**Solution**:
1. Ensure using GPT-4 (not GPT-3.5)
2. Improve content brief quality
3. Add more specific instructions
4. Increase temperature slightly (0.7-0.8)

```python
# In content_generator.py:
response = client.chat.completions.create(
    model="gpt-4",  # Ensure GPT-4
    temperature=0.7,
    # ...
)
```

### Problem: WordPress posts not appearing

**Cause**: Posts created as drafts or wrong status

**Solution**:
1. Check WordPress admin → Posts
2. Verify post status (draft/publish)
3. Check user permissions
4. Review post content for errors

```python
# In content_generator.py:
data = {
    'status': 'publish',  # Change from 'draft' to 'publish'
    # ...
}
```

---

## Performance Issues

### Problem: Scripts run very slowly

**Cause**: Network latency or API rate limiting

**Solution**:
```bash
# Check network speed
curl -o /dev/null -s -w '%{time_total}\n' https://api.openai.com

# Add delays between requests
import time
time.sleep(2)  # 2 second delay

# Use connection pooling
import requests
session = requests.Session()
```

### Problem: High memory usage

**Cause**: Chrome instances not closing

**Solution**:
```bash
# Kill orphaned Chrome processes
pkill -f chrome
pkill -f chromedriver

# Ensure driver.quit() in finally blocks
try:
    driver = uc.Chrome()
    # ...
finally:
    if driver:
        driver.quit()
```

### Problem: Disk space running out

**Cause**: Logs and data accumulating

**Solution**:
```bash
# Check disk usage
du -sh data/ logs/

# Clean old files
find data/ -name "*.json" -mtime +30 -delete
find logs/ -name "*.log" -mtime +7 -delete

# Add to crontab
0 3 * * * find /path/to/nichepilot/data -name "*.json" -mtime +30 -delete
```

---

## Cron Job Issues

### Problem: Cron job not running

**Cause**: Cron service not running or misconfigured

**Solution**:
```bash
# Check cron service
sudo systemctl status cron

# Start cron
sudo systemctl start cron
sudo systemctl enable cron

# Check crontab
crontab -l

# Check cron logs
grep CRON /var/log/syslog
```

### Problem: Cron job runs but script fails

**Cause**: Environment variables not set in cron

**Solution**:
```bash
# Add to crontab
SHELL=/bin/bash
PATH=/usr/local/bin:/usr/bin:/bin
OPENAI_API_KEY=sk-your-key

# Or use wrapper script
#!/bin/bash
source /path/to/nichepilot/venv/bin/activate
export OPENAI_API_KEY="sk-your-key"
python3 /path/to/nichepilot/scripts/trend_scraper.py
```

### Problem: Multiple instances running

**Cause**: Previous job didn't finish

**Solution**:
```bash
# Use lock file
LOCKFILE=/tmp/nichepilot.lock
if [ -f "$LOCKFILE" ]; then
    exit 1
fi
touch "$LOCKFILE"
trap "rm -f $LOCKFILE" EXIT

# Or use flock
flock -n /tmp/nichepilot.lock python3 scripts/trend_scraper.py
```

---

## Security Issues

### Problem: API keys exposed in logs

**Cause**: Logging sensitive data

**Solution**:
```python
# Never log API keys
# Bad:
logger.info(f"Using key: {api_key}")

# Good:
logger.info("Using configured API key")
```

### Problem: WordPress token compromised

**Cause**: Token stored insecurely

**Solution**:
1. Revoke compromised token immediately
2. Generate new Application Password
3. Use environment variables (not config files)
4. Set file permissions: `chmod 600 config.json`

### Problem: Chrome profile contains sensitive data

**Cause**: Using persistent Chrome profile

**Solution**:
```python
# Use temporary profile
options.add_argument("--incognito")
options.add_argument("--user-data-dir=/tmp/chrome-temp")
```

---

## Getting Help

### Check Logs First
```bash
# Main log
tail -100 logs/nichepilot.log

# Specific script logs
tail -100 logs/cron_trends.log

# Error patterns
grep -i "error\|exception\|failed" logs/*.log | tail -20
```

### Debug Mode
```bash
# Enable debug logging
export LOG_LEVEL=DEBUG

# Run with verbose output
python3 -u scripts/trend_scraper.py 2>&1 | tee debug.log
```

### Test Individual Components
```bash
# Test Chrome
python3 -c "import undetected_chromedriver as uc; d = uc.Chrome(); d.get('https://google.com'); print('OK'); d.quit()"

# Test OpenAI
python3 -c "import openai; print(openai.OpenAI().models.list())"

# Test WordPress
curl -u "user:token" https://yoursite.com/wp-json/wp/v2/posts?per_page=1
```

### Common Debug Commands
```bash
# Check Python version
python3 --version

# Check installed packages
pip list

# Check Chrome version
google-chrome --version

# Check disk space
df -h

# Check memory
free -h

# Check running processes
ps aux | grep -E "chrome|python"
```

---

## Still Having Issues?

1. **Check the logs** - 90% of issues are logged
2. **Test components individually** - Isolate the problem
3. **Verify API keys** - Most common cause of failures
4. **Check Chrome** - Ensure it's installed and accessible
5. **Review recent changes** - What changed since it last worked?

If you're still stuck:
- Review the specific script's error messages
- Check the relevant API documentation
- Verify your system meets all requirements
- Try running on a different machine to isolate environment issues
