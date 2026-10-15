---
title: PAIOS (personal AI operating system)
source: https://github.com/rishivendhan84/personal_AI
---

# PAIOS: personal AI operating system

## What it is

A single-user personal command center designed around a loop: capture, direct, execute, report, adapt. Live at https://rishi-personal-os.vercel.app

## What works today

On the live deployment, the tasks, goals and habits cards work, along with the calendar and finance cards, which read Google Calendar (read-only) and Google Sheets. Capture through a Telegram bot (text and voice, auto-filed) and the "Direction Engine" that builds daily briefs and prioritizes are designed and part of the codebase, but are not presented as working on the live site yet.

## Design principles enforced in code

- No AI on page load: pages read the latest cached snapshot; AI runs only on capture, manual refresh or schedule.
- AI turns fuzzy text into structure; deterministic code computes every number (net worth, prioritization scores).
- Provider choice lives in one place behind a primary / fallback interface, free-first with OpenAI as paid fallback, so no feature knows which model answered.
- Missing keys degrade gracefully instead of crashing a page.
- Every auto-filed capture is confirmable ("reply 'fix' to change").

## Stack

Live: Next.js 15 (App Router), TypeScript, Tailwind; Supabase Postgres with pgvector; Google Calendar and Google Sheets APIs. In the codebase for the capture and brief pipeline: Upstash QStash for scheduling and async capture; Telegram Bot API; Groq Whisper with OpenAI whisper-1 fallback for speech-to-text; Groq Llama, Gemini and OpenAI models for classification and briefs; Gemini text-embedding-004 embeddings. Designed to run at $0 a month for one user.
