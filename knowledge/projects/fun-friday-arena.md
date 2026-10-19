---
title: Fun Friday Arena (employee gaming platform)
source: https://github.com/rishivendhan84/fun_friday
---

# Fun Friday Arena: employee gaming platform

## What it is

A full-stack employee gaming platform: every Friday from 5:00 to 5:30 PM the arena opens, and players play games, earn XP and coins, climb the leaderboard, unlock achievements and redeem office rewards. Games include multiplayer UNO and chess against a colleague, plus timed trivia, a typing race and word search. There are weekly, monthly and all-time leaderboards, 10 achievement badges, a once-per-session prize wheel, a coin shop and department team battles.

## Architecture

- The backend is the source of truth: score submission and the prize wheel are rejected outside the Friday window (time zone configurable, default Asia/Kolkata).
- Next.js proxies /api to the Express API on the same origin, so the JWT lives in an httpOnly cookie with no tokens in JavaScript.
- Multiplayer runs over Socket.IO. The server is authoritative: it tracks who is online, delivers challenge invites, holds deck and board state, validates every move and pays out XP and coins when a match ends. A disconnected player has 30 seconds to return before forfeiting.
- Reward redemptions run in database transactions, checking stock and balance atomically.
- Express hardened with helmet, CORS and rate limiting; idempotent SQL migrations and seed data.

## Stack

Next.js 15 (App Router), React 19, Tailwind CSS v4, Framer Motion; Node.js, Express, Socket.IO, chess.js; PostgreSQL 16; Docker Compose.
