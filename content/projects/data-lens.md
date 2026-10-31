---
title: "Data Lens: Automated Dashboard Recommendation Platform"
dates: "Aug 2026"
problem: "Teams build dashboards ad hoc, with no systematic way to know what's worth visualizing (a gap I saw firsthand at Everlaw)."
pipelineStage: 4
summary:
  - "Airflow-orchestrated pipeline ingests CSV/JSON/Parquet datasets into S3 and builds analysis-ready tables with Glue/PySpark and dbt"
  - "Distributed PySpark profiling engine computes chi-square, correlations with p-values, and changepoints"
  - "LLM agent recommends charts grounded only in that statistical evidence"
tech:
  - "PySpark"
  - "AWS (S3, Glue, Athena)"
  - "Airflow"
  - "dbt"
  - "Python"
  - "LLM agents"
highlight: "Profiling cut from 8 minutes to 90 seconds · 15 datasets across 3 domains · up to 1M rows"
---

An Airflow-orchestrated pipeline that ingests any CSV/JSON/Parquet dataset into S3 and builds analysis-ready tables with Glue/PySpark and dbt plus data-quality tests; a distributed PySpark profiling engine computing real statistics (chi-square, correlations with p-values, changepoints); and an LLM agent layer that recommends charts grounded only in that statistical evidence, evaluated on precision, recall, and faithfulness.
