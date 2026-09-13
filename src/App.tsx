import { useState } from "react";
import {
  TrendingUp, Target, DollarSign, FileText, Bot, BarChart3,
  Settings, CheckCircle2, Clock, AlertCircle, ExternalLink,
  ChevronRight, Zap, Globe, Search, Eye, MousePointer,
  Play, Pause, RotateCcw, Copy, Terminal
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "dashboard" | "niches" | "pipeline" | "automation" | "scripts";

interface Niche {
  name: string;
  score: number;
  volume: string;
  difficulty: number;
  rpm: string;
  competition: "Low" | "Medium" | "High";
  status: "Researching" | "Selected" | "Active" | "Rejected";
}

interface ContentItem {
  title: string;
  keyword: string;
  status: "Draft" | "Review" | "Published" | "Optimizing";
  wordCount: number;
  targetTraffic: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const trafficData = [
  { month: "Jan", pageviews: 1200, sessions: 900 },
  { month: "Feb", pageviews: 3400, sessions: 2600 },
  { month: "Mar", pageviews: 7800, sessions: 5900 },
  { month: "Apr", pageviews: 12500, sessions: 9400 },
  { month: "May", pageviews: 18200, sessions: 13700 },
  { month: "Jun", pageviews: 28500, sessions: 21400 },
  { month: "Jul", pageviews: 42000, sessions: 31500 },
  { month: "Aug", pageviews: 55000, sessions: 41200 },
];

const revenueData = [
  { month: "Jan", revenue: 0 },
  { month: "Feb", revenue: 0 },
  { month: "Mar", revenue: 12 },
  { month: "Apr", revenue: 68 },
  { month: "May", revenue: 145 },
  { month: "Jun", revenue: 380 },
  { month: "Jul", revenue: 720 },
  { month: "Aug", revenue: 1100 },
];

const keywordRankings = [
  { keyword: "best resin art kit", position: 3, volume: 8100, change: 2 },
  { keyword: "candle making for beginners", position: 7, volume: 12100, change: -1 },
  { keyword: "how to organize small closet", position: 12, volume: 6600, change: 5 },
  { keyword: "budget travel tips europe", position: 8, volume: 9900, change: 3 },
  { keyword: "indoor plant care guide", position: 4, volume: 14800, change: 1 },
  { keyword: "dog training basics", position: 15, volume: 22000, change: -2 },
];

const niches: Niche[] = [
  { name: "Resin Art & Crafts", score: 87, volume: "45K/mo", difficulty: 22, rpm: "$18-28", competition: "Low", status: "Selected" },
  { name: "Indoor Plant Care", score: 82, volume: "120K/mo", difficulty: 35, rpm: "$12-20", competition: "Medium", status: "Researching" },
  { name: "Small Space Organization", score: 79, volume: "89K/mo", difficulty: 28, rpm: "$15-25", competition: "Low", status: "Researching" },
  { name: "Budget Travel Europe", score: 74, volume: "67K/mo", difficulty: 42, rpm: "$20-35", competition: "Medium", status: "Researching" },
  { name: "Dog Breed Guides", score: 71, volume: "200K/mo", difficulty: 55, rpm: "$10-18", competition: "High", status: "Rejected" },
  { name: "Home Coffee Brewing", score: 68, volume: "78K/mo", difficulty: 38, rpm: "$22-40", competition: "Medium", status: "Rejected" },
];

const contentPipeline: ContentItem[] = [
  { title: "Ultimate Guide to Resin Art for Beginners", keyword: "resin art for beginners", status: "Published", wordCount: 3200, targetTraffic: "8.1K/mo" },
  { title: "Best Resin Kits Under $50 (2026 Tested)", keyword: "best resin kit", status: "Published", wordCount: 2800, targetTraffic: "5.4K/mo" },
  { title: "How to Fix Resin Art Mistakes", keyword: "resin art mistakes", status: "Review", wordCount: 2100, targetTraffic: "3.2K/mo" },
  { title: "Resin Art vs Acrylic Pouring: Which is Better?", keyword: "resin art vs acrylic pouring", status: "Draft", wordCount: 1800, targetTraffic: "2.8K/mo" },
  { title: "10 Resin Art Projects You Can Sell for Profit", keyword: "resin art projects to sell", status: "Draft", wordCount: 2400, targetTraffic: "4.1K/mo" },
  { title: "Epoxy Resin Safety Guide: Everything You Need to Know", keyword: "epoxy resin safety", status: "Optimizing", wordCount: 2600, targetTraffic: "6.6K/mo" },
];

const adNetworkThresholds = [
  { network: "Ezoic", threshold: 10000, current: 55000, color: "#10b981", status: "Applied ✓" },
  { network: "Mediavine", threshold: 50000, current: 55000, color: "#6366f1", status: "Eligible!" },
  { network: "Raptive", threshold: 100000, current: 55000, color: "#f59e0b", status: "55% there" },
];

  const automationScripts = [
    {
      name: "Trend Scraper",
      description: "Scrapes Google Trends for rising queries using undetected-chromedriver",
      language: "python",
      code: `import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class TrendScraper:
    def __init__(self, niche="resin art"):
        self.niche = niche
        self.options = uc.ChromeOptions()
        self.options.add_argument('--headless=new')
        self.driver = uc.Chrome(options=self.options)
        
    def scrape_google_trends(self):
        self.driver.get(f"https://trends.google.com/trends/explore?q={self.niche}&geo=US")
        WebDriverWait(self.driver, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".widget-container"))
        )
        
        rising_queries = []
        query_elements = self.driver.find_elements(By.CSS_SELECTOR, ".fe-table tbody tr")
        
        for element in query_elements[:20]:
            cells = element.find_elements(By.TAG_NAME, "td")
            if len(cells) >= 2:
                rising_queries.append({
                    "query": cells[0].text.strip(),
                    "growth": cells[1].text.strip()
                })
        
        return rising_queries`,
      status: "ready",
    },  {
    name: "SERP Analyzer",
    description: "Analyzes top 10 SERP results for content gaps and opportunities",
    language: "python",
    code: `from computer_use import ComputerUseAgent
import asyncio

async def analyze_serp(keyword):
    agent = ComputerUseAgent()
    
    # Navigate to Google
    await agent.navigate(f"https://google.com/search?q={keyword}")
    
    # Extract top 10 results
    results = await agent.extract_all("div.g")
    
    # Analyze content gaps
    gaps = await agent.analyze_content_gaps(results)
    
    return {
        "keyword": keyword,
        "top_results": results[:10],
        "content_gaps": gaps,
        "opportunity_score": len(gaps) * 10
    }`,
    status: "ready",
  },
  {
    name: "Content Generator",
    description: "Generates SEO-optimized articles using the skill packs",
    language: "bash",
    code: `#!/bin/bash
# Content generation pipeline using marketingskills

KEYWORD="best resin art kit 2026"
BRIEF=$(npx skills run coreyhaines31/marketingskills content-brief \\
  --keyword "$KEYWORD" \\
  --competitors 5 \\
  --semantic-keywords true)

# Generate article
ARTICLE=$(npx skills run coreyhaines31/marketingskills write-article \\
  --brief "$BRIEF" \\
  --word-count 2500 \\
  --tone "beginner-friendly" \\
  --schema "FAQ,HowTo")

# Publish to WordPress
curl -X POST https://yoursite.com/wp-json/wp/v2/posts \\
  -H "Authorization: Bearer $WP_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d "{
    \\"title\\": \\"$ARTICLE_TITLE\\",
    \\"content\\": \\"$ARTICLE\\",
    \\"status\\": \\"draft\\"
  }"`,
    status: "ready",
  },
  {
    name: "Ranking Monitor",
    description: "Daily GSC data pull and ranking change detection",
    language: "python",
    code: `from open_seo import OpenSEOClient
import schedule
import time

client = OpenSEOClient()

def check_rankings():
    # Pull GSC data
    gsc_data = client.get_gsc_data(
        site_url="https://yoursite.com",
        days=7
    )
    
    # Check for ranking changes
    for page in gsc_data["pages"]:
        if page["position_change"] > 3:
            # Position improved significantly
            trigger_optimization(page["url"], "boost")
        elif page["position_change"] < -3:
            # Position dropped
            trigger_optimization(page["url"], "recover")
    
    # Log results
    client.log_metrics(gsc_data)

# Run daily at 6am
schedule.every().day.at("06:00").do(check_rankings)

while True:
    schedule.run_pending()
    time.sleep(60)`,
    status: "running",
  },
  {
    name: "Social Distributor",
    description: "Auto-posts content to X/Twitter using algorithm insights",
    language: "python",
    code: `from browser_use import Agent
from datetime import datetime
import pytz

async def distribute_content(article_url, title):
    # Best posting times based on x-algorithm analysis
    optimal_times = ["09:00", "12:00", "17:00"]
    
    agent = Agent(
        task=f"""
        Post this article to X/Twitter:
        URL: {article_url}
        Title: {title}
        
        Format as an engaging thread:
        1. Hook tweet with emoji
        2. Key insight from article
        3. Call to action with link
        """,
        llm=ChatOpenAI(model="claude-3-opus")
    )
    
    result = await agent.run()
    return result`,
    status: "ready",
  },
  {
    name: "Directory Builder",
    description: "Auto-generates niche directory pages using DirectoryFast",
    language: "bash",
    code: `#!/bin/bash
# Generate niche directory with DirectoryFast MCP

npx skills run directoryfast/mcp generate-directory \\
  --niche "resin art supplies" \\
  --categories "Kits,Pigments,Molds,Tools,Safety" \\
  --items-per-category 10 \\
  --schema "ItemList,Product" \\
  --internal-links true \\
  --output "./content/directories/"

# Publish all generated pages
for file in ./content/directories/*.md; do
  wp post create "$file" --post_type=page --post_status=publish
done`,
    status: "ready",
  },
];

// ─── Components ──────────────────────────────────────────────────────────────

function Sidebar({ activeTab, setActiveTab }: { activeTab: Tab; setActiveTab: (t: Tab) => void }) {
  const tabs = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: BarChart3 },
    { id: "niches" as Tab, label: "Niche Research", icon: Search },
    { id: "pipeline" as Tab, label: "Content Pipeline", icon: FileText },
    { id: "automation" as Tab, label: "Automation", icon: Bot },
    { id: "scripts" as Tab, label: "Scripts", icon: Terminal },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0d0d1a] border-r border-white/5 flex flex-col z-40">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">NichePilot</h1>
            <p className="text-xs text-slate-500">Autonomous SEO Ops</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-300 font-medium">Agent Active</span>
          </div>
          <p className="text-xs text-slate-400">Monitoring rankings & generating content...</p>
        </div>
      </div>
    </aside>
  );
}

