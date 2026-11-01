# CampusOS · Campus Placement Portal

A responsive, HCI-informed full-stack demo for students, recruiters and placement teams. It runs on Node.js with no package installation or external service credentials. The backend uses Node's built-in HTTP server and a local JSON store so the main placement workflow can be demonstrated on a laptop.

## Start the app

Requirements: Node.js 20 or newer.

```powershell
cd "C:\Users\Khushi Kanchan\Documents\Codex\2026-10-30\gi"
node server.js
```

Open [http://localhost:3000](http://localhost:3000). The demo database is created on first run in `data/db.json`. To reset to the fictional sample data, stop the server and delete that file; it is regenerated from the seed in `server.js` on next start.

On Windows, you can instead double-click `start-portal.bat`. It starts the server on `127.0.0.1:3100` and opens that address in your default browser. Keeping the server window open keeps the site available.

## Public hosting and phone install

The responsive portal is also an installable Progressive Web App (PWA). The web manifest and service worker are in `public/`; on a deployed HTTPS address, open the site on Android in Chrome and choose **Install app** or **Add to Home screen**. On iPhone, open it in Safari, tap **Share**, then **Add to Home Screen**. The service worker caches the app shell; API calls still need an internet connection.

The project includes a Dockerfile. Build and run it locally after Docker Desktop is installed:

```powershell
docker build -t campus-placement-portal .
docker run --name campus-placement-portal -p 3000:3000 -e DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/campus_placement?schema=public" -v campusos-uploads:/app/uploads campus-placement-portal
```

For public hosting, deploy this container to a host that supports Docker and configure `DATABASE_URL` as a private environment variable. Keep a persistent volume mounted at `/app/uploads` for résumés. Use the host's HTTPS URL for mobile installation. Do not publish your `.env` or database password.

The port can be changed with `$env:PORT=3001; node server.js` in PowerShell. No `npm install` is required.

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Student | `student@campus.demo` | `Student123!` |
| Recruiter | `recruiter@campus.demo` | `Recruiter123!` |
| TPO | `tpo@campus.demo` | `Tpo123!` |

There is also a second sample student: `isha@campus.demo` / `Student123!`. Public registration only allows student or recruiter roles. TPO access is seeded for the academic demo and cannot be selected in registration.

## User experience

- Student workspace with job search, role and skill filters, role details, duplicate-application prevention, status timelines, notification center, interview details, and editable profile.
- Recruiter workspace with role creation and publishing, applicant review, status changes, pipeline summary, and hiring activity.
- TPO workspace with campus metrics, student and recruiter directories, application summary, downloadable CSV, and announcements.
- Responsive navigation, clear status labels, inline form validation, confirmation feedback, keyboard-operable native controls, accessible dialog semantics, empty states, and mobile layouts.
- Passwords are hashed with SHA-256 for local demonstration, and the session identifier is held in an HttpOnly, SameSite cookie. API access checks enforce the student/recruiter/TPO boundaries for the included actions.

## Main routes

The single-page UI uses hash navigation. Workspace views are `#dashboard`, `#jobs`, `#applications`, `#interviews`, `#profile`, `#students`, `#recruiters`, `#reports`, and `#announcements`, according to the signed-in role.

REST endpoints include:

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/login`, `/api/register`, `/api/logout` | Authentication |
| GET | `/api/me`, `/api/dashboard`, `/api/jobs` | Session and workspace data |
| GET / POST | `/api/applications` | List and submit applications |
| PATCH | `/api/applications/:id/status` | Recruiter/TPO status updates |
| GET | `/api/interviews`, `/api/notifications`, `/api/announcements` | Student updates |
| POST | `/api/notifications/read`, `/api/announcements` | Mark read, publish TPO notice |
| POST | `/api/recruiter/jobs` | Publish recruiter role |
| PATCH | `/api/profile` | Update student profile |

## PostgreSQL storage

The API uses the normalized Prisma models in PostgreSQL when `DATABASE_URL` is set. Create a database named `campus_placement` in pgAdmin, copy `.env.example` to `.env`, and replace the sample password in `DATABASE_URL` with the password you set during PostgreSQL installation. Keep `.env` private. The first PostgreSQL setup seeds the fictional demo accounts and records into the normalized tables. Without `DATABASE_URL`, the one-click demo continues using `data/db.json`.

Authentication sessions remain in the small `portal_state` JSONB row; users, profiles, skills, jobs, applications, status history, interviews, notifications, announcements and résumé metadata are read from and saved through Prisma models. The database schema is defined in `prisma/schema.prisma`.

After initial setup, install Node packages, generate the Prisma client, apply the schema and seed it:

```powershell
npm.cmd install
npm.cmd run db:generate
npm.cmd exec -- prisma db push --config prisma7.config.ts
npm.cmd run db:seed
npm.cmd start
```

The database-backed seed creates the same fictional demo accounts and records as the local JSON demo. Demo passwords: `Student123!`, `Recruiter123!`, `Tpo123!`. These seeded accounts are for local academic use only.

## Security and deployment path

The local JSON store is intentionally simple for an offline-friendly classroom demonstration. It is not a multi-process production database. Resume uploads are limited to 5 MB and signature-checked, saved outside the public web root, and served only after authorization. For deployment, connect the REST handlers to Prisma/PostgreSQL; use private object storage; use Argon2id or bcrypt for account passwords; add CSRF protections, rate limits, full audit records, email delivery and HTTPS. Do not expose demo credentials on a public deployment.

## Files

- `server.js` — API, local demo seed, authentication and authorization.
- `public/index.html`, `public/app.js`, `public/styles.css` — responsive interactive interface.
- `data/db.json` — generated local database (ignored by Git).
- `prisma/schema.prisma`, `prisma/seed.ts` — normalized PostgreSQL schema and relational seed target.
- `tests/workflows.test.js` — Node built-in integration tests.
- `docs/jira-setup.md`, `docs/seminar/` — planning and seminar materials.
- `.env.example` — local configuration reference.
