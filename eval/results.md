# Retrieval eval

- Run: 2026-10-15T11:55:40.856Z
- Mode: **hybrid**
- Index: 58 chunks, built 2026-10-15T11:55:29.366Z
- Config: top 5, 20 candidates per retriever, RRF k=60, gate strongCosine=0.4, minCosine=0.3 with BM25>=1, bm25Override=8

| Set | hit@5 | MRR | Relevance gate correct |
|---|---|---|---|
| Tuned on | 100% (30/30) | 0.804 | 100% (32/32) |
| Held out (written after tuning) * | 100% (2/2) | 1.000 | 100% (6/6) |

Targets: hit@5 90%, gate 100%. Adversarial rows (6) test answers, not retrieval, and run in phase 3.

| id | type | question | rank | gate | top BM25 | top cosine | top chunk | |
|---|---|---|---|---|---|---|---|---|
| a01 | answerable | Has he shipped a RAG system in production? | 2 | pass | 7.56 | 0.492 | experience#production-planning-system-different-hair | ok |
| a02 | answerable | What did he build with LangGraph? | 2 | pass | 3.29 | 0.459 | skills#genai-and-ai-engineering | ok |
| a03 | answerable | How many years of experience does he have? | 1 | pass | 4.06 | 0.416 | profile#summary | ok |
| a04 | answerable | Where does he work right now? | 3 | pass | 3.40 | 0.426 | profile#how-he-works | ok |
| a05 | answerable | What was the production planning system and what stack did it use? | 1 | pass | 9.73 | 0.717 | experience#production-planning-system-different-hair | ok |
| a06 | answerable | How did he make the Monad APIs faster? | 1 | pass | 8.83 | 0.583 | experience#monad-saudi-b2b-wholesale-platform-minsway | ok |
| a07 | answerable | Tell me about the single sign-on platform with multiple tenants | 1 | pass | 14.56 | 0.663 | experience#multi-tenant-sso-platform-minsway | ok |
| a08 | answerable | Which vector databases has he used? | 1 | pass | 5.91 | 0.595 | skills#databases | ok |
| a09 | answerable | How does VitaLens get accurate macros from a food photo? | 1 | pass | 11.05 | 0.710 | projects/vitalens#architecture | ok |
| a10 | answerable | How does the workflow copilot stop the LLM from corrupting saved workflows? | 2 | pass | 5.82 | 0.533 | projects/zoft-ai-workflow-copilot#what-it-is | ok |
| a11 | answerable | How was the Zoft take-home tested? | 2 | pass | 10.10 | 0.512 | projects/zoft-ai-workflow-copilot#what-it-is | ok |
| a12 | answerable | How does the multiplayer UNO and chess work in Fun Friday? | 3 | pass | 13.91 | 0.520 | projects/fun-friday-arena#what-it-is | ok |
| a13 | answerable | What is PAIOS and what works on it today? | 1 | pass | 8.69 | 0.642 | projects/paios#what-works-today | ok |
| a14 | answerable | Which agent automates SEO reporting from Search Console? | 1 | pass | 16.04 | 0.762 | experience#seo-analytics-agent | ok |
| a15 | answerable | How was this portfolio website built? | 1 | pass | 6.07 | 0.687 | projects/rishi-portfolio#what-it-is | ok |
| a16 | answerable | What is his educational background? | 4 | pass | 2.08 | 0.384 | projects/rishi-portfolio#how-it-is-built | ok |
| a17 | answerable | Which certifications does he hold? | 1 | pass | 4.88 | 0.549 | profile#certifications | ok |
| a18 | answerable | How can I contact him? | 1 | pass | 7.50 | 0.490 | faq#how-to-contact-rishi | ok |
| a19 | answerable | Is he looking for a new job? | 2 | pass | 4.22 | 0.444 | projects/zoft-ai-workflow-copilot#the-core-idea | ok |
| a20 | answerable | What is the wedding marketplace project? | 1 | pass | 7.85 | 0.651 | projects/happy-wedding-marketplace#what-it-is | ok |
| a21 | answerable | Does he know MCP? | 1 | pass | 4.02 | 0.344 | skills#genai-and-ai-engineering | ok |
| a22 | answerable | What is the github-resources repo and is it still updated daily? | 1 | pass | 11.64 | 0.658 | projects/github-resources#status | ok |
| a23 | answerable | What time zone is he in? | 1 | pass | 7.32 | 0.427 | faq#location-and-time-zone | ok |
| d01 | declined | What salary does he expect? | 1 | pass | 3.94 | 0.463 | faq#questions-the-assistant-cannot-answer | ok |
| d02 | declined | What is his notice period? | 1 | pass | 7.87 | 0.517 | faq#questions-the-assistant-cannot-answer | ok |
| u01 | absent | Has he worked with Kubernetes? | 1 | pass | 4.02 | 0.493 | skills#genai-and-ai-engineering | ok |
| u02 | absent | Can he write Rust or Go? | 2 | pass | 3.21 | 0.448 | projects/happy-wedding-marketplace#what-it-is | ok |
| u03 | unanswerable | What is his favorite movie? | - | stop | 0.00 | 0.230 | projects/rishi-portfolio#what-it-is | ok |
| u04 | absent | Has he used Django or Laravel? | 5 | pass | 2.78 | 0.407 | projects/microsaas-template#what-it-is | ok |
| u05 | unanswerable | What's the weather like in Mumbai? | - | stop | 0.00 | 0.345 | faq#location-and-time-zone | ok |
| h01* | unanswerable | Who won the last cricket world cup? | - | stop | 0.00 | 0.187 | faq#location-and-time-zone | ok |
| h02* | unanswerable | What is the capital of France? | - | stop | 0.00 | 0.141 | projects/fun-friday-arena#what-it-is | ok |
| h03* | unanswerable | Can you recommend a good laptop under 50000 rupees? | - | stop | 3.09 | 0.296 | experience#monad-saudi-b2b-wholesale-platform-minsway | ok |
| h04* | unanswerable | Write me a SQL query that joins two tables. | - | stop | 4.44 | 0.242 | skills#languages | ok |
| h05* | answerable | Has he built anything with Socket.IO? | 1 | pass | 7.07 | 0.460 | projects/fun-friday-arena#stack | ok |
| h06* | answerable | Which projects use Stripe for payments? | 1 | pass | 3.51 | 0.359 | projects/vitalens#stack | ok |
| a24 | answerable | How does this chatbot work? | 1 | pass | 4.75 | 0.669 | about-this-bot#how-does-this-chatbot-work | ok |
| a25 | answerable | How is this bot evaluated? | 1 | pass | 3.31 | 0.710 | about-this-bot#how-it-is-evaluated | ok |
