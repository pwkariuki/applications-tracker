# Applications Tracker

A full-stack job-application tracker that reads your inbox and keeps itself up to date. Connect Gmail, and it classifies incoming application emails with an LLM, auto-advances statuses when it's confident, and routes the uncertain ones to a human-review queue.

## Why

Tracking a software engineering job search by hand is tedious: every rejection, interview invite, and offer means another manual status update. This app removes that step. It watches your inbox, understands application emails, and updates the tracker for you — with a human in the loop for anything it isn't sure about, so nothing gets silently mislabeled.

## Features

- **AI email pipeline** — a daily cron job reads recent Gmail messages, classifies each with Claude (company, role, stage, and a confidence score), and acts on the result.
- **Confidence-gated automation** — high-confidence matches update an application automatically; low-confidence or ambiguous ones go to a review queue instead of guessing.
- **Human-in-the-loop review** — approve or dismiss uncertain classifications. Approving an email for a company you haven't added to the tracker yet _creates_ the application for you.
- **In-app notifications** — meaningful changes (moved to Onsite, Offer, Rejected) surface in a notifications panel.
- **Full CRUD dashboard** — sortable, filterable, searchable table with pipeline stats (total, active, offers, response rate).
- **Application detail pages** — per-application notes, source, dates, and inline status editing.
- **Auth + privacy** — email/password auth, with Gmail access as a separate, opt-in, read-only grant you can revoke anytime from settings (revokes with Google, not just locally).

## How the pipeline works

```
Daily cron (00:00 UTC)
  └─ for each connected user:
       fetch recent Gmail (last 24h)      ── Gmail API, MIME-parsed to plain text
         └─ skip already-processed emails ── idempotency
             └─ classify with Claude       ── Vercel AI SDK, structured output
                 └─ reconcile:
                      high confidence + single match  → update application + notify
                      low confidence / no / ambiguous → review queue
```

The classifier returns a typed object (`isApplicationEmail`, `company`, `role`, `status`, `confidence`) via the Vercel AI SDK's structured-output support, so the result is validated before anything touches the database. Newsletters and job alerts are filtered out at the `isApplicationEmail` step.

Everything downstream of "fetch an email" is source-agnostic — the same classify → reconcile path could be fed by a paste box or another mail provider without changes.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React, Vite, TypeScript, Tailwind CSS, shadcn/ui |
| Routing | TanStack Router (file-based) |
| Table | TanStack Table |
| Backend / DB | Convex (reactive queries, mutations, actions, cron) |
| Auth | Convex Auth (email/password) |
| AI | Vercel AI SDK + Anthropic (Claude) |
| Email | Gmail API (OAuth 2.0, `gmail.readonly`) |
| Hosting | Vercel (frontend) + Convex (backend) |

## Architecture notes

- **Actions orchestrate, mutations persist.** LLM and Gmail calls (external I/O) live in Convex _actions_; all database writes go through _mutations_. The sync action classifies, then hands results to an internal reconcile mutation.
- **Status is pipeline-owned; role/company are user-owned.** Auto-updates only ever write `status` — an email that doesn't mention a role never overwrites one you entered.
- **Auth vs. authorization are separate.** Login (Convex Auth) and Gmail access (a distinct opt-in OAuth grant with offline refresh tokens for background sync) are independent, so neither can break the other.
- **Idempotent sync.** Processed Gmail message IDs are recorded, so re-running a sync never double-updates or double-notifies.

## Getting started

### Prerequisites
- Node 18+
- A [Convex](https://convex.dev) account
- An [Anthropic API key](https://console.anthropic.com)
- A Google Cloud project with the Gmail API enabled and an OAuth 2.0 client (see below)

### Setup

```bash
git clone https://github.com/pwkariuki/applications-tracker.git
cd applications-tracker
npm install

# Start Convex (creates a dev deployment, generates types)
npx convex dev
```

Set environment variables:

**Convex** (dashboard → Settings → Environment Variables, or `npx convex env set`):
```
ANTHROPIC_API_KEY=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
SITE_URL=http://localhost:5173      # your app origin
# Convex Auth keys are set by its init (JWT_PRIVATE_KEY, JWKS)
```

**Frontend** (`.env.local`):
```
VITE_CONVEX_URL=...                  # from convex dev
VITE_GOOGLE_CLIENT_ID=...            # same client id, used to build the auth URL
```

Then run the app:
```bash
npm run dev
```

### Google OAuth setup
1. In Google Cloud Console, enable the **Gmail API**.
2. Configure the **OAuth consent screen** (External, Testing mode), add the `.../auth/gmail.readonly` scope, and add yourself as a test user.
3. Create an **OAuth client** (Web application) and register the redirect URI:
   `http://localhost:5173/auth/gmail/callback` (and your production origin's equivalent).
4. Copy the client ID/secret into the env vars above.

> Note: in Testing mode, Gmail refresh tokens expire after 7 days — reconnect from Settings when that happens. Publishing the app to production removes that limit but requires Google's verification for restricted scopes.

## Project structure

```
convex/            # backend: schema, queries, mutations, actions, cron
  schema.ts          data model
  applications.ts    CRUD
  classify.ts        LLM classification (shared helper)
  gmailFetch.ts      Gmail fetch + MIME parsing
  gmailSync.ts       sync engine + cron entry point
  reconcile.ts       confidence gate + matching
  reviewQueue.ts     approve / dismiss / create-from-email
  notifications.ts   in-app notifications
  gmail.ts           OAuth connect / status / disconnect
src/
  components/        UI (dashboard, review queue, navbar, login)
  routes/            TanStack file-based routes
```

## License

MIT

---