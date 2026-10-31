---
title: "AisleSave"
dates: "May 2026"
problem: "Grocery prices are locked inside paper receipts, so shoppers can't compare them."
pipelineStage: 1
summary:
  - "Extracts line items from receipt photos with OCR"
  - "Normalizes item names, removes duplicates, and compares prices across stores"
  - "Rule-based trust score shows how reliable each data point is"
  - "Owned product design and data processing on a two-person team"
tech:
  - "React Native"
  - "Node/Express"
  - "PostgreSQL (Supabase)"
  - "OCR"
  - "PostHog"
highlight: "Handles 20–60 line items per receipt; tested on ~200 real receipts"
---

A mobile app that extracts line items from receipt photos with OCR, then normalizes item names, removes duplicates, and compares prices across stores. A rule-based trust score shows how reliable each data point is. I owned product design and data processing on a two-person team.
