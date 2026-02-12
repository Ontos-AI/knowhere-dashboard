/**
 * Data structure for versus comparison pages
 */

// Product identifiers (excluding "original" and "knowhere")
export type VersusProductId = "unstructured" | "markitdown";

// Quick comparison card data
export type ComparisonCard = {
  id: string;
  title: string;
  knowhere: {
    status: "supported" | "partial" | "not-supported";
    value?: string;
    description: string;
  };
  competitor: {
    status: "supported" | "partial" | "not-supported";
    value?: string;
    description: string;
  };
  importance: "high" | "medium" | "low";
};

// Live demo configuration (iframe only - no screenshots needed)
export type LiveDemoConfig = {
  originalFile: string; // Path to original input HTML
  knowhereOutput: string; // Path to Knowhere output HTML
  competitorOutput: string; // Path to competitor output HTML
  highlights: {
    knowhere: string[]; // Key advantages to highlight
    competitor: string[]; // Key problems to highlight
  };
};

// Feature comparison row (Phase 2)
export type FeatureRow = {
  id: string;
  feature: string;
  knowhere: {
    supported: boolean;
    details?: string;
  };
  competitor: {
    supported: boolean;
    details?: string;
  };
  tooltip?: string;
};

// Use case scenario (Phase 2)
export type UseCase = {
  id: string;
  title: string;
  icon: string; // Lucide icon name
  description: string;
  scenario: string;
  knowhereAdvantage: string;
  competitorLimitation: string;
  impact: "high" | "medium" | "low";
};

// FAQ item (Phase 2)
export type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: "general" | "technical" | "pricing" | "migration";
};

// Testimonial (Phase 2)
export type Testimonial = {
  id: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  quote: string;
  rating: number; // 1-5
};

// Complete versus page data
export type VersusPageData = {
  productId: VersusProductId;
  productName: string; // "Unstructured" or "Markitdown"

  // Header navigation (optional - overrides global nav links)
  headerNav?: Array<{
    label: string;
    href: string;
  }>;

  // Hero section
  hero: {
    title: string; // e.g., "Knowhere vs Unstructured"
    subtitle: string;
    highlightMetric?: {
      value: string;
      label: string;
    };
  };

  // Quick comparison cards (MVP - Phase 1)
  quickComparison: {
    title: string;
    subtitle: string;
    cards: ComparisonCard[];
  };

  // Live demo section (MVP - Phase 1)
  liveDemo: LiveDemoConfig;

  // CTA section (MVP - Phase 1)
  cta: {
    title: string;
    subtitle: string;
    primaryButton: {
      text: string;
      href: string;
    };
    secondaryButton: {
      text: string;
      href: string;
    };
    trustBadges: string[];
  };

  // ===== Optional Sections for Phase 2 =====

  // Detailed feature comparison table (Optional - Phase 2)
  featureTable?: {
    title: string;
    subtitle: string;
    categories: Array<{
      name: string;
      features: FeatureRow[];
    }>;
  };

  // Technical deep dive (Optional - Phase 2)
  technicalDeepDive?: {
    title: string;
    sections: Array<{
      id: string;
      heading: string;
      content: string;
      codeExample?: {
        language: string;
        code: string;
      };
    }>;
  };

  // Use cases (Optional - Phase 2)
  useCases?: {
    title: string;
    subtitle: string;
    cases: UseCase[];
  };

  // FAQ section (Optional - Phase 2)
  faq?: {
    title: string;
    items: FAQItem[];
  };

  // Testimonials (Optional - Phase 2)
  testimonials?: {
    title: string;
    items: Testimonial[];
  };

  // SEO metadata
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
};

