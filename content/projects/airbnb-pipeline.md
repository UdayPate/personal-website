---
title: "Airbnb Data Engineering Pipeline & Graph Recommender"
dates: "Mar 2026"
problem: "Raw booking files aren't usable for analytics or recommendations until they're cleaned, modeled, and versioned."
pipelineStage: 2
summary:
  - "Bronze/Silver/Gold Medallion pipeline in dbt on Snowflake, with SCD Type 2 history and a star-schema Gold layer"
  - "Gold layer exported to Neo4j, serving item-based collaborative-filtering recommendations through a Flask REST API"
tech:
  - "Snowflake"
  - "dbt"
  - "AWS S3"
  - "SQL"
  - "Python"
  - "Neo4j"
  - "Flask"
highlight: "11 incremental dbt models · 1,189-node / 5,500-relationship graph · 6 API endpoints"
---

Staged files in S3, loaded them into Snowflake, and built a Bronze/Silver/Gold Medallion pipeline in dbt with SCD Type 2 history and a star-schema Gold layer. Exported the Gold layer to Neo4j and served item-based collaborative-filtering recommendations through a Flask REST API.
