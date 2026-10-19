---
title: Happy (Chennai wedding-vendor marketplace)
source: https://github.com/rishivendhan84/HF-updated
---

# Happy: Chennai wedding-vendor marketplace

## What it is

An end-to-end MERN marketplace for wedding vendors in Chennai: venues, photographers, makeup artists, decorators, caterers and more. Users search and filter, read and write reviews, shortlist vendors and send enquiries. All vendors, reviews and stories are original, fictional demo data; nothing is scraped from any real site.

## Features

- 12 vendor categories with about 8 vendors each across 20+ Chennai areas.
- Search and filter by category, area, budget and rating, with sorting and pagination.
- Vendor detail pages with gallery, packages, reviews and a sticky enquiry card.
- Reviews with the aggregate rating recalculated server-side.
- Enquiries saved as leads; shortlist synced to the account or stored locally for guests; JWT accounts.
- Zero-setup database: the server falls back to an in-memory MongoDB and auto-seeds on first boot.

## Stack

React 18, Vite, React Router, lucide-react; Node, Express, Mongoose; MongoDB with mongodb-memory-server fallback; JWT and bcrypt.
