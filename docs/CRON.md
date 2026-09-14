# Cron Jobs & Automation

## Overview

NichePilot can run automatically using cron jobs (Linux/macOS) or Task Scheduler (Windows). This allows the pipeline to execute without manual intervention.

## Cron Job Basics

Cron is a time-based job scheduler in Unix-like operating systems. It runs commands at specified intervals.

### Cron Syntax
```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday=0)
│ │ │ │ │
* * * * * command_to_run
```

### Examples
```bash
# Every day at 6am
0 6 * * * /path/to/command

# Every 6 hours
0 */6 * * * /path/to/command

# Every Monday at 9am
0 9 * * 1 /path/to/command

# First day of every month at midnight
0 0 1 * * /path/to/command
```

## NichePilot Cron Configuration

### Recommended Schedule

```bash
# Edit your crontab
crontab -e

# Add these lines (adjust paths):

# Trend Scraper - Every 6 hours
0 */6 * * * cd /path/to/nichepilot && source venv/bin/activate && python3 scripts/trend_scraper.py >> logs/cron_trends.log 2>&1

# SERP Analyzer - Daily at 8am
0 8 * * * cd /path/to/nichepilot && source venv/bin/activate && python3 scripts/serp_analyzer.py >> logs/cron_serp.log 2>&1

# Content Generator - Daily at 10am
0 10 * * * cd /path/to/nichepilot && source venv/bin/activate && python3 scripts/content_generator.py >> logs/cron_content.log 2>&1

# Social Distributor - 3x daily (12pm, 5pm, 9pm)
0 12,17,21 * * * cd /path/to/nichepilot && source venv/bin/activate && python3 scripts/social_distributor.py >> logs/cron_social.log 2>&1

# Ranking Monitor - Daily at 6pm
0 18 * * * cd /path/to/nichepilot && source venv/bin/activate && python3 scripts/ranking_monitor.py >> logs/cron_rankings.log 2>&1

# Directory Builder - Weekly on Sunday at midnight
0 0 * * 0 cd /path/to/nichepilot && source venv/bin/activate && python3 scripts/directory_builder.py >> logs/cron_directory.log 2>&1

# Full Pipeline - Weekly on Saturday at 2am (backup)
0 2 * * 6 cd /path/to/nichepilot && bash run_all.sh >> logs/cron_full.log 2>&1

# Log Rotation - Daily at 3am (keep last 30 days)
0 3 * * * find /path/to/nichepilot/logs -name "*.log" -mtime +30 -delete
```

### Using the Provided Cron File

```bash
# 1. Edit cron_jobs.txt with your path
nano cron_jobs.txt

# Replace /path/to/nichepilot with actual path
# Example: /home/user/nichepilot

# 2. Install cron jobs
crontab cron_jobs.txt

# 3. Verify installation
crontab -l
```

## Environment Variables in Cron

Cron jobs run in a minimal environment. You need to explicitly set environment variables.

### Option 1: In Crontab
```bash
# Add at top of crontab
OPENAI_API_KEY=sk-your-key
DATAFORSEO_LOGIN=your-login
DATAFORSEO_PASSWORD=your-password
WP_URL=https://yoursite.com
WP_TOKEN=your-token

# Then your cron jobs
0 10 * * * cd /path/to/nichepilot && python3 scripts/content_generator.py >> logs/cron.log 2>&1
```

### Option 2: Wrapper Script
Create `run_with_env.sh`:
```bash
#!/bin/bash
export OPENAI_API_KEY="sk-your-key"
export DATAFORSEO_LOGIN="your-login"
export DATAFORSEO_PASSWORD="your-password"
export WP_URL="https://yoursite.com"
export WP_TOKEN="your-token"

cd /path/to/nichepilot
source venv/bin/activate
python3 "$@"
```

Then in crontab:
```bash
0 10 * * * /path/to/nichepilot/run_with_env.sh scripts/content_generator.py >> logs/cron.log 2>&1
```

### Option 3: Config File
Use `config.json` instead of environment variables:
```json
{
  "openai_api_key": "sk-your-key",
  "dataforseo_login": "your-login",
  "dataforseo_password": "your-password",
  "wordpress_url": "https://yoursite.com",
  "wordpress_token": "your-token"
}
```

Scripts will automatically load from `config.json` if environment variables are not set.

## Alternative: Systemd Service (Linux)

For more robust automation, use systemd:

### Create Service File
```bash
sudo nano /etc/systemd/system/nichepilot.service
```

```ini
[Unit]
Description=NichePilot Autonomous SEO Pipeline
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/nichepilot
Environment="OPENAI_API_KEY=sk-your-key"
Environment="DATAFORSEO_LOGIN=your-login"
Environment="DATAFORSEO_PASSWORD=your-password"
ExecStart=/path/to/nichepilot/venv/bin/python3 main.py --start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Enable and Start
```bash
sudo systemctl daemon-reload
sudo systemctl enable nichepilot
sudo systemctl start nichepilot

# Check status
sudo systemctl status nichepilot

# View logs
sudo journalctl -u nichepilot -f
```

## Alternative: Python Scheduler

Run continuously with built-in scheduler:

```bash
# Run forever (restarts on failure)
python3 main.py --start