function DashboardView() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-slate-400 mt-1">Real-time overview of your niche site operation</p>
      </div>

      {/* Ad Network Progress */}
      <div className="grid gap-4 md:grid-cols-3">
        {adNetworkThresholds.map((net) => (
          <div key={net.network} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">{net.network}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                net.current >= net.threshold 
                  ? "bg-emerald-500/20 text-emerald-300" 
                  : "bg-amber-500/20 text-amber-300"
              }`}>
                {net.status}
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {net.current.toLocaleString()} <span className="text-sm text-slate-500 font-normal">/ {net.threshold.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min(100, (net.current / net.threshold) * 100)}%`,
                  backgroundColor: net.color,
                }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {net.threshold === 10000 ? "Pageviews" : net.threshold === 50000 ? "Sessions" : "Pageviews"} required
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Traffic Growth
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                labelStyle={{ color: "#fff" }}
              />
              <Area type="monotone" dataKey="pageviews" stroke="#6366f1" fill="url(#colorPageviews)" strokeWidth={2} />
              <Area type="monotone" dataKey="sessions" stroke="#06b6d4" fill="url(#colorSessions)" strokeWidth={2} />
              <defs>
                <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Revenue Growth
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                labelStyle={{ color: "#fff" }}
                formatter={(value: number) => [`$${value}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Keyword Rankings */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-purple-400" />
          Keyword Rankings
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-slate-500 font-medium pb-3 pr-4">Keyword</th>
                <th className="text-center text-xs text-slate-500 font-medium pb-3 px-4">Position</th>
                <th className="text-center text-xs text-slate-500 font-medium pb-3 px-4">Volume</th>
                <th className="text-center text-xs text-slate-500 font-medium pb-3 pl-4">Change</th>
              </tr>
            </thead>
            <tbody>
              {keywordRankings.map((kw) => (
                <tr key={kw.keyword} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="py-3 pr-4 text-sm text-white">{kw.keyword}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${
                      kw.position <= 3 ? "bg-emerald-500/20 text-emerald-300" :
                      kw.position <= 10 ? "bg-amber-500/20 text-amber-300" :
                      "bg-red-500/20 text-red-300"
                    }`}>
                      {kw.position}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-slate-400">{kw.volume.toLocaleString()}</td>
                  <td className="py-3 pl-4 text-center">
                    <span className={`text-sm font-medium ${kw.change > 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {kw.change > 0 ? "↑" : "↓"} {Math.abs(kw.change)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function NichesView() {
  const radarData = [
    { subject: "Volume", A: 85 },
    { subject: "Low KD", A: 90 },
    { subject: "RPM", A: 75 },
    { subject: "Evergreen", A: 88 },
    { subject: "Affiliate", A: 70 },
    { subject: "Content Depth", A: 82 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Niche Research</h2>
        <p className="text-slate-400 mt-1">Automated scoring using trend data + competition analysis</p>
      </div>

      {/* Scoring Radar */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Scoring Model</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              <Radar name="Resin Art" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="md:col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Evaluation Criteria</h3>
          <div className="grid gap-3">
            {[
              { label: "Search Volume", desc: "1K-50K monthly searches (sweet spot)", weight: "25%" },
              { label: "Keyword Difficulty", desc: "KD < 30 for new sites", weight: "20%" },
              { label: "Ad RPM Potential", desc: "$15+ RPM for display ads", weight: "20%" },
              { label: "Evergreen Score", desc: "Content stays relevant 12+ months", weight: "15%" },
              { label: "Affiliate Potential", desc: "Products to recommend ($20+ commission)", weight: "10%" },
              { label: "Content Depth", desc: "Can produce 100+ unique articles", weight: "10%" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div>
                  <p className="text-sm text-white font-medium">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg">{item.weight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Niche Cards */}
      <div>
        <h3 className="text-white font-semibold mb-4">Candidate Niches</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {niches.map((niche) => (
            <div key={niche.name} className={`bg-white/[0.03] border rounded-2xl p-5 transition-all hover:bg-white/[0.06] ${
              niche.status === "Selected" ? "border-emerald-500/30" :
              niche.status === "Rejected" ? "border-red-500/20 opacity-60" :
              "border-white/[0.06]"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-semibold text-sm">{niche.name}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  niche.status === "Selected" ? "bg-emerald-500/20 text-emerald-300" :
                  niche.status === "Rejected" ? "bg-red-500/20 text-red-300" :
                  "bg-amber-500/20 text-amber-300"
                }`}>
                  {niche.status}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl font-bold text-white">{niche.score}</div>
                <div className="text-xs text-slate-500">/100 score</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-white/[0.03]">
                  <span className="text-slate-500">Volume</span>
                  <p className="text-white font-medium">{niche.volume}</p>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.03]">
                  <span className="text-slate-500">KD</span>
                  <p className="text-white font-medium">{niche.difficulty}</p>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.03]">
                  <span className="text-slate-500">RPM</span>
                  <p className="text-white font-medium">{niche.rpm}</p>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.03]">
                  <span className="text-slate-500">Competition</span>
                  <p className={`font-medium ${
                    niche.competition === "Low" ? "text-emerald-300" :
                    niche.competition === "Medium" ? "text-amber-300" :
                    "text-red-300"
                  }`}>{niche.competition}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PipelineView() {
  const statusColors = {
    Draft: "bg-slate-500/20 text-slate-300",
    Review: "bg-amber-500/20 text-amber-300",
    Published: "bg-emerald-500/20 text-emerald-300",
    Optimizing: "bg-indigo-500/20 text-indigo-300",
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Content Pipeline</h2>
        <p className="text-slate-400 mt-1">AI-generated content tracked through the production workflow</p>
      </div>

      {/* Pipeline Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Articles", value: "47", icon: FileText, color: "text-indigo-400" },
          { label: "Published", value: "28", icon: CheckCircle2, color: "text-emerald-400" },
          { label: "In Review", value: "8", icon: Clock, color: "text-amber-400" },
          { label: "Words This Week", value: "18.4K", icon: Zap, color: "text-purple-400" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-xs text-slate-500">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Content Table */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Active Content</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-slate-500 font-medium pb-3">Title</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-3">Keyword</th>
                <th className="text-center text-xs text-slate-500 font-medium pb-3">Status</th>
                <th className="text-center text-xs text-slate-500 font-medium pb-3">Words</th>
                <th className="text-center text-xs text-slate-500 font-medium pb-3">Target</th>
              </tr>
            </thead>
            <tbody>
              {contentPipeline.map((item) => (
                <tr key={item.title} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="py-4 pr-4">
                    <p className="text-sm text-white font-medium">{item.title}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <code className="text-xs text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded">{item.keyword}</code>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-slate-400">{item.wordCount.toLocaleString()}</td>
                  <td className="py-4 pl-4 text-center text-sm text-slate-400">{item.targetTraffic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Production Schedule */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Production Schedule</h3>
        <div className="grid gap-3">
          {[
            { day: "Monday", task: "Trend research + keyword selection", articles: "2 briefs generated" },
            { day: "Tuesday", task: "Content generation (AI drafts)", articles: "2 articles drafted" },
            { day: "Wednesday", task: "Human review + optimization", articles: "2 articles reviewed" },
            { day: "Thursday", task: "Publishing + internal linking", articles: "2 articles published" },
            { day: "Friday", task: "Social distribution + backlinks", articles: "2 articles promoted" },
            { day: "Weekend", task: "Analytics review + strategy adjust", articles: "Performance report" },
          ].map((item) => (
            <div key={item.day} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="w-24 text-sm font-medium text-indigo-300">{item.day}</div>
              <div className="flex-1 text-sm text-slate-300">{item.task}</div>
              <div className="text-xs text-slate-500">{item.articles}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AutomationView() {
  const [activeLoops, setActiveLoops] = useState<string[]>(["ranking-monitor"]);

  const loops = [
    {
      id: "trend-scraper",
      name: "Trend Scraper",
      description: "Scrapes Google Trends every 6 hours for rising queries",
      icon: Search,
      schedule: "Every 6h",
      lastRun: "2 hours ago",
      status: "idle",
    },
    {
      id: "serp-analyzer",
      name: "SERP Analyzer",
      description: "Analyzes top 10 results for content gaps",
      icon: Eye,
      schedule: "Daily at 8am",
      lastRun: "14 hours ago",
      status: "idle",
    },
    {
      id: "content-generator",
      name: "Content Generator",
      description: "Generates SEO articles from approved briefs",
      icon: FileText,
      schedule: "Daily at 10am",
      lastRun: "8 hours ago",
      status: "idle",
    },
    {
      id: "ranking-monitor",
      name: "Ranking Monitor",
      description: "Pulls GSC data and detects ranking changes",
      icon: BarChart3,
      schedule: "Daily at 6am",
      lastRun: "20 hours ago",
      status: "active",
    },
    {
      id: "social-distributor",
      name: "Social Distributor",
      description: "Posts content to X/Twitter at optimal times",
      icon: Globe,
      schedule: "3x daily",
      lastRun: "4 hours ago",
      status: "idle",
    },
    {
      id: "directory-builder",
      name: "Directory Builder",
      description: "Generates niche directory pages programmatically",
      icon: MousePointer,
      schedule: "Weekly",
      lastRun: "3 days ago",
      status: "idle",
    },
  ];

  const toggleLoop = (id: string) => {
    setActiveLoops((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Automation Control</h2>
        <p className="text-slate-400 mt-1">Manage autonomous agent loops and browser automation tasks</p>
      </div>

      {/* Active Loops Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-gradient-to-br from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-emerald-300 font-medium">Active Loops</span>
          </div>
          <div className="text-3xl font-bold text-white">{activeLoops.length}</div>
          <p className="text-xs text-slate-500 mt-1">of {loops.length} total</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
          <span className="text-sm text-slate-400">Tasks Completed Today</span>
          <div className="text-3xl font-bold text-white mt-2">14</div>
          <p className="text-xs text-emerald-400 mt-1">↑ 40% vs yesterday</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
          <span className="text-sm text-slate-400">API Credits Used</span>
          <div className="text-3xl font-bold text-white mt-2">$2.40</div>
          <p className="text-xs text-slate-500 mt-1">DataForSEO + OpenAI</p>
        </div>
      </div>

      {/* Agent Loops */}
      <div className="grid gap-4 md:grid-cols-2">
        {loops.map((loop) => {
          const Icon = loop.icon;
          const isActive = activeLoops.includes(loop.id);

          return (
            <div key={loop.id} className={`bg-white/[0.03] border rounded-2xl p-5 transition-all ${
              isActive ? "border-emerald-500/30 bg-emerald-500/[0.03]" : "border-white/[0.06]"
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isActive ? "bg-emerald-500/20" : "bg-white/5"
                  }`}>
                    <Icon className={`w-5 h-5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">{loop.name}</h4>
                    <p className="text-xs text-slate-500">{loop.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleLoop(loop.id)}
                  className={`p-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                      : "bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {loop.schedule}
                </span>
                <span className="text-slate-500">
                  Last: {loop.lastRun}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tech Stack */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Automation Stack</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { name: "undetected-chromedriver", desc: "Bypass bot detection for scraping", cmd: "pip install undetected-chromedriver" },
            { name: "browser-use", desc: "AI-powered browser automation agent", cmd: "pip install browser-use" },
            { name: "computer-use", desc: "Anthropic's computer control API", cmd: "pip install computer-use" },
            { name: "open-seo (MCP)", desc: "SEO data via Model Context Protocol", cmd: "npx skills add every-app/open-seo" },
            { name: "marketingskills", desc: "40+ SEO workflow templates", cmd: "npx skills add coreyhaines31/marketingskills" },
            { name: "seo-ai-agent", desc: "Autonomous SEO reasoning loop", cmd: "git clone SimplerSoftwareIO/seo-ai-agent" },
          ].map((tool) => (
            <div key={tool.name} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-white">{tool.name}</h4>
                <span className="text-xs text-emerald-400">installed</span>
              </div>
              <p className="text-xs text-slate-500 mb-2">{tool.desc}</p>
              <code className="text-xs text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded block overflow-x-auto">
                {tool.cmd}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScriptsView() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Automation Scripts</h2>
        <p className="text-slate-400 mt-1">Ready-to-run scripts for your local environment</p>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-amber-300 font-medium">Local Execution Required</p>
          <p className="text-xs text-amber-300/70 mt-1">
            These scripts require Python 3.10+, API keys (OpenAI, DataForSEO), and a local Chrome installation. Copy and run on your machine.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {automationScripts.map((script, i) => (
          <div key={script.name} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${script.status === "running" ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
                <div>
                  <h4 className="text-white font-semibold">{script.name}</h4>
                  <p className="text-xs text-slate-500">{script.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-lg bg-white/5 text-slate-400">{script.language}</span>
                <button
                  onClick={() => copyCode(script.code, i)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 text-xs font-medium hover:bg-indigo-600/30 transition-all"
                >
                  {copiedIndex === i ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedIndex === i ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <div className="p-5 bg-black/30">
              <pre className="text-sm text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {script.code}
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* Setup Instructions */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-400" />
          Local Setup Instructions
        </h3>
        <div className="space-y-4">
          {[
            { step: 1, title: "Install Python dependencies", cmd: "pip install undetected-chromedriver browser-use computer-use dataforseo-client schedule" },
            { step: 2, title: "Install skill packs", cmd: "npx skills add coreyhaines31/marketingskills && npx skills add every-app/open-seo --skill '*'" },
            { step: 3, title: "Clone the SEO agent", cmd: "git clone https://github.com/SimplerSoftwareIO/seo-ai-agent && cd seo-ai-agent && pip install -r requirements.txt" },
            { step: 4, title: "Set environment variables", cmd: "export OPENAI_API_KEY=sk-...\nexport DATAFORSEO_LOGIN=...\nexport DATAFORSEO_PASSWORD=...\nexport WP_TOKEN=..." },
            { step: 5, title: "Start the automation loop", cmd: "python main.py --mode autonomous --niche 'resin art'" },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-300 text-sm font-bold">
                {item.step}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium mb-1">{item.title}</p>
                <pre className="text-xs text-emerald-300 bg-black/30 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">{item.cmd}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="ml-64 p-8">
        {activeTab === "dashboard" && <DashboardView />}
        {activeTab === "niches" && <NichesView />}
        {activeTab === "pipeline" && <PipelineView />}
        {activeTab === "automation" && <AutomationView />}
        {activeTab === "scripts" && <ScriptsView />}
      </main>
    </div>
  );
}
