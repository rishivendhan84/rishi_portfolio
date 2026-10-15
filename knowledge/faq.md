---
title: Contact and FAQ
source: https://rishi-portfolio-orcin.vercel.app/#contact
---

# Contact and FAQ

## How to contact Rishi

- Email: rishivendhan.tech@gmail.com
- LinkedIn: https://www.linkedin.com/in/rishivendhan
- GitHub: https://github.com/rishivendhan84
- Resume: downloadable from the portfolio at https://rishi-portfolio-orcin.vercel.app/Rishi_Vendhan_Resume.docx

Email is the best way to reach him about roles or projects.

## Location and time zone

Chennai, India (UTC+5:30).

## Is he open to work?

Yes. Rishi is available for full-stack and AI engineering roles.

## Questions the assistant cannot answer

Salary expectations, notice period, relocation, visa status and personal matters are not covered here. Ask Rishi directly by email.

## How does this chatbot work?

This assistant is a retrieval-augmented generation (RAG) system Rishi built for his portfolio. His own write-ups (this profile, his experience and his project READMEs) are split into chunks and embedded ahead of time. For each question it runs hybrid retrieval, combining vector similarity with BM25 keyword search through Reciprocal Rank Fusion, then answers with OpenAI's gpt-4o-mini using only the retrieved passages, citing each source. If nothing relevant is retrieved, it says so instead of guessing. The corpus is small, so the index is searched in memory rather than in a vector database; past roughly ten thousand chunks the plan is to move to pgvector with an HNSW index.

[CONFIRM before ingest: update this answer to match what was actually built, and add the latest eval numbers.]
