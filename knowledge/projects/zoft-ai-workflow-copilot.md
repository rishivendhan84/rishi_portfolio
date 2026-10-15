---
title: AI Workflow Copilot (Zoft AI take-home)
source: https://github.com/rishivendhan84/Zoft-assignment
---

# AI Workflow Copilot

## What it is

A take-home assignment Rishi built for Zoft AI: an AI copilot that lets users create, modify, debug and understand automation workflows (Zapier / n8n style) through natural-language chat. It was evaluated on engineering judgment over feature completeness.

## The core idea

The AI never mutates persistent state. It is a planner that proposes operations; a deterministic, code-only validator checks them against a database-driven node catalog; only valid operations commit as a new immutable workflow version. Invalid proposals trigger a bounded repair loop and are never persisted. This one pattern covers safety, versioning, explainability ("why did you change that?") and adding new node types without a redeploy, because the node catalog is data, not code, and the agent retrieves node types through RAG and tools.

## Architecture

- Agent: a LangGraph state machine: plan, retrieve nodes, propose operations, validate, repair, commit, explain, emitting progress at each step.
- Persistence: PostgreSQL holds workflows, immutable versions, conversations, runs and the node catalog. Commits are optimistic-concurrency safe (compare-and-swap on the workflow head).
- Async: the API returns 202 with a run id and runs a background task; progress flows over a pluggable event bus (in-memory or Redis pub/sub with replay).
- Streaming: SSE from server to client, with cancellation as a separate endpoint.
- The LLM provider chain ends in a deterministic scripted provider, so the full demo runs offline with no API keys, and a real model (Anthropic) can sit at the front with the scripted provider as failover.

## Testing

33 backend tests, including a full end-to-end run of the reference conversation over REST and SSE, hallucination repair, timeout failure, concurrent-edit conflict and SSE replay. The suite runs unchanged against SQLite and Postgres. Demo levers in chat (`!hallucinate`, `!timeout`) show the validator rejecting a non-existent node and a clean failure on a hung provider.

## Stack

Python, FastAPI, LangGraph, PostgreSQL, Redis; React, Vite, Tailwind CSS; Docker Compose.
