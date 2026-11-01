# Campus Placement Portal · viva questions and answers

1. **What problem does the portal solve?** It puts student profiles, job opportunities, applications, interview updates and placement reporting in one workflow instead of scattered messages and spreadsheets.
2. **Who are the main actors?** Students apply and track progress; recruiters post roles and review applicants; the TPO monitors campus activity and publishes notices.
3. **Why use role-based access?** Each role receives only the actions and records needed for its work. The server checks the session role; it does not trust a role supplied by the browser.
4. **How do you prevent duplicate applications?** The API checks whether the same student already applied to the job; the PostgreSQL design also declares a unique constraint on `(studentId, jobId)`.
5. **What is the purpose of the application status history?** It preserves each transition and date so the student can understand the process over time rather than seeing only the latest status.
6. **Why normalize the database?** Separating users, profiles, companies, jobs and applications reduces duplicated data and lets foreign keys preserve relationships.
7. **How is a recruiter prevented from changing another company's applicants?** Every recruiter update is checked against the job's owning company on the server.
8. **Why are TPO accounts not publicly selectable?** Administrative access should be provisioned by an authorized administrator, not granted through an untrusted registration form.
9. **What does the job eligibility data represent?** It records constraints such as department, graduation year and minimum CGPA. The server should use it before permitting an application.
10. **How do notifications improve the interaction?** They provide visible feedback for application changes, interviews and announcements, with timestamps and unread state.
11. **What is an interview round?** It is one step in an interview process, such as a technical or HR conversation. A candidate may have more than one round for the same application.
12. **How should résumé uploads be secured?** Validate extension, MIME type, file signature and size; store outside the public web root; authorize downloads on every request; never expose a permanent public URL.
13. **What does the local JSON store mean?** It is a simple classroom fallback, not a concurrent, durable production database. Production deployment should use PostgreSQL and Prisma.
14. **Why is SHA-256 not enough for production password storage?** It is a fast general-purpose hash that is cheap to brute force. Use a password-specific KDF such as Argon2id or bcrypt with a per-password salt and appropriate work factor.
15. **What is a session cookie?** A browser-held identifier that the server maps to an authenticated session. HttpOnly prevents page scripts from reading it, and SameSite helps reduce cross-site request exposure.
16. **What further security controls are needed in production?** TLS, rate limiting, CSRF defenses where applicable, password reset verification, secure secret storage, audit logging, backups and dependency updates.
17. **How would you test role authorization?** Log in as each role, call endpoints both permitted and forbidden, and assert the server returns appropriate results without leaking protected records.
18. **Why provide a CSV report?** It supports spreadsheet analysis and an easy academic demonstration. The generated rows should match the selected reporting filters.
19. **How does the Scrum board help the project?** It makes work status and blockers visible, supports sprint planning and review, and helps the team re-plan based on evidence.
20. **What is the monitoring and controlling loop?** Plan, execute, observe actual progress, compare with the plan, identify deviation, take corrective action, update the plan and continue execution.
21. **Does monitoring happen only at project end?** No. It runs continuously alongside execution so issues can be corrected before they become delivery failures.
22. **What is the difference between closure and benefits realization?** Closure confirms acceptance, documentation and handover. Benefits review checks after delivery whether outcomes such as participation or reduced coordination time improved.
23. **Why is responsive design an HCI concern?** It adapts the same tasks to device constraints, preserving legibility, navigation and usable touch targets on mobile and desktop.
24. **What accessibility decisions are present?** Native labeled inputs, visible status text in addition to color, keyboard-operable controls, descriptive buttons and responsive layouts. Further WCAG auditing remains part of production readiness.
25. **What are the project's current limitations?** The demo API still uses local JSON and is not Prisma-backed; email/password reset, full deployment hardening, Jira API automation and a PPTX export remain separate follow-up work.
