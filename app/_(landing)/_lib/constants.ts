/**
 * Constants for Landing Page
 * Centralized configuration and content
 */

// Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const;

// Animation timings (in seconds)
export const ANIMATION_DURATION = {
  instant: 0,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  verySlow: 1,
} as const;

// Particle system configuration
export const PARTICLE_CONFIG = {
  desktop: {
    count: 180,
    speed: 0.5,
    connectionDistance: 120,
  },
  tablet: {
    count: 90,
    speed: 0.3,
    connectionDistance: 100,
  },
  mobile: {
    count: 40,
    speed: 0.2,
    connectionDistance: 80,
  },
} as const;

// Scroll trigger thresholds
export const SCROLL_THRESHOLDS = {
  navbarShrink: 50,
  fadeIn: 0.1,
  fadeInPartial: 0.5,
} as const;

// Social links
export const SOCIAL_LINKS = {
  github: "https://github.com/Ontos-AI/knowhere",
  discord: "#",
  twitter: "#",
  linkedin: "#",
} as const;

// Navigation links
export const NAV_LINKS = [
  { label: "Comparison", href: "#comparison" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "https://docs.knowhereto.ai/" },
] as const;

// Trust metrics (to be updated with real data)
export const TRUST_METRICS = [
  {
    value: "53.6K+",
    label: "GitHub Stars",
    icon: "star",
  },
  {
    value: "2M+",
    label: "Documents Processed",
    icon: "file",
  },
  {
    value: "99.8%",
    label: "Accuracy Rate",
    icon: "target",
  },
  {
    value: "100+",
    label: "Integrations",
    icon: "puzzle",
  },
  {
    value: "SOC2",
    label: "Certified",
    icon: "shield",
  },
  {
    value: "<200ms",
    label: "Response Time",
    icon: "zap",
  },
] as const;

// Capabilities list
export const CAPABILITIES = [
  {
    title: "Advanced Table Recognition",
    description:
      "Parse complex tables with rotations, merged cells, and cross-page spans with industry-leading accuracy.",
    icon: "table",
  },
  {
    title: "Precise Formula Recognition",
    description: "Extract mathematical formulas and convert to LaTeX/MathML with perfect fidelity.",
    icon: "calculator",
  },
  {
    title: "Multi-format Support",
    description: "Process 50+ file types: PDF, DOCX, XLSX, PPT, HTML, Images, and more.",
    icon: "files",
  },
  {
    title: "Chemical Structure Analysis",
    description: "SOTA molecular detection, reaction extraction, and global association.",
    icon: "atom",
  },
  {
    title: "Real-time Processing",
    description: "Sub-200ms response time for most documents with concurrent processing.",
    icon: "zap",
  },
  {
    title: "Enterprise Security",
    description: "SOC2 compliant, zero data retention, end-to-end encryption.",
    icon: "shield",
  },
  {
    title: "API First Design",
    description: "RESTful API with webhooks, SDKs for Python, Node.js, Go, Rust, and more.",
    icon: "code",
  },
  {
    title: "Global Infrastructure",
    description: "Multi-region deployment on AWS and Aliyun for <50ms latency worldwide.",
    icon: "globe",
  },
] as const;

// Why choose us features
export const WHY_CHOOSE_US = [
  {
    title: "No Vendor Lock-in",
    description:
      "Self-hosted option available. Your data stays on your infrastructure if you need it.",
    icon: "unlock",
  },
  {
    title: "Transparent Pricing",
    description: "Simple pay-per-document pricing. No hidden fees, no surprises.",
    icon: "dollar-sign",
  },
  {
    title: "24/7 Support",
    description: "Active Discord community plus enterprise SLA for critical workloads.",
    icon: "headphones",
  },
  {
    title: "Open Roadmap",
    description: "Vote on features, track progress, and influence the product direction.",
    icon: "map",
  },
  {
    title: "99.9% Uptime SLA",
    description: "Enterprise-grade reliability with automatic failover and monitoring.",
    icon: "activity",
  },
  {
    title: "Developer Experience",
    description: "Beautiful docs, interactive playground, and comprehensive SDKs.",
    icon: "heart",
  },
] as const;

// Pipeline stages for visualization
export const PIPELINE_STAGES = [
  {
    title: "Input",
    description: "Upload document or provide URL",
    icon: "upload",
  },
  {
    title: "OCR",
    description: "Extract text with high accuracy",
    icon: "scan",
  },
  {
    title: "Structure Analysis",
    description: "Identify tables, formulas, layouts",
    icon: "layout",
  },
  {
    title: "Output",
    description: "Clean structured JSON/Markdown",
    icon: "check-circle",
  },
] as const;

// Supported file types
export const FILE_TYPES = [
  { label: "PDF", color: "red" },
  { label: "DOCX", color: "blue" },
  { label: "XLSX", color: "green" },
  { label: "PPT", color: "orange" },
  { label: "HTML", color: "purple" },
  { label: "Images", color: "pink" },
] as const;

// CTA buttons
export const CTA_PRIMARY = {
  text: "Start Free Trial",
  href: "/login",
} as const;

export const CTA_SECONDARY = {
  text: "View Documentation",
  href: "https://docs.knowhereto.ai/",
} as const;

export const CTA_DEMO = {
  text: "Try Live Demo",
  action: "openDemo",
} as const;

// Integration steps
export const INTEGRATION_STEPS = [
  {
    number: "1",
    title: "Get your API Key",
    description: "Sign up and generate your secure API key from the dashboard.",
  },
  {
    number: "2",
    title: "Send a Request",
    description: "Upload a file or provide a URL using our simple REST API.",
  },
  {
    number: "3",
    title: "Receive Results",
    description: "Get structured JSON data via webhook or polling.",
  },
] as const;

// Code language tabs
export const CODE_LANGUAGES = [
  { id: "python", label: "Python" },
  { id: "javascript", label: "Node.js" },
  { id: "curl", label: "cURL" },
  { id: "go", label: "Go" },
] as const;

// Footer links
export const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/api" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Security", href: "/security" },
  ],
  resources: [
    { label: "Tutorials", href: "/tutorials" },
    { label: "Examples", href: "/examples" },
    { label: "Community", href: "/community" },
    { label: "Status", href: "/status" },
  ],
} as const;

// Meta information
export const SITE_META = {
  title: "Knowhere API - Transform Documents into Structured Data",
  description:
    "The most accurate document parsing API for AI agents. Extract tables, formulas, and structured data with unmatched precision.",
  keywords: ["document parsing", "OCR", "data extraction", "AI", "API", "RAG", "unstructured data"],
  ogImage: "/og-image.png",
  twitterCard: "summary_large_image",
} as const;
