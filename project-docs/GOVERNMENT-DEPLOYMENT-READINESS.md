# Government Deployment Readiness

Status: engineering checklist only. DIASA must not be described as government-ready, certified, or adopted without formal authority review.

Before any controlled pilot, obtain approval for data purpose, retention, privacy notice, security ownership, incident response, backup/restore, accessibility, language accuracy, and operational staffing. Deploy Firebase rules through the approved CI/CD or Firebase Console process, verify the exact deployed ruleset, enable required authentication protections, and run emulator plus live smoke tests against a non-production project.

Open work includes tenant-scoped RBAC, MFA, public abuse controls, audit retention, backup/restore testing, incident breach procedures, and complete multilingual UI migration.
