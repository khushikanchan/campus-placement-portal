# API reference (local demo)

All request and response bodies are JSON, except resume downloads. Session routes set an HttpOnly, SameSite cookie named `sid`.

| Method | Route | Access | Purpose |
|---|---|---|---|
| POST | `/api/register` | Public | Create student or recruiter account |
| POST | `/api/login` | Public | Sign in |
| POST | `/api/logout` | Signed in | Clear session |
| GET | `/api/me` | Public | Current user summary |
| GET | `/api/dashboard` | Signed in | Role-specific live demo statistics |
| GET | `/api/jobs` | Signed in | Open opportunities and current student's application IDs |
| POST / GET | `/api/applications` | Student create; signed-in list | Apply/list applications |
| PATCH | `/api/applications/:id/status` | Recruiter/TPO | Update candidate status (company-scoped for recruiter) |
| PATCH | `/api/profile` | Student | Update student details |
| GET / POST | `/api/resumes` | Student | List / upload PDF, DOC, DOCX (5 MB max) |
| GET | `/api/resumes/:id/download` | Owner, TPO, or recruiting company after application | Secure file download |
| DELETE | `/api/resumes/:id` | Owner | Remove resume and metadata |
| GET / POST | `/api/interviews` | Signed in / recruiter | List role-visible interviews / schedule for own shortlisted applicant |
| PATCH | `/api/interviews/:id` | Owning recruiter | Update date/time/link or cancel; notifies student |
| GET / POST | `/api/announcements` | Signed in / TPO | List / publish notice |
| GET / POST | `/api/notifications` / `/api/notifications/read` | Signed in | Read / mark all read |
| POST | `/api/recruiter/jobs` | Recruiter | Publish a role |

The local JSON API is a teaching/demo backend and has no pagination, email, password reset, complete audit trail, or production rate limiting. Use Prisma/PostgreSQL for a real deployment.
