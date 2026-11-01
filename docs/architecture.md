# CampusOS architecture and demonstration status

## Current runnable demo

The deployed-in-workspace demo uses a dependency-free Node.js HTTP server. `server.js` provides JSON REST-style handlers and serves `public/`. The local JSON store lives in `data/db.json`; private resume files are written beneath `data/uploads/`. Set `PORTAL_DATA_DIR` to isolate data, and `PORT` to select a listener port. On Windows, `start-portal.bat` launches the app on `127.0.0.1:3100`.

Authentication uses an HttpOnly, SameSite cookie and role checks in each API handler. The demo uses SHA-256 password digests and in-memory cookie-session identifiers persisted in the local JSON file. This is suitable only for a local classroom demonstration; a production deployment must use a password KDF, a durable server-side session store, CSRF protections, rate limits, audit coverage and HTTPS.

## PostgreSQL target

`prisma/schema.prisma` describes the normalized PostgreSQL target: account roles and profiles, company and recruiter relationships, resumes, skills and student/job skill join tables, education and experience, eligibility, applications with unique student/job pairs, status history, interviews and rounds, notifications, announcements, placement records and audit logs.

The live JSON API has not yet been migrated to Prisma. Do not treat the Prisma schema as an active persistence adapter or run production traffic against the JSON demo store.

## Implemented local flows

- Student and recruiter registration; seeded TPO login.
- Job discovery and application submission with duplicate prevention.
- Student profile editing and private PDF/DOC/DOCX resume library, file signature checks and a 5 MB cap.
- Recruiter job publishing and applicant status changes.
- Interview scheduling for a recruiter's shortlisted candidate; change/cancellation notifications.
- TPO directory and campus overview; CSV report download.
- In-app notifications, read-all action and announcements.

See `api.md` for the current endpoints and known constraints.
