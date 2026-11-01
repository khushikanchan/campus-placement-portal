# Jira Scrum setup guide

No Jira credentials or connected Jira workspace were supplied, so no project, issue, board or sprint has been created. The issue inventory below is ready for manual entry or a later authorized REST API integration.

## Create the project and board

1. In Jira, select **Projects → Create project → Software development → Scrum**.
2. Name it **Campus Placement Portal** and use key **CPP** if Jira offers it.
3. Create a Scrum board for the project and keep the default **To Do / In Progress / Done** columns.
4. Create the eight Epics listed below, then create the Stories with the stated descriptions, priorities, story points and epic links. Assign real teammates only after checking the available account directory.
5. Create Sprint 1 for two weeks. Goal: “Develop the foundation of the Campus Placement Portal by implementing authentication, student profile management, résumé upload, job posting, and initial job discovery functionality.” Put Stories 1–5 in Sprint 1 (25 points); start only after the team confirms capacity.
6. Create Sprint 2. Goal: “Complete application tracking, interview scheduling, TPO placement monitoring, notifications, testing, and deployment preparation.” Put Stories 6–15 (63 points) in its backlog. Adjust sprint capacity with the actual team.
7. For a live demonstration, move representative issues To Do → In Progress → Done. Do not mark work done unless it is actually implemented and accepted. Sprint carry-over note: “Integration, validation, and testing needed additional time; unfinished work moves to Sprint 2 to preserve quality.”

## Epics

1. Authentication and User Management
2. Student Profile and Resume Management
3. Job Posting and Discovery
4. Job Application and Tracking
5. Interview Scheduling
6. TPO Dashboard and Placement Analytics
7. Notifications and Announcements
8. Testing, Security and Deployment

## Stories and acceptance criteria

| # | User story | Priority | Points | Epic | Acceptance criteria |
|---|---|---:|---:|---|---|
| 1 | As a student, I want to register and log in so I can access the portal. | Highest | 5 | Authentication | Valid unique email creates a student; invalid fields show errors; successful login creates a session; public forms cannot grant TPO role. |
| 2 | As a student, I want to create and update my profile so recruiters can understand my qualifications. | High | 5 | Student Profile | Student can edit academic details, skills and links; validation runs server-side; other students cannot edit the record. |
| 3 | As a student, I want to upload my résumé so recruiters can review it. | Highest | 5 | Student Profile | Accept PDF/DOC/DOCX under configured limit; reject mismatched type/oversized file; owner can list/download/remove; access is authorized. |
| 4 | As a recruiter, I want to publish job posts so eligible students can apply. | Highest | 8 | Job Discovery | Required fields and deadline validate; recruiter sees own posts; published role appears in student search; other recruiters cannot edit it. |
| 5 | As a student, I want to browse and filter opportunities to find a suitable role. | High | 5 | Job Discovery | Search title/company/skills; filter job type/location/eligibility; reset filters; empty result state is clear. |
| 6 | As a student, I want to apply for a role so recruiters can consider me. | Highest | 8 | Application Tracking | Eligible signed-in student can submit once; duplicate is blocked; application is timestamped and confirmation is visible. |
| 7 | As a student, I want to track each application so I know my progress. | Highest | 5 | Application Tracking | Only own applications are visible; status and history are chronological; current status is clear and accessible. |
| 8 | As a recruiter, I want to review applicants and shortlist candidates. | High | 8 | Application Tracking | Recruiter sees applicants to own roles; filters by status; status updates are authorized and notify candidate. |
| 9 | As a recruiter, I want to schedule interviews for shortlisted candidates. | High | 8 | Interview Scheduling | Only own shortlisted applicants can be scheduled; mode/date/time validate; student sees details and receives notification; reschedule/cancel are recorded. |
| 10 | As a student, I want interview notifications so I do not miss a conversation. | High | 5 | Notifications | New/rescheduled/cancelled interview appears in unread list; notification links to details; mark-read works. |
| 11 | As a TPO, I want to view placement status so I can monitor campus progress. | Highest | 8 | Placement Analytics | TPO-only view shows students and status; data can be filtered by department/year; unauthorized roles are denied. |
| 12 | As a TPO, I want placement reports so I can analyze outcomes. | High | 8 | Placement Analytics | Report totals match source records; CSV downloads with headings; filters affect totals; empty states are handled. |
| 13 | As a TPO, I want to manage recruiter accounts so only trusted recruiters post roles. | Medium | 5 | Authentication | TPO can see recruiter verification state; approval/rejection is audited; recruiter cannot change verification. |
| 14 | As a student, I want application update notifications so I can respond promptly. | Medium | 3 | Notifications | Status changes create unread notification; timestamp and context appear; mark all read works. |
| 15 | As a TPO, I want to publish placement announcements for students. | Medium | 5 | Notifications | TPO can publish a validated notice; students see target-matching notices; author and publication time are recorded. |