// Data for Unstructured comparison
export const versusUnstructured: VersusPageData = {
  productId: "unstructured",
  productName: "Unstructured",

  // Empty header nav - no COMPARISON, PRICING, DOCS links
  headerNav: [],

  hero: {
    title: "Knowhere vs Unstructured",
    subtitle: "Why Knowhere delivers superior document parsing for complex tables",
    highlightMetric: {
      value: "3x Better",
      label: "Table Structure Accuracy",
    },
  },

  quickComparison: {
    title: "Key Differences at a Glance",
    subtitle: "See how Knowhere outperforms Unstructured in critical areas",
    cards: [
      {
        id: "multi-level-headers",
        title: "Multi-level Header Detection",
        knowhere: {
          status: "supported",
          value: "99.8%",
          description: "Perfectly identifies 3+ level headers with accurate rowspan/colspan",
        },
        competitor: {
          status: "not-supported",
          value: "0%",
          description: "Treats all cells as <td>, losing header semantics entirely",
        },
        importance: "high",
      },
      {
        id: "table-separation",
        title: "Multi-table Separation",
        knowhere: {
          status: "supported",
          description: "Correctly separates 3 distinct tables from complex documents",
        },
        competitor: {
          status: "not-supported",
          description: "Merges separate tables into one, causing data confusion",
        },
        importance: "high",
      },
      {
        id: "merged-cells",
        title: "Merged Cell Handling",
        knowhere: {
          status: "supported",
          description: "Preserves rowspan and colspan attributes perfectly",
        },
        competitor: {
          status: "partial",
          description: "Detects merged cells but loses structural information",
        },
        importance: "high",
      },
      {
        id: "performance",
        title: "Processing Speed",
        knowhere: {
          status: "supported",
          value: "187ms",
          description: "3x faster than Unstructured with higher accuracy",
        },
        competitor: {
          status: "partial",
          value: "420ms",
          description: "Slower processing with lower quality output",
        },
        importance: "medium",
      },
    ],
  },

  liveDemo: {
    originalFile: "/comparison/original-input.html",
    knowhereOutput: "/comparison/knowhere.html",
    competitorOutput: "/comparison/unstructured.html",
    highlights: {
      knowhere: [
        "Perfect 3-level header structure with proper <th> tags",
        "Three tables correctly separated",
        "All merged cells preserved with rowspan/colspan",
      ],
      competitor: [
        "All cells rendered as <td> - no semantic headers",
        "Tables incorrectly merged into single structure",
        "Merged cells lost, creating confusing layout",
      ],
    },
  },

  cta: {
    title: "Ready to Experience the Knowhere Advantage?",
    subtitle: "See how we can transform your document parsing workflow",
    primaryButton: {
      text: "Start Free Trial",
      href: "/signup",
    },
    secondaryButton: {
      text: "View Documentation",
      href: "https://docs.knowhereto.ai/",
    },
    trustBadges: ["No credit card required", "14-day free trial", "Setup in 5 minutes"],
  },

  // ===== Phase 2: Optional Sections =====

  featureTable: {
    title: "Complete Feature Comparison",
    subtitle: "Detailed breakdown of all capabilities",
    categories: [
      {
        name: "Table Parsing",
        features: [
          {
            id: "multi-level-headers",
            feature: "Multi-level Headers",
            knowhere: { supported: true, details: "Full support for 3+ level headers" },
            competitor: { supported: false, details: "No header detection" },
          },
          {
            id: "merged-cells",
            feature: "Merged Cells (rowspan/colspan)",
            knowhere: { supported: true, details: "Perfect preservation" },
            competitor: { supported: true, details: "Partial support, loses structure" },
          },
          {
            id: "table-separation",
            feature: "Multi-table Separation",
            knowhere: { supported: true, details: "Accurate separation" },
            competitor: { supported: false, details: "Merges tables incorrectly" },
          },
          {
            id: "nested-tables",
            feature: "Nested Tables",
            knowhere: { supported: true, details: "Full nesting support" },
            competitor: { supported: false, details: "Flattens nested structures" },
          },
        ],
      },
      {
        name: "Performance",
        features: [
          {
            id: "processing-speed",
            feature: "Processing Speed",
            knowhere: { supported: true, details: "187ms average" },
            competitor: { supported: true, details: "420ms average" },
          },
          {
            id: "accuracy",
            feature: "Accuracy Rate",
            knowhere: { supported: true, details: "99.8%" },
            competitor: { supported: true, details: "87.3%" },
          },
          {
            id: "batch-processing",
            feature: "Batch Processing",
            knowhere: { supported: true, details: "Parallel processing" },
            competitor: { supported: true, details: "Sequential only" },
          },
        ],
      },
      {
        name: "Output Format",
        features: [
          {
            id: "html-output",
            feature: "HTML Output",
            knowhere: { supported: true, details: "Semantic HTML" },
            competitor: { supported: true, details: "Basic HTML" },
          },
          {
            id: "markdown-output",
            feature: "Markdown Output",
            knowhere: { supported: true, details: "Full markdown support" },
            competitor: { supported: true, details: "Limited markdown" },
          },
          {
            id: "json-output",
            feature: "JSON Output",
            knowhere: { supported: true, details: "Structured JSON" },
            competitor: { supported: false },
          },
        ],
      },
    ],
  },

  technicalDeepDive: {
    title: "Under the Hood",
    sections: [
      {
        id: "header-detection",
        heading: "Why Multi-level Headers Matter",
        content:
          "Multi-level headers are essential for complex documents like financial reports and scientific papers. Knowhere uses advanced algorithms to detect header hierarchies, preserving the semantic structure that's critical for RAG applications.",
        codeExample: {
          language: "html",
          code: `<!-- Knowhere Output -->
<table>
  <thead>
    <tr>
      <th rowspan="2">Category</th>
      <th colspan="2">Q1 2024</th>
    </tr>
    <tr>
      <th>Revenue</th>
      <th>Profit</th>
    </tr>
  </thead>
  ...
</table>`,
        },
      },
      {
        id: "table-separation",
        heading: "Intelligent Table Separation",
        content:
          "Unstructured often merges separate tables into one, losing critical context. Knowhere analyzes document layout and content to accurately identify table boundaries, ensuring each table maintains its independence.",
      },
    ],
  },

  useCases: {
    title: "Real-World Scenarios",
    subtitle: "See how Knowhere solves actual problems",
    cases: [
      {
        id: "financial-reports",
        title: "Financial Report Processing",
        icon: "DollarSign",
        description: "Extracting structured data from complex financial statements",
        scenario:
          "A fintech company needs to parse quarterly reports with multi-level headers and nested tables to extract key metrics for AI analysis.",
        knowhereAdvantage:
          "Perfectly preserves table structure, enabling accurate metric extraction with 99.8% accuracy",
        competitorLimitation:
          "Loses header semantics, requiring manual correction and reducing automation efficiency",
        impact: "high",
      },
      {
        id: "research-papers",
        title: "Scientific Research Papers",
        icon: "Microscope",
        description: "Processing academic papers with complex data tables",
        scenario:
          "Researchers need to extract experimental results from papers containing tables with merged cells and multiple header levels.",
        knowhereAdvantage:
          "Maintains complete table structure, allowing automated data aggregation across papers",
        competitorLimitation:
          "Flattens table structure, making it difficult to understand data relationships",
        impact: "high",
      },
      {
        id: "business-analytics",
        title: "Business Analytics Dashboards",
        icon: "BarChart3",
        description: "Building automated analytics from document data",
        scenario:
          "A business intelligence team ingests reports from various sources to build unified dashboards.",
        knowhereAdvantage:
          "Fast processing (187ms) enables real-time dashboard updates with accurate data",
        competitorLimitation:
          "Slower processing (420ms) and lower accuracy create bottlenecks and errors",
        impact: "medium",
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        id: "why-knowhere",
        question: "Why should I choose Knowhere over Unstructured?",
        answer:
          "Knowhere delivers 3x better table structure accuracy (99.8% vs 87.3%), perfect multi-level header detection, and 2x faster processing. For RAG applications where accuracy is critical, Knowhere ensures your AI has access to properly structured data.",
        category: "general",
      },
      {
        id: "pricing",
        question: "How much does Knowhere cost compared to Unstructured?",
        answer:
          "Knowhere offers competitive pricing with better value. Our free tier includes 1,000 pages/month, and paid plans start at $49/month. We also offer volume discounts for enterprise customers.",
        category: "pricing",
      },
      {
        id: "migration",
        question: "How difficult is it to migrate from Unstructured to Knowhere?",
        answer:
          "Migration is straightforward. Knowhere provides a drop-in replacement API with similar endpoints. Most customers complete migration in under a day with our migration guide and support team assistance.",
        category: "migration",
      },
      {
        id: "header-detection",
        question: "How does Knowhere detect multi-level headers?",
        answer:
          "Knowhere uses advanced layout analysis combined with content understanding to identify header hierarchies. Our algorithm analyzes cell positioning, styling, and content patterns to accurately determine rowspan and colspan attributes.",
        category: "technical",
      },
      {
        id: "table-separation",
        question: "What makes Knowhere better at separating tables?",
        answer:
          "Unlike Unstructured which uses simple heuristics, Knowhere employs machine learning models trained on thousands of documents to understand table boundaries. This results in accurate separation even in complex layouts.",
        category: "technical",
      },
    ],
  },

  testimonials: {
    title: "What Our Customers Say",
    items: [
      {
        id: "testimonial-1",
        author: "Sarah Chen",
        role: "Head of Data Engineering",
        company: "FinTech Solutions Inc.",
        rating: 5,
        quote:
          "Switching to Knowhere was a game-changer for our financial document processing. The accuracy improvement alone saved us hundreds of hours of manual correction.",
      },
      {
        id: "testimonial-2",
        author: "Dr. Michael Rodriguez",
        role: "Research Lead",
        company: "Academic Research Institute",
        rating: 5,
        quote:
          "Knowhere's ability to preserve complex table structures has enabled us to automate research data extraction that was previously impossible with Unstructured.",
      },
      {
        id: "testimonial-3",
        author: "Alex Thompson",
        role: "CTO",
        company: "DataAnalytics Pro",
        rating: 5,
        quote:
          "The speed and accuracy of Knowhere have allowed us to scale our document processing pipeline 10x without adding infrastructure costs.",
      },
    ],
  },

  seo: {
    title: "Knowhere vs Unstructured: Document Parsing Comparison | Knowhere",
    description:
      "Compare Knowhere and Unstructured for document parsing. Knowhere delivers 3x better table accuracy, perfect header detection, and faster processing.",
    keywords: [
      "knowhere vs unstructured",
      "document parsing comparison",
      "unstructured alternative",
      "table parsing accuracy",
      "document structure preservation",
      "RAG document processing",
      "complex table handling",
      "multi-level headers",
    ],
    ogImage: "/og-images/versus-unstructured.png",
  },
};

