export type ProjectLinks = {
  github?: string;
  demo?: string;
  screenshots?: string;
};

export type Project = {
  slug: string;
  title: string;
  dates?: string;
  problem?: string;
  built: string;
  tech: string[];
  highlight?: string;
  links?: ProjectLinks;
  /** Shown on /projects only, not in the pipeline. */
  projectsOnly?: boolean;
};

export type Checkpoint = {
  slug: string;
  title: string;
  dates: string;
  bullets: string[];
};

export const projects: Project[] = [
  {
    slug: "aislesave",
    title: "AisleSave",
    problem:
      "Grocery prices are locked inside paper receipts, so shoppers can't compare them.",
    built:
      "A mobile app that extracts line items from receipt photos with OCR, then normalizes item names, removes duplicates, and compares prices across stores. A rule-based trust score shows how reliable each data point is. I owned product design and data processing on a two-person team.",
    tech: ["React Native", "Node/Express", "PostgreSQL (Supabase)", "OCR", "PostHog"],
    highlight: "Handles 20–60 line items per receipt; tested on ~200 real receipts",
  },
  {
    slug: "airbnb-pipeline",
    title: "Airbnb Data Engineering Pipeline & Graph Recommender",
    dates: "Mar 2026",
    problem:
      "Raw booking files aren't usable for analytics or recommendations until they're cleaned, modeled, and versioned.",
    built:
      "Staged files in S3, loaded them into Snowflake, and built a Bronze/Silver/Gold Medallion pipeline in dbt with SCD Type 2 history and a star-schema Gold layer. Exported the Gold layer to Neo4j and served item-based collaborative-filtering recommendations through a Flask REST API.",
    tech: ["Snowflake", "dbt", "AWS S3", "SQL", "Python", "Neo4j", "Flask"],
    highlight: "11 incremental dbt models · 1,189-node / 5,500-relationship graph · 6 API endpoints",
  },
  {
    slug: "apple-platform",
    title: "Apple Sales & Warranty Analytics Platform",
    dates: "Jan 2026",
    problem:
      "Analyzing sales and warranty claims together across a million-plus records needs a solid schema and fast queries.",
    built:
      "A normalized 5-table PostgreSQL database, 16+ analytical queries using CTEs and window functions, demand forecasting via linear regression written in pure SQL (validated against scikit-learn), and a multi-page Streamlit dashboard.",
    tech: ["PostgreSQL", "SQL", "Streamlit", "Plotly"],
    highlight: "1M+ records · 85–97% query speedups from indexing",
  },
  {
    slug: "data-lens",
    title: "Data Lens: Automated Dashboard Recommendation Platform",
    problem:
      "Teams build dashboards ad hoc, with no systematic way to know what's worth visualizing (a gap I saw firsthand at Everlaw).",
    built:
      "An Airflow-orchestrated pipeline that ingests any CSV/JSON/Parquet dataset into S3 and builds analysis-ready tables with Glue/PySpark and dbt plus data-quality tests; a distributed PySpark profiling engine computing real statistics (chi-square, correlations with p-values, changepoints); and an LLM agent layer that recommends charts grounded only in that statistical evidence, evaluated on precision, recall, and faithfulness.",
    tech: ["PySpark", "AWS (S3, Glue, Athena)", "Airflow", "dbt", "Python", "LLM agents"],
    highlight: "Profiling cut from 8 minutes to 90 seconds · 15 datasets across 3 domains · up to 1M rows",
  },
  {
    slug: "cricket-intelligence",
    title: "AI Cricket Intelligence Platform",
    dates: "Sep 2025",
    problem: "Cricket predictions are more useful when they're accurate and explained.",
    built:
      "LSTM and Transformer models predicting IPL player runs, wickets, and win probability; a RAG pipeline over player, team, venue, and match data; and LLM-generated explanations in a Streamlit dashboard.",
    tech: ["Python", "PyTorch", "Transformers", "RAG", "PostgreSQL", "FastAPI", "Streamlit"],
    highlight: "Transformer reached 15.7 runs MAE vs. 18.4 for LSTM",
  },
  {
    slug: "cravely",
    title: "Cravely: Recipe Discovery Web App",
    dates: "Mar 2025",
    built:
      "Led design and implementation of a full-stack recipe platform with RESTful APIs, authentication, image handling, and TheMealDB data.",
    tech: ["Py4Web", "Vue.js", "PostgreSQL", "HTML/CSS"],
    projectsOnly: true,
  },
];

export const checkpoints: Checkpoint[] = [
  {
    slug: "groovyweb",
    title: "GroovyWeb, Data Analytics Apprentice",
    dates: "Jul–Sep 2024",
    bullets: [
      "Analyzed a landing-page A/B test and recommended the higher-converting design",
      "Wrote SQL joining data across multiple business systems for recurring client reports",
      "Built client-facing Tableau dashboards in an Agile/Scrum team",
    ],
  },
  {
    slug: "everlaw",
    title: "Everlaw, GTM Data Analyst Intern",
    dates: "Jun–Aug 2026",
    bullets: [
      "Shipped a first-of-its-kind post-sales benchmarking dashboard across ~1,000 accounts; validated with stakeholders and moved to staging for company-wide rollout",
      "Built a dbt model unifying Salesforce, Gainsight, and existing dbt models into one account-level view",
      "Built 4 Tableau dashboards whose insights the CMO and CEO presented at the quarterly all-hands; rebuilt them in Looker (LookML) for a reporting-stack evaluation",
      "Fixed broken sales-attribution logic in production dbt models",
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
export function getCheckpoint(slug: string) {
  return checkpoints.find((c) => c.slug === slug);
}
