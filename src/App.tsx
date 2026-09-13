import { useState, useEffect, useRef } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

interface Repo {
  name: string;
  role: string;
  description: string;
  install?: string;
  tags: string[];
  url: string;
}

interface Layer {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  gradient: string;
  repos: Repo[];
}

const layers: Layer[] = [
  {
    id: "logic",
    number: 1,
    title: "Agent Skills & Workflows",
    subtitle: "The Logic Layer",
    icon: "🧠",
    color: "indigo",
    gradient: "from-indigo-600 to-purple-600",
    repos: [
      {
        name: "coreyhaines31/marketingskills",
        role: "Marketing skills bundle for Claude Code, Cursor, Windsurf, etc.",
        description:
          "Packages 40+ structured markdown workflows covering ai-seo, programmatic-seo, directory-submissions, content-strategy, copywriting, cro, and analytics. Enforces guardrails like citation formatting, intent matching, and anti-slop rules.",
        install: "npx skills add coreyhaines31/marketingskills",
        tags: ["40+ Workflows", "SEO", "CRO", "Copywriting", "Analytics"],
        url: "https://github.com/coreyhaines31/marketingskills",
      },
      {
        name: "AgriciDaniel/claude-seo",
        role: "Universal SEO skill pack for Claude Code",
        description:
          "Contains sub-skills and sub-agent instructions covering technical SEO, E-E-A-T, schema, GEO/AEO (Generative Engine Optimization), semantic keyword clustering, and local SEO.",
        tags: ["Technical SEO", "E-E-A-T", "Schema", "GEO/AEO", "Clustering"],
        url: "https://github.com/AgriciDaniel/claude-seo",
      },
    ],
  },
  {
    id: "data",
    number: 2,
    title: "Live Data & MCP Tooling",
    subtitle: "The Data Layer",
    icon: "📡",
    color: "cyan",
    gradient: "from-cyan-600 to-blue-600",
    repos: [
      {
        name: "every-app/open-seo",
        role: "Open-source Semrush/Ahrefs alternative with a built-in MCP server",
        description:
          "Connects to DataForSEO (pay-as-you-go, no $150/mo subscription). Exposes an MCP server so an agent can query keyword volume, check SERPs, audit backlinks, and pull GSC data directly into its context window.",
        install:
          "git clone https://github.com/every-app/open-seo.git\ncd open-seo\ndocker compose up -d\nnpx skills add every-app/open-seo --skill '*'",
        tags: ["MCP Server", "DataForSEO", "SERP", "Backlinks", "GSC"],
        url: "https://github.com/every-app/open-seo",
      },
    ],
  },
  {
    id: "execution",
    number: 3,
    title: "End-to-End Autonomous Agents",
    subtitle: "The Execution Layer",
    icon: "🤖",
    color: "emerald",
    gradient: "from-emerald-600 to-teal-600",
    repos: [
      {
        name: "SimplerSoftwareIO/seo-ai-agent",
        role: "Production Python-based autonomous SEO agent with persistent memory",
        description:
          "Runs an unattended reasoning loop. Checks GSC for traffic drops/opportunities, scrapes target SERPs with Firecrawl, plans briefs, generates markdown content, and can schedule updates without manual prompting.",
        tags: ["Python", "Firecrawl", "GSC", "GA4", "Persistent Memory"],
        url: "https://github.com/SimplerSoftwareIO/seo-ai-agent",
      },
      {
        name: "Uddhav-24/Multi-Agent-SEO-Blog-Generator",
        role: "Multi-agent pipeline for content drafting and optimization",
        description:
          "Divides labor between sub-agents (one agent scrapes competitors, one produces the outline, one writes the draft, and one edits for SEO entities/readability).",
        tags: ["Multi-Agent", "Content Pipeline", "Competitor Analysis", "Readability"],
        url: "https://github.com/Uddhav-24/Multi-Agent-SEO-Blog-Generator",
      },
      {
        name: "DirectoryFast / DirectoryFast MCP",
        role: "Directory builder tooling for agents",
        description:
          "Allows agents to spin up schemas, category taxonomies, and programmatically generate listings and SEO landing pages for niche directories.",
        tags: ["Directories", "Schema", "Taxonomy", "Landing Pages"],
        url: "https://github.com/DirectoryFast",
      },
    ],
  },
  {
    id: "social",
    number: 4,
    title: "Distribution & Feed Mechanics",
    subtitle: "The Social Layer",
    icon: "📢",
    color: "amber",
    gradient: "from-amber-600 to-orange-600",
    repos: [
      {
        name: "xai-org/x-algorithm",
        role: "Open-source recommendation engine code for X",
        description:
          "Exposes the algorithmic weighting factors (e.g., reply velocity, author-to-reply interactions, negative feedback multipliers, media penalties), used by people reverse-engineering distribution tactics for reply-guy bots and visibility hacks.",
        tags: ["Algorithm", "X/Twitter", "Recommendation", "Distribution"],
        url: "https://github.com/xai-org/x-algorithm",
      },
    ],
  },
];

// ─── Components ──────────────────────────────────────────────────────────────

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0f0f2e] to-[#0a0a1a]" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-slate-300">Open-Source Stack Reference</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
            Autonomous SEO
          </span>
          <br />
          <span className="text-white">Pipeline</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Core open-source repositories and skill packs organized by where they fit in the automated pipeline — from data ingestion to content generation to distribution.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#pipeline"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-indigo-600/25"
          >
            View Pipeline ↓
          </a>
          <a
            href="#layers"
            className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-medium hover:bg-white/10 transition-all hover:scale-105 backdrop-blur-sm"
          >
            Explore Layers
          </a>
        </div>
      </div>
    </section>
  );
}

