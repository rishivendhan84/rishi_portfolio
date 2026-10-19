---
title: VitaLens (food-image nutrition analyzer)
source: https://github.com/rishivendhan84/VitaLens
---

# VitaLens: food-image nutrition analyzer

## What it is

VitaLens is an independent project: a web-first freemium SaaS where a user photographs a meal and gets a macro and nutrient breakdown, logged to a daily diary. A vision LLM identifies the foods and estimates portions as strict JSON, then each item is grounded against a real nutrition database (Nutritionix with automatic USDA FoodData Central fallback). The LLM never does the macro math; deterministic code multiplies database values by portion. The product bet is what happens after the scan: the diary data builds toward coaching over time. The repo is the v1 / MVP codebase; there is no public deployment on record.

## Architecture

Photo, then image optimizer (downscale and re-encode with Pillow, 5 to 20 times smaller payload), then vision LLM (strict JSON), then parallel nutrition lookups with a shared TTL cache, then the macro service, then an editable result where the user adjusts portions and macros recalculate live, then the daily diary. The vision provider is pluggable (Gemini, OpenAI or Anthropic): a cheap model for free scans and an optional stronger model only for paid scans.

## Engineering decisions

- Grounding macros in a database instead of trusting LLM arithmetic is more accurate, cheaper per scan and more defensible.
- Scan latency is treated as the product: image preprocessing, concurrent lookups so latency equals the slowest lookup, a process-wide cache for repeated foods, pooled HTTP with exponential-backoff retries on 429 and 5xx errors.
- Graceful degradation: Nutritionix outages fall back to USDA; a provider hiccup retries before failing the scan.
- Explicit health-data consent flow gates data use from day one.

## Stack

FastAPI, Python 3.11+, SQLAlchemy 2.0, Alembic, PostgreSQL 15; React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, TanStack Query; JWT auth with bcrypt and Google OAuth; Stripe checkout, customer portal and webhooks; S3-compatible image storage; Docker, docker-compose and GitHub Actions CI; pytest and ruff.
