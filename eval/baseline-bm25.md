# Retrieval eval

- Run: 2026-10-15T11:15:34.810Z
- Mode: **bm25** (keyword baseline, no embeddings)
- Index: 54 chunks, built 2026-10-15T11:14:17.821Z, DRAFT (skipped about-this-bot.md)
- Config: top 5, 20 candidates per retriever, RRF k=60, gate minBm25=4

| Metric | Result | Target |
|---|---|---|
| hit@5 (answerable + declined, n=25) | 92% (23/25) | 90% |
| MRR | 0.758 | |
| Relevance gate correct (n=30) | 83% (25/30) | 100% |
| Adversarial (answer-level) | 5 rows, run in phase 3 | |

| id | type | question | rank | gate | top BM25 | top cosine | top chunk | |
|---|---|---|---|---|---|---|---|---|
| a01 | answerable | Has he shipped a RAG system in production? | 2 | pass | 7.29 | - | experience#minsway-solutions-pvt-ltd-software-engineer-december-2021-to-may-2025-chennai | ok |
| a02 | answerable | What did he build with LangGraph? | 3 | stop | 3.17 | - | projects/zoft-ai-workflow-copilot#stack | MISS |
| a03 | answerable | How many years of experience does he have? | 1 | stop | 3.93 | - | profile#summary | MISS |
| a04 | answerable | Where does he work right now? | 5 | stop | 3.52 | - | profile#how-he-works | MISS |
| a05 | answerable | What was the production planning system and what stack did it use? | 1 | pass | 9.38 | - | experience#production-planning-system-different-hair | ok |
| a06 | answerable | How did he make the Monad APIs faster? | 1 | pass | 8.55 | - | experience#monad-saudi-b2b-wholesale-platform-minsway | ok |
| a07 | answerable | Tell me about the single sign-on platform with multiple tenants | 1 | pass | 14.06 | - | experience#multi-tenant-sso-platform-minsway | ok |
| a08 | answerable | Which vector databases has he used? | 1 | pass | 6.62 | - | skills#databases | ok |
| a09 | answerable | How does VitaLens get accurate macros from a food photo? | 1 | pass | 10.60 | - | projects/vitalens#architecture | ok |
| a10 | answerable | How does the workflow copilot stop the LLM from corrupting saved workflows? | 4 | pass | 5.56 | - | projects/zoft-ai-workflow-copilot#what-it-is | ok |
| a11 | answerable | How was the Zoft take-home tested? | 3 | pass | 9.71 | - | projects/zoft-ai-workflow-copilot#what-it-is | ok |
| a12 | answerable | How does the multiplayer UNO and chess work in Fun Friday? | 3 | pass | 13.36 | - | projects/fun-friday-arena#what-it-is | ok |
| a13 | answerable | What is PAIOS and what works on it today? | 1 | pass | 8.55 | - | projects/paios#what-works-today | ok |
| a14 | answerable | Which agent automates SEO reporting from Search Console? | 1 | pass | 15.90 | - | experience#seo-analytics-agent | ok |
| a15 | answerable | How was this portfolio website built? | 1 | pass | 6.60 | - | projects/rishi-portfolio#what-it-is | ok |
| a16 | answerable | What is his educational background? | - | stop | 1.99 | - | projects/zoft-ai-workflow-copilot#architecture | MISS |
| a17 | answerable | Which certifications does he hold? | 1 | pass | 4.75 | - | profile#certifications | ok |
| a18 | answerable | How can I contact him? | 1 | pass | 7.24 | - | faq#how-to-contact-rishi | ok |
| a19 | answerable | Is he looking for a new job? | - | pass | 4.07 | - | projects/zoft-ai-workflow-copilot#the-core-idea | MISS |
| a20 | answerable | What is the wedding marketplace project? | 1 | pass | 7.58 | - | projects/happy-wedding-marketplace#what-it-is | ok |
| a21 | answerable | Does he know MCP? | 1 | stop | 3.89 | - | skills#genai-and-ai-engineering | MISS |
| a22 | answerable | What is the github-resources repo and is it still updated daily? | 1 | pass | 11.42 | - | projects/github-resources#status | ok |
| a23 | answerable | What time zone is he in? | 1 | pass | 7.24 | - | faq#location-and-time-zone | ok |
| d01 | declined | What salary does he expect? | 1 | pass | 4.44 | - | faq#questions-the-assistant-cannot-answer | ok |
| d02 | declined | What is his notice period? | 1 | pass | 8.88 | - | faq#questions-the-assistant-cannot-answer | ok |
| u01 | unanswerable | Has he worked with Kubernetes? | - | stop | 3.89 | - | skills#genai-and-ai-engineering | ok |
| u02 | unanswerable | Can he write Rust or Go? | - | stop | 3.60 | - | projects/happy-wedding-marketplace#what-it-is | ok |
| u03 | unanswerable | What is his favorite movie? | - | stop | 0.00 | - | - | ok |
| u04 | unanswerable | Has he used Django or Laravel? | - | stop | 3.11 | - | projects/microsaas-template#what-it-is | ok |
| u05 | unanswerable | What's the weather like in Mumbai? | - | stop | 0.00 | - | - | ok |
