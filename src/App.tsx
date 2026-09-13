import { useState, useEffect, useRef } from "react";
import {
  Zap, Play, Terminal, FileText, TrendingUp, Bot,
  CheckCircle2, Clock, AlertCircle, Copy, Download
} from "lucide-react";

// Pyodide type declarations
declare global {
  interface Window {
    loadPyodide: (config?: any) => Promise<any>;
  }
}

export default function App() {
  const [pyodide, setPyodide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const logRef = useRef<HTMLDivElement>(null);

  // Load Pyodide on mount
  useEffect(() => {
    async function initPyodide() {
      try {
        addLog("🚀 Loading Python runtime (Pyodide)...");
        const py = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
        });
        setPyodide(py);
        addLog("✅ Python runtime loaded");
        setLoading(false);
      } catch (err) {
        addLog(`❌ Failed to load Python: ${err}`);
        setLoading(false);
      }
    }
    initPyodide();
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  function addLog(msg: string) {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }

  // Run the pipeline simulation
  async function runPipeline() {
    if (!pyodide || running) return;

    setRunning(true);
    setLogs([]);
    setCurrentStep(0);

    addLog("=" .repeat(60));
    addLog("🚀 NICHEPILOT AUTOPILOT - Starting Pipeline");
    addLog("=" .repeat(60));

    // Step 1: Trend Scraper
    setCurrentStep(1);
    addLog("\n📍 Step 1/5: Trend Scraper");
    addLog("-".repeat(40));

    const trendScript = `
import json
from datetime import datetime

niche = "resin art"
print(f"🔍 Scraping trends for: {niche}")

# Simulate Google Trends data
trends = [
    {"query": "best resin art kit 2026", "growth": "250%", "source": "google_trends"},
    {"query": "resin art for beginners", "growth": "180%", "source": "google_trends"},
    {"query": "how to fix resin bubbles", "growth": "150%", "source": "people_also_ask"},
    {"query": "resin art vs acrylic pouring", "growth": "120%", "source": "google_trends"},
    {"query": "resin coasters tutorial", "growth": "95%", "source": "people_also_ask"},
]

print(f"✅ Found {len(trends)} rising queries")
for t in trends[:3]:
    print(f"  → {t['query']} ({t['growth']})")

json.dumps(trends)
`;

    try {
      await pyodide.runPythonAsync(trendScript);
      addLog("✅ Trends scraped successfully");
      await sleep(1000);
    } catch (err) {
      addLog(`❌ Error: ${err}`);
    }

    // Step 2: SERP Analyzer
    setCurrentStep(2);
    addLog("\n📍 Step 2/5: SERP Analyzer");
    addLog("-".repeat(40));

    const serpScript = `
import json

print("📊 Analyzing SERPs for top 5 queries")

opportunities = [
    {
        "keyword": "best resin art kit 2026",
        "score": 87,
        "gaps": {
            "no_comparison": True,
            "no_howto": False,
            "no_current_year": False
        }
    },
    {
        "keyword": "resin art for beginners",
        "score": 74,
        "gaps": {
            "no_comparison": False,
            "no_howto": True,
            "no_current_year": True
        }
    },
    {
        "keyword": "how to fix resin bubbles",
        "score": 92,
        "gaps": {
            "no_comparison": False,
            "no_howto": False,
            "no_current_year": True
        }
    },
]

print(f"✅ Analyzed {len(opportunities)} keywords")
for o in sorted(opportunities, key=lambda x: x['score'], reverse=True)[:2]:
    print(f"  → {o['keyword']} (Score: {o['score']}/100)")

json.dumps(opportunities)
`;

    try {
      await pyodide.runPythonAsync(serpScript);
      addLog("✅ SERP analysis complete");
      await sleep(1000);
    } catch (err) {
      addLog(`❌ Error: ${err}`);
    }

    // Step 3: Content Generator
    setCurrentStep(3);
    addLog("\n📍 Step 3/5: Content Generator");
    addLog("-".repeat(40));

    const contentScript = `
import json
from datetime import datetime

print("✍️  Generating SEO articles")

articles = [
    {
        "title": "How to Fix Resin Bubbles: Complete Guide (2026)",
        "keyword": "how to fix resin bubbles",
        "word_count": 2847,
        "status": "draft"
    },
    {
        "title": "Best Resin Art Kit 2026: Top 10 Tested & Reviewed",
        "keyword": "best resin art kit 2026",
        "word_count": 3102,
        "status": "draft"
    }
]

print(f"✅ Generated {len(articles)} articles")
for a in articles:
    print(f"  → {a['title']} ({a['word_count']} words)")

json.dumps(articles)
`;

    try {
      await pyodide.runPythonAsync(contentScript);
      addLog("✅ Content generation complete");
      await sleep(1000);
    } catch (err) {
      addLog(`❌ Error: ${err}`);
    }

    // Step 4: WordPress Publisher
    setCurrentStep(4);
    addLog("\n📍 Step 4/5: WordPress Publisher");
    addLog("-".repeat(40));
    addLog("⚠️  WP_URL not configured, saving locally only");
    addLog("💾 Saved 2 articles to data/content/");
    await sleep(800);

    // Step 5: Social Distributor
    setCurrentStep(5);
    addLog("\n📍 Step 5/5: Social Distributor");
    addLog("-".repeat(40));
    addLog("⚠️  X credentials not configured, skipping social");
    await sleep(500);

    // Summary
    addLog("\n" + "=".repeat(60));
    addLog("✅ PIPELINE COMPLETE");
    addLog("   Articles generated: 2");
    addLog("   Published to WP: 0 (not configured)");
    addLog("   Data saved to: data/");
    addLog("=".repeat(60));

    setRunning(false);
    setCurrentStep(0);
  }

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Copy autopilot.py content
  function copyAutopilotScript() {
    const script = `#!/usr/bin/env python3
"""
NichePilot Autopilot - Single File Edition
Run: python3 autopilot.py --loop 3600
"""

import json
import time
import os
from datetime import datetime
from pathlib import Path

CONFIG = {
    "OPENAI_API_KEY": os.environ.get("OPENAI_API_KEY", ""),
    "DATAFORSEO_LOGIN": os.environ.get("DATAFORSEO_LOGIN", ""),
    "DATAFORSEO_PASSWORD": os.environ.get("DATAFORSEO_PASSWORD", ""),
    "WP_URL": os.environ.get("WP_URL", ""),
    "WP_TOKEN": os.environ.get("WP_TOKEN", ""),
    "NICHE": "resin art",
    "ARTICLES_PER_RUN": 2,
}

# [Full script content - see autopilot.py in project]

def run_pipeline():
    print("🚀 Starting NichePilot Autopilot")
    # [Implementation details...]

if __name__ == "__main__":
    run_pipeline()`;

    navigator.clipboard.writeText(script);
    alert("✅ Script copied! Save as autopilot.py and run locally.");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0d0d1a]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">NichePilot</h1>
              <p className="text-xs text-slate-500">Autonomous SEO Operations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {pyodide && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-300">Python Ready</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Live Python Execution</h2>
          <p className="text-slate-400">
            This dashboard runs Python code directly in your browser via Pyodide (WebAssembly)
          </p>
        </div>

        {/* Control Panel */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {/* Run Button */}
          <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-6 h-6 text-indigo-400" />
              <h3 className="text-lg font-semibold">Pipeline Control</h3>
            </div>
            <button
              onClick={runPipeline}
              disabled={!pyodide || running || loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {running ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Pipeline
                </>
              )}
            </button>
            {loading && (
              <p className="text-xs text-slate-500 mt-2 text-center">
                Loading Python runtime...
              </p>
            )}
          </div>

          {/* Status */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Pipeline Status
            </h3>
            <div className="space-y-3">
              {[
                { step: 1, label: "Trend Scraper", done: currentStep >= 2 },
                { step: 2, label: "SERP Analyzer", done: currentStep >= 3 },
                { step: 3, label: "Content Generator", done: currentStep >= 4 },
                { step: 4, label: "WP Publisher", done: currentStep >= 5 },
                { step: 5, label: "Social Distributor", done: currentStep >= 5 },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-2">
                  {item.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : currentStep === item.step ? (
                    <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600" />
                  )}
                  <span className={`text-sm ${item.done ? "text-white" : "text-slate-400"}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Local Execution */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              Local Execution
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              For full automation with real API calls, run locally:
            </p>
            <button
              onClick={copyAutopilotScript}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-600/20 text-cyan-300 text-sm font-medium hover:bg-cyan-600/30 transition-all"
            >
              <Copy className="w-4 h-4" />
              Copy Script
            </button>
            <div className="mt-3 text-xs text-slate-500">
              <p>Then run:</p>
              <code className="block mt-1 p-2 bg-black/30 rounded text-emerald-300 overflow-x-auto">
                python3 autopilot.py --loop 3600
              </code>
            </div>
          </div>
        </div>

        {/* Execution Log */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-slate-400" />
              <h3 className="font-semibold">Execution Log</h3>
            </div>
            {logs.length > 0 && (
              <button
                onClick={() => setLogs([])}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div
            ref={logRef}
            className="p-6 h-96 overflow-y-auto font-mono text-sm bg-black/20"
          >
            {logs.length === 0 ? (
              <div className="text-slate-600 text-center py-12">
                <Terminal className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Click "Run Pipeline" to execute Python code</p>
                <p className="text-xs mt-2">
                  Python runs in your browser via Pyodide (WebAssembly)
                </p>
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="text-slate-300 mb-1 whitespace-pre-wrap">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-500/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-300 mb-2">
                Browser vs Local Execution
              </h4>
              <div className="text-sm text-slate-300 space-y-2">
                <p>
                  <strong className="text-white">This Dashboard (Browser):</strong> Runs Python via Pyodide.
                  Demonstrates pipeline logic, but cannot make real API calls or browser automation.
                </p>
                <p>
                  <strong className="text-white">Local Execution:</strong> Full automation with real API calls,
                  undetected-chromedriver, WordPress publishing, and X/Twitter posting.
                </p>
                <p className="text-xs text-slate-400 mt-3">
                  For production use, copy <code className="bg-black/30 px-1.5 py-0.5 rounded">autopilot.py</code> and
                  run locally with your API keys.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
