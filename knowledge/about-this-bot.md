---
title: About this chatbot
source: https://github.com/rishivendhan84/rishi_portfolio
---

# About this chatbot

## How does this chatbot work?

This assistant is a retrieval-augmented generation (RAG) system Rishi built for his portfolio. His own write-ups (this profile, his experience and his project READMEs) are split into chunks and embedded ahead of time. For each question it runs hybrid retrieval, combining vector similarity with BM25 keyword search through Reciprocal Rank Fusion, then answers with OpenAI's gpt-4o-mini using only the retrieved passages, citing each source. If nothing relevant is retrieved, it says so instead of guessing. The corpus is small, so the index is searched in memory rather than in a vector database; past roughly ten thousand chunks the plan is to move to pgvector with an HNSW index.

[CONFIRM before ingest: update this answer to match what was actually built, and add the latest eval numbers.]
