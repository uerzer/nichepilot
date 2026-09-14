# API Keys Guide

## Required API Keys

NichePilot requires several API keys to function. This guide explains how to obtain and configure each one.

## 1. OpenAI API Key

**Purpose**: Content generation using GPT-4

**Cost**: ~$0.03-0.06 per article (GPT-4)

### How to Get It
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys: https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Name it "NichePilot"
6. Copy the key (starts with `sk-`)

### Configuration
```bash
# Environment variable (recommended)
export OPENAI_API_KEY="sk-your-key-here"

# OR in config.json
{
  "openai_api_key": "sk-your-key-here"
}
```

### Usage Limits
- Start with $5-10 credit
- Monitor usage at https://platform.openai.com/usage
- Set usage limits to avoid surprise charges

### Cost Optimization
- Use GPT-3.5-turbo for drafts ($0.002/article)
- Use GPT-4 only for final polish
- Cache generated content to avoid regeneration

---

## 2. DataForSEO API

**Purpose**: SEO metrics, keyword data, SERP analysis

**Cost**: Pay-as-you-go, ~$0.001-0.01 per request

### How to Get It
1. Go to https://dataforseo.com/
2. Click "Sign Up"
3. Verify email
4. Add credit (minimum $1)
5. Get credentials from Dashboard → API Settings

### Configuration
```bash
# Environment variables (recommended)
export DATAFORSEO_LOGIN="your-login"
export DATAFORSEO_PASSWORD="your-password"

# OR in config.json
{
  "dataforseo_login": "your-login",
  "dataforseo_password": "your-password"
}
```

### Usage Tracking
- Dashboard: https://app.dataforseo.com/
- Monitor API calls and costs
- Set up billing alerts

### Cost Optimization
- Use live SERP only when needed
- Cache keyword data for 24h
- Batch requests when possible

---

## 3. WordPress REST API Token

**Purpose**: Publish articles to your WordPress site

**Cost**: Free (self-hosted WordPress)

### How to Get It
1. Log in to WordPress Admin
2. Go to Users → Your Profile
3. Scroll to "Application Passwords"
4. Enter name: "NichePilot"
5. Click "Add New Application Password"
6. Copy the generated password (format: `xxxx xxxx xxxx xxxx`)

### Configuration
```bash
# Environment variables (recommended)
export WP_URL="https://yoursite.com"
export WP_TOKEN="xxxx xxxx xxxx xxxx"

# OR in config.json
{
  "wordpress_url": "https://yoursite.com",
  "wordpress_token": "xxxx xxxx xxxx xxxx"
}
```

### Security Notes
- Application passwords can be revoked anytime
- Store securely (not in git)
- Use HTTPS only
- Limit user permissions to "Author" role

### WordPress Requirements
- WordPress 5.6+ (for Application Passwords)
- REST API enabled (default)
- SSL certificate (HTTPS)
- Permalinks enabled (not plain)

---

## 4. X/Twitter Credentials (Optional)

**Purpose**: Social media distribution

**Cost**: Free

### How to Get It
Use your regular X/Twitter account credentials.

### Configuration
```bash
# Environment variables (recommended)
export X_USERNAME="your-username"
export X_PASSWORD="your-password"

# OR in config.json
{
  "x_username": "your-username",
  "x_password": "your-password"
}
```

### Security Notes
- Consider creating a separate account for automation
- Enable 2FA on your account
- Monitor for suspicious activity
- X may rate-limit or block automated posting

### Rate Limits
- X allows ~300 tweets per 3 hours
- NichePilot posts 3x daily (well within limits)
- Add delays between posts if needed

---

## 5. Google Search Console (Optional)

**Purpose**: Monitor your site's search performance

**Cost**: Free

### How to Set Up
1. Go to https://search.google.com/search-console
2. Add your property (website URL)
3. Verify ownership (DNS, HTML file, or meta tag)
4. Wait 24-48h for data to populate

### Configuration
```json
{
  "google_search_console": {
    "credentials_file": "gsc-credentials.json",
    "site_url": "https://yoursite.com"
  }
}
```

### Service Account Setup
For automated access:
1. Go to Google Cloud Console
2. Create a service account
3. Download JSON credentials
4. Add service account as user in Search Console

---

## Environment Variables Setup