function RepoCard({ repo, index }: { repo: Repo; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const { ref, isVisible } = useInView();

  return (
    <div
      ref={ref}
      className={`group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 cursor-pointer ${
        isVisible ? "animate-fade-in-up" : "opacity-0"
      }`}
      style={{ animationDelay: `${index * 150}ms` }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600/0 to-purple-600/0 group-hover:from-indigo-600/5 group-hover:to-purple-600/5 transition-all duration-300" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <h4 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
            {repo.name}
          </h4>
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-slate-500 hover:text-indigo-400 transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <p className="text-sm text-indigo-300/80 font-medium mb-2">{repo.role}</p>
        <p className="text-sm text-slate-400 leading-relaxed">{repo.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {repo.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-xs rounded-lg bg-white/5 text-slate-300 border border-white/5"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Expanded install instructions */}
        {expanded && repo.install && (
          <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5">
            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-medium">Installation</p>
            <pre className="text-sm text-emerald-300 font-mono whitespace-pre-wrap overflow-x-auto">
              {repo.install}
            </pre>
          </div>
        )}

        {repo.install && (
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
            <span className="text-indigo-400">⌘</span> Click to {expanded ? "hide" : "show"} install instructions
          </p>
        )}
      </div>
    </div>
  );
}

function LayerSection({ layer }: { layer: Layer }) {
  const { ref, isVisible } = useInView();

  return (
    <section id={layer.id} className="py-20 px-6">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className={`mb-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{layer.icon}</span>
            <div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-gradient-to-r ${layer.gradient} text-white`}>
                  Layer {layer.number}
                </span>
                <span className="text-sm text-slate-500">{layer.subtitle}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">{layer.title}</h2>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {layer.repos.map((repo, i) => (
            <RepoCard key={repo.name} repo={repo} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PipelineFlow() {
  const { ref, isVisible } = useInView();
  const steps = [
    {
      label: "every-app/open-seo (MCP)",
      desc: "Pulls live keyword & SERP data",
      icon: "📡",
      color: "from-cyan-500 to-blue-500",
    },
    {
      label: "coreyhaines31/marketingskills",
      desc: "Guides agent on intent & schema",
      icon: "🧠",
      color: "from-indigo-500 to-purple-500",
    },
    {
      label: "SimplerSoftwareIO/seo-ai-agent",
      desc: "Scrapes via Firecrawl, writes, and posts to WordPress REST API",
      icon: "🤖",
      color: "from-emerald-500 to-teal-500",
    },
    {
      label: "GSC / Analytics Auto-Refresh",
      desc: "Audits page 2 rankings every 14d",
      icon: "📊",
      color: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <section id="pipeline" className="py-24 px-6">
      <div ref={ref} className="max-w-4xl mx-auto">
        <div className={`text-center mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            The Autopilot Loop
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            How these tools chain together to create a self-sustaining SEO pipeline
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-indigo-500/50 via-emerald-500/50 to-amber-500/50 hidden md:block" />

          <div className="space-y-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`relative flex items-start gap-6 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
                style={{ animationDelay: `${i * 200 + 300}ms` }}
              >
                {/* Node */}
                <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {step.icon}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-50 blur-xl transition-opacity`} />
                </div>

                {/* Card */}
                <div className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300">
                  <h3 className="text-lg font-semibold text-white mb-1">{step.label}</h3>
                  <p className="text-sm text-slate-400">{step.desc}</p>
                </div>

                {/* Arrow between steps */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[2.15rem] top-16 w-0.5 h-8 hidden md:block">
                    <div className="w-full h-full bg-gradient-to-b from-white/20 to-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Loop arrow */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm text-slate-300 font-medium">Continuous Feedback Loop</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5" : ""
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
            S
          </div>
          <span className="font-semibold text-white hidden sm:block">SEO Pipeline</span>
        </div>

        <div className="flex items-center gap-1">
          {layers.map((layer) => (
            <a
              key={layer.id}
              href={`#${layer.id}`}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            >
              <span className="hidden md:inline">{layer.icon} </span>
              <span className="hidden lg:inline">{layer.subtitle}</span>
              <span className="md:hidden lg:hidden">L{layer.number}</span>
            </a>
          ))}
          <a
            href="#pipeline"
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
          >
            <span className="hidden md:inline">🔄 </span>
            <span className="hidden lg:inline">Pipeline</span>
            <span className="md:hidden lg:hidden">⟳</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

function StatsBar() {
  const { ref, isVisible } = useInView();
  const stats = [
    { value: "7+", label: "Repositories" },
    { value: "4", label: "Pipeline Layers" },
    { value: "40+", label: "Skill Workflows" },
    { value: "∞", label: "Autonomous Loops" },
  ];

  return (
    <div ref={ref} className="py-12 px-6 border-y border-white/5">
      <div className={`max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              {stat.value}
            </div>
            <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-slate-500 text-sm">
          Open-source SEO automation stack reference. All repositories linked are community-maintained.
        </p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="https://github.com/coreyhaines31/marketingskills" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors text-sm">
            marketingskills
          </a>
          <a href="https://github.com/every-app/open-seo" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors text-sm">
            open-seo
          </a>
          <a href="https://github.com/SimplerSoftwareIO/seo-ai-agent" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors text-sm">
            seo-ai-agent
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navigation />
      <Hero />
      <StatsBar />

      <div id="layers">
        {layers.map((layer) => (
          <LayerSection key={layer.id} layer={layer} />
        ))}
      </div>

      <PipelineFlow />
      <Footer />
    </div>
  );
}
