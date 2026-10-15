# Knowledge base review (draft, 2026-10-15)

Files starting with `_` are skipped by ingest. Ingest will also refuse any file that still contains `[CONFIRM`, so every open item below must be resolved (edit the line or delete it) before the index is built.

## Sources used

- Live site text (`index.html`) and `README.md` of this repo
- SecondBrain `Professional Profile.md`, filtered through the 2026-09-12 proof rules
- READMEs of VitaLens, Zoft-assignment, stratos, HF-updated, personal_AI, fun_friday, Micro-SAAS-agent, github-resources (pulled from GitHub 2026-10-15)

## Resolved with Rishi, 2026-10-15

1. Planning System volumes: real data, kept (9,000+ work orders, 4,500+ SKUs, 16 BORs, 8 stations).
2. RAG chatbot 30 to 150 queries/day: dropped. The live widget demo is the proof.
3. SEO agent 15 hrs to under 30 min: dropped.
4. CX analytics ~10 hrs/week: dropped.
5. Stratos: dropped from the bot (agency storefront, job-search exposure). File removed.
6. PAIOS: live = tasks, goals, habits, calendar, finance. Telegram capture and the Direction Engine brief are described as in the codebase, not working live.
7. AI Medical Report Scanner: kept on Rishi's word (he can show it in an interview).
8. github-resources: described as paused since August 30, 2026.

## Still open (search for `[CONFIRM`)

- `about-this-bot.md` (split out of faq.md so contact answers are not blocked): rewrite "How does this chatbot work?" once phase 3 is built, with the eval numbers. Ingest stays blocked on this file until then, by design.

## Deliberately left out

- "30 daily users" (Planning System), "60-person team" and "20 to 30 min/person/day" (Timesheet RPA): retired by the proof rules.
- "Eliminated manual content production" (content agent): an outcome claim with no measurement on record.
- Agent-readable storefront (AEO/GEO) work: implementation unconfirmed.
- Phone number: the bot points to email, LinkedIn and GitHub.
- Hours-saved and queries-per-day figures (RAG, SEO, CX): dropped by Rishi 2026-10-15.
- Day-job-adjacent repos (GenAI, HF, Hair_analysis_tool, RPA, clickup_*), trivial repos, third-party clones, CORTEX.

## Site copy aligned (2026-10-15)

The homepage, Story Mode (`src/story.js`) and Game Mode (`src/arcade.js`) no longer show "30 daily users", "30 people", "60-person team", or the RAG, SEO and CX figures, so the site and the bot tell the same story. Still on the site and open for Rishi: "The paper is gone." (Story Mode, Planning System chapter) and "Eliminated manual content production" / "0 manual steps" (content agent card).