### Linux/macOS (`.bashrc` or `.zshrc`)
```bash
export OPENAI_API_KEY="sk-your-key"
export DATAFORSEO_LOGIN="your-login"
export DATAFORSEO_PASSWORD="your-password"
export WP_URL="https://yoursite.com"
export WP_TOKEN="your-token"
export X_USERNAME="your-username"
export X_PASSWORD="your-password"
```

### Windows (System Environment Variables)
1. Search "Environment Variables" in Start menu
2. Click "Edit the system environment variables"
3. Click "Environment Variables" button
4. Add each key under "User variables"

### Docker (`.env` file)
```env
OPENAI_API_KEY=sk-your-key
DATAFORSEO_LOGIN=your-login
DATAFORSEO_PASSWORD=your-password
WP_URL=https://yoursite.com
WP_TOKEN=your-token
```

---

## Testing API Connections

### Test Script
```bash
python3 -c "
import openai
import requests
import base64

# Test OpenAI
try:
    client = openai.OpenAI()
    models = client.models.list()
    print('✅ OpenAI: Connected')
except Exception as e:
    print(f'❌ OpenAI: {e}')

# Test DataForSEO
try:
    import os
    login = os.environ.get('DATAFORSEO_LOGIN')
    password = os.environ.get('DATAFORSEO_PASSWORD')
    creds = base64.b64encode(f'{login}:{password}'.encode()).decode()
    r = requests.get('https://api.dataforseo.com/v3/tasks_get',
                     headers={'Authorization': f'Basic {creds}'})
    if r.status_code == 200:
        print('✅ DataForSEO: Connected')
    else:
        print(f'❌ DataForSEO: {r.status_code}')
except Exception as e:
    print(f'❌ DataForSEO: {e}')

# Test WordPress
try:
    wp_url = os.environ.get('WP_URL')
    wp_token = os.environ.get('WP_TOKEN')
    r = requests.get(f'{wp_url}/wp-json/wp/v2/posts?per_page=1',
                     headers={'Authorization': f'Bearer {wp_token}'})
    if r.status_code == 200:
        print('✅ WordPress: Connected')
    else:
        print(f'❌ WordPress: {r.status_code}')
except Exception as e:
    print(f'❌ WordPress: {e}')
"
```

---

## Cost Management

### Daily Budget Estimates
| API | Requests/Day | Cost/Day |
|-----|-------------|----------|
| OpenAI | 2-5 articles | $3-5 |
| DataForSEO | 50-100 queries | $1-2 |
| WordPress | 2-5 posts | $0 |
| X/Twitter | 3 posts | $0 |
| **Total** | | **$4-7** |

### Monthly Budget
- **Conservative**: $120-150/month
- **Moderate**: $180-210/month
- **Aggressive**: $300+/month

### Cost Alerts
Set up billing alerts:
- OpenAI: https://platform.openai.com/account/billing
- DataForSEO: Dashboard → Billing → Alerts

### Cost Reduction Tips
1. Use GPT-3.5 for drafts, GPT-4 for final
2. Cache SEO data for 24h
3. Reduce article frequency if needed
4. Monitor and optimize API calls

---

## Security Best Practices

### DO:
- ✅ Use environment variables
- ✅ Add `config.json` to `.gitignore`
- ✅ Rotate keys periodically
- ✅ Use separate accounts for automation
- ✅ Monitor API usage daily
- ✅ Set spending limits

### DON'T:
- ❌ Commit keys to git
- ❌ Share keys in chat/email
- ❌ Use admin-level WordPress tokens
- ❌ Leave keys in plain text files
- ❌ Ignore billing alerts

---

## Troubleshooting

### "Invalid API Key" Error
- Verify key is correct (no extra spaces)
- Check key hasn't expired
- Ensure account has credit/billing enabled

### "Rate Limit Exceeded" Error
- Wait and retry (exponential backoff)
- Reduce request frequency
- Upgrade API tier if needed

### "Insufficient Permissions" Error
- Check API key has required scopes
- Verify account is active
- Contact API support

### Connection Timeouts
- Check internet connection
- Verify API endpoint URLs
- Try from different network

---

## Next Steps

After configuring API keys:
1. Test connections (see test script above)
2. Run a single pipeline: `python3 autopilot.py`
3. Monitor logs for errors
4. Adjust configuration as needed
5. Set up automation (see [CRON.md](CRON.md))