# Or use run_loop.sh
./run_loop.sh 3600  # Every hour
```

### Create Systemd Service for Continuous Mode
```bash
sudo nano /etc/systemd/system/nichepilot-loop.service
```

```ini
[Unit]
Description=NichePilot Loop Runner
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/nichepilot
Environment="OPENAI_API_KEY=sk-your-key"
ExecStart=/path/to/nichepilot/venv/bin/python3 main.py --start
Restart=always
RestartSec=30

[Install]
WantedBy=multi-user.target
```

## Windows Task Scheduler

### Setup Steps
1. Open Task Scheduler
2. Click "Create Basic Task"
3. Name: "NichePilot Trend Scraper"
4. Trigger: Daily at 6:00 AM
5. Action: Start a program
6. Program: `C:\Python310\python.exe`
7. Arguments: `C:\path\to\nichepilot\scripts\trend_scraper.py`
8. Start in: `C:\path\to\nichepilot`

### Set Environment Variables
In Task Scheduler:
1. Edit the task
2. Actions tab → Edit
3. Add environment variables in "Start in" field or use a batch file

### Batch File Wrapper
Create `run_trends.bat`:
```batch
@echo off
set OPENAI_API_KEY=sk-your-key
set DATAFORSEO_LOGIN=your-login
set DATAFORSEO_PASSWORD=your-password
cd C:\path\to\nichepilot
C:\Python310\python.exe scripts\trend_scraper.py >> logs\cron_trends.log 2>&1
```

Then point Task Scheduler to this batch file.

## Docker Automation

### Dockerfile
```dockerfile
FROM python:3.11-slim

# Install Chrome
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    chromium \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

RUN pip install -r requirements.txt

CMD ["python3", "main.py", "--start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  nichepilot:
    build: .
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - DATAFORSEO_LOGIN=${DATAFORSEO_LOGIN}
      - DATAFORSEO_PASSWORD=${DATAFORSEO_PASSWORD}
      - WP_URL=${WP_URL}
      - WP_TOKEN=${WP_TOKEN}
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    restart: unless-stopped
```

### Run with Docker
```bash
# Build
docker-compose build

# Run
docker-compose up -d

# View logs
docker-compose logs -f
```

## Monitoring Cron Jobs

### Check Cron Logs
```bash
# Linux
grep CRON /var/log/syslog

# Or
tail -f /var/log/cron
```

### Check NichePilot Logs
```bash
# Main log
tail -f logs/nichepilot.log

# Specific job logs
tail -f logs/cron_trends.log
tail -f logs/cron_content.log
```

### Verify Cron is Running
```bash
# List cron jobs
crontab -l

# Check cron service
sudo systemctl status cron

# Test cron manually
run-one cron job
```

## Troubleshooting Cron Issues

### Job Not Running
```bash
# Check cron is running
sudo systemctl status cron

# Check permissions
ls -la /path/to/nichepilot/scripts/*.py

# Check paths in crontab
crontab -l

# Test command manually
cd /path/to/nichepilot && source venv/bin/activate && python3 scripts/trend_scraper.py
```

### Environment Variables Not Loading
```bash
# Add to crontab
SHELL=/bin/bash
PATH=/usr/local/bin:/usr/bin:/bin

# Or use absolute paths
0 10 * * * /path/to/nichepilot/venv/bin/python3 /path/to/nichepilot/scripts/content_generator.py
```

### Permission Denied
```bash
# Make scripts executable
chmod +x scripts/*.py
chmod +x *.sh

# Check file ownership
ls -la scripts/
```

### Chrome Not Found
```bash
# Set Chrome path in script
export CHROME_BIN=/usr/bin/google-chrome

# Or in crontab
CHROME_BIN=/usr/bin/google-chrome
```

## Best Practices

### 1. Stagger Jobs
Don't run all jobs at the same time:
```bash
# Good - staggered
0 6 * * * trend_scraper
0 8 * * * serp_analyzer
0 10 * * * content_generator

# Bad - all at once
0 6 * * * trend_scraper
0 6 * * * serp_analyzer
0 6 * * * content_generator
```

### 2. Use Lock Files
Prevent overlapping runs:
```bash
#!/bin/bash
LOCKFILE=/tmp/nichepilot.lock

if [ -f "$LOCKFILE" ]; then
    echo "Already running"
    exit 1
fi

touch "$LOCKFILE"
trap "rm -f $LOCKFILE" EXIT

python3 scripts/trend_scraper.py
```

### 3. Rotate Logs
```bash
# In crontab
0 3 * * * find /path/to/nichepilot/logs -name "*.log" -mtime +30 -delete
```

### 4. Monitor Failures
```bash
# Check for errors in logs
grep -i "error\|failed\|exception" logs/*.log | tail -20
```

### 5. Backup Data
```bash
# Daily backup
0 4 * * * tar -czf /backup/nichepilot_$(date +\%Y\%m\%d).tar.gz /path/to/nichepilot/data/
```

## Advanced: Distributed Execution

For high-volume operations, run different scripts on different machines:

```bash
# Machine 1: Trend scraping
0 */6 * * * python3 scripts/trend_scraper.py

# Machine 2: Content generation
0 10 * * * python3 scripts/content_generator.py

# Machine 3: Social distribution
0 12,17,21 * * * python3 scripts/social_distributor.py
```

Share data via:
- NFS/SMB mount
- S3 bucket
- Database
- API

## Next Steps

After setting up cron:
1. Monitor logs for first 24 hours
2. Verify all jobs run successfully
3. Check output in `data/` directory
4. Adjust schedule based on API costs
5. Set up alerts for failures
