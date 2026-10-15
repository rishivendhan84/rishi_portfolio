---
title: MicroSaaS agent template
source: https://github.com/rishivendhan84/Micro-SAAS-agent
---

# MicroSaaS agent template

## What it is

A template for building a full-stack SaaS with parallel AI coding agents. The user defines the product in INITIAL.md, generates an implementation blueprint (a "PRP") with a `/generate-prp` command, then builds it with `/execute-prp`. It is a context-engineering workflow: project rules live in CLAUDE.md, code patterns in five skill files (backend, frontend, database, testing, deployment) and roles in agent definition files. Rishi used the same workflow to scaffold VitaLens.

## How the build runs

- Phase 1, in parallel: a database agent (models and migrations), a backend agent (API structure), a frontend agent (React setup) and a DevOps agent (Docker and CI).
- Phase 2, per module: backend endpoints, then frontend pages.
- Phase 3, in parallel: a test agent and a review agent that runs a security audit.

## Target stack it generates

FastAPI with Python 3.11+, React with TypeScript and Vite, PostgreSQL with SQLAlchemy and Alembic, JWT and Google OAuth, Docker and GitHub Actions.
