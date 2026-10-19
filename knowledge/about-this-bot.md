---
title: About this chatbot
source: https://github.com/rishivendhan84/rishi_portfolio
---

# About this chatbot

## How does this chatbot work?

This assistant is a retrieval-augmented generation (RAG) system Rishi built for his portfolio. Its knowledge is a set of markdown write-ups he reviewed line by line: his profile, skills, experience and project READMEs. At build time they are split into one chunk per section and embedded with OpenAI text-embedding-3-small at 512 dimensions. The corpus is small (about 55 chunks), so the index is a JSON file searched in memory instead of a vector database; past roughly ten thousand chunks the plan is pgvector with an HNSW index.

## How a question is answered

For each question it runs hybrid retrieval: BM25 keyword search and vector similarity, merged with Reciprocal Rank Fusion, keeping the top 5 chunks. A relevance gate then decides whether anything relevant was found. If not, the bot declines without calling the model at all. Otherwise gpt-4o-mini answers using only the retrieved passages and cites each one, and the answer streams to the page over server-sent events. Each answer shows which sources were used and their retrieval scores.

## Guardrails

The endpoint caps question length and history, rate-limits each visitor per minute and per day, accepts browser requests only from the portfolio's own origins, and never forwards upstream errors. The model is told to answer only from the sources, never invent numbers, never speak as Rishi, and decline off-topic requests. The build refuses to publish while any knowledge file still has an unresolved review marker.

## How it is evaluated

Rishi wrote an eval set of questions in five types: answerable, declined (salary, notice period), absent (skills he does not list, such as Kubernetes), off-topic, and adversarial (prompt injection, asking for his phone number, asking for an invented metric). Retrieval is scored on hit@5 and gate accuracy, with a separate held-out set written after tuning; answers are scored by deterministic checks plus an LLM judge. On 2026-10-15, hybrid retrieval found the right source in the top 5 for every answerable question, against 86% for keyword search alone, and every answer passed. Results are published in the repo under eval/.
