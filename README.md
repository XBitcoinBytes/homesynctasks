# HomeSyncTasks

The earlier, household-wide version of [HomeTask](https://github.com/XBitcoinBytes/HomeTask). It added accounts, household invites, rooms/zones, and assigned chores so more than one person could share the work.

Built by Shaun Barry with AI tools on Replit.

**Status:** parked as a product. The reusable parts are also copied into the HomeTask repo under `legacy/homesync`. This repository is the full original source.

**Stack:** TypeScript, React, Vite, Tailwind CSS, Express, Drizzle ORM, PostgreSQL, and Firebase Auth. Invite emails use SendGrid.

**Run locally:** copy `.env.example` to `.env` and set `DATABASE_URL`, the `VITE_FIREBASE_*` values, and optionally `SENDGRID_API_KEY`. Then `npm install` and `npm run dev`.
