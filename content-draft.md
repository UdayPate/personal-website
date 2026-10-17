# Udayverse — Site Content (Phase 2 draft)

Every number below comes from Uday's resume or his own project notes; do not add new claims.

## Site basics
- Name: Uday Patel
- Pitch (opening scene): Engineer by training, product thinker by habit. I build systems that people actually use.
- Subtitle: Data · AI · Software · Product | MS @ SJSU
- About: I'm a master's student in Applied Data Intelligence at San José State University (graduating Dec 2027), with a BS in Computer Science from UC Santa Cruz. I work across data, AI, software, and product: dbt pipelines and warehouses, LLM agents grounded in real statistics, and mobile and web apps where I led the product design. Most recently I was a GTM Data Analyst Intern at Everlaw, where my benchmarking dashboard moved to staging for company-wide rollout.
- Links: GitHub https://github.com/UdayPate · LinkedIn https://www.linkedin.com/in/upatelda/ · Email pateluday0308@gmail.com
- Resume: public/resume.pdf

## Pipeline order
| Stage | Character | Station |
|---|---|---|
| Intro | fragments fly in | Name + pitch |
| 1. Extract | glitchy 1-bit blob | AisleSave |
| Checkpoint | — | GroovyWeb (2024) |
| 2. Transform | 8-bit sprite | Airbnb Medallion Pipeline |
| 3. Load | 16-bit sprite | Apple Sales & Warranty Platform |
| Checkpoint | — | Everlaw (2026) |
| 4. Serve | final pixel Uday | Data Lens |
| 5. Query | LOAD COMPLETE | AI Cricket Intelligence + Ask Uday terminal |

/projects list view includes everything above plus Cravely.

---

## Stage 1 · Extract — AisleSave (May 2026)
- Problem: Grocery prices are locked inside paper receipts, so shoppers can't compare them.
- Built: A mobile app that extracts line items from receipt photos with OCR, then normalizes item names, removes duplicates, and compares prices across stores. A rule-based trust score shows how reliable each data point is. I owned product design and data processing on a two-person team.
- Tech: React Native, Node/Express, PostgreSQL (Supabase), OCR, PostHog
- Highlight: Handles 20–60 line items per receipt; tested on ~200 real receipts
- Status: complete

## Checkpoint — GroovyWeb, Data Analytics Apprentice (Jul–Sep 2024)
- Analyzed a landing-page A/B test and recommended the higher-converting design
- Wrote SQL joining data across multiple business systems for recurring client reports
- Built client-facing Tableau dashboards in an Agile/Scrum team

## Stage 2 · Transform — Airbnb Data Engineering Pipeline & Graph Recommender (Mar 2026)
- Problem: Raw booking files aren't usable for analytics or recommendations until they're cleaned, modeled, and versioned.
- Built: Staged files in S3, loaded them into Snowflake, and built a Bronze/Silver/Gold Medallion pipeline in dbt with SCD Type 2 history and a star-schema Gold layer. Exported the Gold layer to Neo4j and served item-based collaborative-filtering recommendations through a Flask REST API.
- Tech: Snowflake, dbt, AWS S3, SQL, Python, Neo4j, Flask
- Highlight: 11 incremental dbt models · 1,189-node / 5,500-relationship graph · 6 API endpoints

## Stage 3 · Load — Apple Sales & Warranty Analytics Platform (Jan 2026)
- Problem: Analyzing sales and warranty claims together across a million-plus records needs a solid schema and fast queries.
- Built: A normalized 5-table PostgreSQL database, 16+ analytical queries using CTEs and window functions, demand forecasting via linear regression written in pure SQL (validated against scikit-learn), and a multi-page Streamlit dashboard.
- Tech: PostgreSQL, SQL, Streamlit, Plotly
- Highlight: 1M+ records · 85–97% query speedups from indexing

## Checkpoint — Everlaw, GTM Data Analyst Intern (Jun–Aug 2026)
- Shipped a first-of-its-kind post-sales benchmarking dashboard across ~1,000 accounts; validated with stakeholders and moved to staging for company-wide rollout
- Built a dbt model unifying Salesforce, Gainsight, and existing dbt models into one account-level view
- Built 4 Tableau dashboards whose insights the CMO and CEO presented at the quarterly all-hands; rebuilt them in Looker (LookML) for a reporting-stack evaluation
- Fixed broken sales-attribution logic in production dbt models

## Stage 4 · Serve — Data Lens: Automated Dashboard Recommendation Platform (Aug 2026)
- Problem: Teams build dashboards ad hoc, with no systematic way to know what's worth visualizing (a gap I saw firsthand at Everlaw).
- Built: An Airflow-orchestrated pipeline that ingests any CSV/JSON/Parquet dataset into S3 and builds analysis-ready tables with Glue/PySpark and dbt plus data-quality tests; a distributed PySpark profiling engine computing real statistics (chi-square, correlations with p-values, changepoints); and an LLM agent layer that recommends charts grounded only in that statistical evidence, evaluated on precision, recall, and faithfulness.
- Tech: PySpark, AWS (S3, Glue, Athena), Airflow, dbt, Python, LLM agents
- Highlight: Profiling cut from 8 minutes to 90 seconds · 15 datasets across 3 domains · up to 1M rows
- Status: complete

## Stage 5 · Query — AI Cricket Intelligence Platform (Sep 2025)
- Problem: Fans and analysts want cricket predictions they can trust and understand.
- Built: LSTM and Transformer models predicting IPL player runs, wickets, and win probability; a RAG pipeline over player, team, venue, and match data; and LLM-generated explanations in a Streamlit dashboard.
- Tech: Python, PyTorch, Transformers, RAG, PostgreSQL, FastAPI, Streamlit
- Highlight: Transformer reached 15.7 runs MAE vs. 18.4 for LSTM

## /projects only — Cravely: Recipe Discovery Web App (Mar 2025)
- Led design and implementation of a full-stack recipe platform with RESTful APIs, authentication, image handling, and TheMealDB data.
- Tech: Py4Web, Vue.js, PostgreSQL, HTML/CSS