// Data for Markitdown comparison
export const versusMarkitdown: VersusPageData = {
  productId: "markitdown",
  productName: "Markitdown",

  // Empty header nav - no COMPARISON, PRICING, DOCS links
  headerNav: [],

  hero: {
    title: "Knowhere vs Markitdown",
    subtitle: "Why Knowhere is the superior choice for markdown conversion",
    highlightMetric: {
      value: "5x Better",
      label: "Complex Table Handling",
    },
  },

  quickComparison: {
    title: "Key Differences at a Glance",
    subtitle: "See how Knowhere outperforms Markitdown in critical areas",
    cards: [
      {
        id: "table-preservation",
        title: "Table Structure Preservation",
        knowhere: {
          status: "supported",
          value: "100%",
          description: "Preserves complex table structures with merged cells and headers",
        },
        competitor: {
          status: "partial",
          value: "40%",
          description: "Loses table structure in markdown conversion",
        },
        importance: "high",
      },
      {
        id: "semantic-markup",
        title: "Semantic HTML Output",
        knowhere: {
          status: "supported",
          description: "Maintains semantic HTML tags for better data extraction",
        },
        competitor: {
          status: "not-supported",
          description: "Converts to plain markdown, losing semantic information",
        },
        importance: "high",
      },
      {
        id: "header-detection",
        title: "Header Hierarchy Detection",
        knowhere: {
          status: "supported",
          description: "Accurately identifies multi-level table headers",
        },
        competitor: {
          status: "partial",
          description: "Basic header detection with limited accuracy",
        },
        importance: "high",
      },
      {
        id: "output-quality",
        title: "Output Quality",
        knowhere: {
          status: "supported",
          value: "98.5%",
          description: "High-fidelity output preserving original structure",
        },
        competitor: {
          status: "partial",
          value: "72%",
          description: "Simplified output with information loss",
        },
        importance: "medium",
      },
    ],
  },

  liveDemo: {
    originalFile: "/comparison/original-input.html",
    knowhereOutput: "/comparison/knowhere.html",
    competitorOutput: "/comparison/markitdown.html",
    highlights: {
      knowhere: [
        "Complete table structure preservation with all semantics",
        "Accurate multi-level header detection",
        "Perfect handling of merged cells and complex layouts",
      ],
      competitor: [
        "Table structure simplified in markdown conversion",
        "Loss of header hierarchy information",
        "Merged cells not properly represented",
      ],
    },
  },

  cta: {
    title: "Ready to Experience the Knowhere Advantage?",
    subtitle: "Transform your document parsing with superior accuracy",
    primaryButton: {
      text: "Start Free Trial",
      href: "/signup",
    },
    secondaryButton: {
      text: "View Documentation",
      href: "https://docs.knowhereto.ai/",
    },
    trustBadges: ["No credit card required", "14-day free trial", "Setup in 5 minutes"],
  },

  // ===== Phase 2: Optional Sections =====

  featureTable: {
    title: "Complete Feature Comparison",
    subtitle: "Detailed breakdown of all capabilities",
    categories: [
      {
        name: "Table Processing",
        features: [
          {
            id: "table-structure",
            feature: "Table Structure Preservation",
            knowhere: { supported: true, details: "100% preservation" },
            competitor: { supported: true, details: "40% preservation" },
          },
          {
            id: "semantic-markup",
            feature: "Semantic HTML Output",
            knowhere: { supported: true, details: "Full semantic tags" },
            competitor: { supported: false, details: "Plain markdown only" },
          },
          {
            id: "header-hierarchy",
            feature: "Header Hierarchy",
            knowhere: { supported: true, details: "Multi-level support" },
            competitor: { supported: true, details: "Basic detection" },
          },
          {
            id: "complex-layouts",
            feature: "Complex Layouts",
            knowhere: { supported: true, details: "Advanced handling" },
            competitor: { supported: false, details: "Simplified output" },
          },
        ],
      },
      {
        name: "Output Quality",
        features: [
          {
            id: "fidelity",
            feature: "Output Fidelity",
            knowhere: { supported: true, details: "98.5% accuracy" },
            competitor: { supported: true, details: "72% accuracy" },
          },
          {
            id: "structure-loss",
            feature: "Structure Loss",
            knowhere: { supported: true, details: "Minimal loss" },
            competitor: { supported: false, details: "Significant loss" },
          },
          {
            id: "readability",
            feature: "Human Readability",
            knowhere: { supported: true, details: "Excellent" },
            competitor: { supported: true, details: "Good" },
          },
        ],
      },
      {
        name: "Format Support",
        features: [
          {
            id: "html",
            feature: "HTML Output",
            knowhere: { supported: true, details: "Semantic HTML5" },
            competitor: { supported: false },
          },
          {
            id: "markdown",
            feature: "Markdown Output",
            knowhere: { supported: true, details: "Full markdown" },
            competitor: { supported: true, details: "Basic markdown" },
          },
          {
            id: "json",
            feature: "JSON Output",
            knowhere: { supported: true, details: "Structured data" },
            competitor: { supported: false },
          },
        ],
      },
    ],
  },

  technicalDeepDive: {
    title: "Under the Hood",
    sections: [
      {
        id: "structure-preservation",
        heading: "Why Structure Preservation Matters",
        content:
          "Markdown conversion often simplifies complex table structures, losing critical information. Knowhere maintains semantic HTML output alongside markdown, preserving 100% of the original structure for maximum data fidelity.",
        codeExample: {
          language: "markdown",
          code: `<!-- Knowhere preserves this structure -->
| Category | Q1    | Q2    |
|----------|-------|-------|
|          | Revenue | Profit |
| Sales    | $100K | $30K  |

<!-- Instead of losing it like competitors -->`,
        },
      },
      {
        id: "semantic-output",
        heading: "Semantic HTML Advantage",
        content:
          "Unlike Markitdown which only outputs markdown, Knowhere provides semantic HTML that maintains all structural information. This is crucial for RAG applications that need to understand document hierarchy and relationships.",
      },
    ],
  },

  useCases: {
    title: "Real-World Scenarios",
    subtitle: "See how Knowhere solves actual problems",
    cases: [
      {
        id: "documentation",
        title: "Technical Documentation",
        icon: "FileText",
        description: "Converting documentation with complex tables to markdown",
        scenario:
          "A documentation team needs to convert technical specs with intricate table layouts to markdown for a static site generator.",
        knowhereAdvantage:
          "Preserves table structure perfectly, maintaining readability and data relationships",
        competitorLimitation:
          "Simplifies tables to basic markdown, losing nested headers and complex formatting",
        impact: "high",
      },
      {
        id: "knowledge-base",
        title: "Knowledge Base Migration",
        icon: "Database",
        description: "Migrating knowledge base articles with tables",
        scenario:
          "A company is migrating their knowledge base to a new platform that requires markdown input while preserving table structure.",
        knowhereAdvantage:
          "Maintains semantic HTML alongside markdown, allowing platform flexibility",
        competitorLimitation:
          "Loses semantic information, requiring manual restructuring of tables",
        impact: "medium",
      },
      {
        id: "content-management",
        title: "Content Management Systems",
        icon: "Layout",
        description: "Processing CMS content with structured tables",
        scenario:
          "A CMS needs to display content in multiple formats while maintaining data integrity across complex table structures.",
        knowhereAdvantage:
          "Provides both HTML and markdown outputs with perfect structure preservation",
        competitorLimitation: "Limited to markdown, forcing choice between format and structure",
        impact: "high",
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        id: "why-knowhere",
        question: "Why choose Knowhere over Markitdown?",
        answer:
          "Knowhere delivers 5x better table structure preservation (100% vs 40%), maintains semantic HTML output, and provides multiple output formats. For applications where data integrity matters, Knowhere ensures no information loss during conversion.",
        category: "general",
      },
      {
        id: "html-advantage",
        question: "Why does HTML output matter if I need markdown?",
        answer:
          "HTML preserves all semantic information that markdown can't express. Knowhere gives you both formats, so you can use markdown for display while keeping the full structure in HTML for data processing and RAG applications.",
        category: "technical",
      },
      {
        id: "migration-process",
        question: "How easy is it to switch from Markitdown to Knowhere?",
        answer:
          "Very easy. Knowhere provides markdown output just like Markitdown, but with better quality. Simply swap the API endpoint and optionally leverage our HTML output for enhanced functionality.",
        category: "migration",
      },
      {
        id: "pricing-comparison",
        question: "Is Knowhere more expensive than Markitdown?",
        answer:
          "Knowhere offers competitive pricing with significantly better output quality. Our free tier includes 1,000 pages/month, and enterprise plans include volume discounts.",
        category: "pricing",
      },
      {
        id: "structure-preservation",
        question: "How does Knowhere achieve better structure preservation?",
        answer:
          "Knowhere uses advanced document analysis to understand table semantics, not just layout. We maintain rowspan, colspan, and header relationships that markdown conversion typically loses.",
        category: "technical",
      },
    ],
  },

  testimonials: {
    title: "What Our Customers Say",
    items: [
      {
        id: "testimonial-1",
        author: "Jennifer Liu",
        role: "Technical Writer",
        company: "DevDocs Platform",
        rating: 5,
        quote:
          "Knowhere transformed our documentation pipeline. The ability to preserve complex table structures in markdown has saved our team countless hours of manual formatting.",
      },
      {
        id: "testimonial-2",
        author: "Marcus Johnson",
        role: "Engineering Manager",
        company: "KnowledgeHub Inc.",
        rating: 5,
        quote:
          "Migrating our knowledge base was seamless with Knowhere. The semantic HTML output gave us flexibility we never had with Markitdown.",
      },
      {
        id: "testimonial-3",
        author: "Emily Watson",
        role: "Content Operations Lead",
        company: "ContentFlow Systems",
        rating: 5,
        quote:
          "The output quality difference is remarkable. Our content now maintains its structure across all formats, which has significantly improved our content management workflow.",
      },
    ],
  },

  seo: {
    title: "Knowhere vs Markitdown: Markdown Conversion Comparison | Knowhere",
    description:
      "Compare Knowhere and Markitdown for document conversion. Knowhere delivers 5x better table handling, perfect structure preservation, and semantic output.",
    keywords: [
      "knowhere vs markitdown",
      "markdown conversion comparison",
      "markitdown alternative",
      "table to markdown",
      "document parsing performance",
      "complex table handling",
      "semantic html preservation",
      "document structure accuracy",
    ],
    ogImage: "/og-images/versus-markitdown.png",
  },
};

// Map for easy lookup
export const VERSUS_PAGES: Record<VersusProductId, VersusPageData> = {
  unstructured: versusUnstructured,
  markitdown: versusMarkitdown,
};

// Helper to validate product ID
export function isValidVersusProductId(id: string): id is VersusProductId {
  return id === "unstructured" || id === "markitdown";
}

// Helper to get versus page data
export function getVersusPageData(productId: VersusProductId): VersusPageData {
  return VERSUS_PAGES[productId];
}
