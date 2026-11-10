# Government Readiness Engineering Notes

DIASA is not government-certified, GIGW/STQC/CERT-In/DPDP compliant, or approved for government production use. Formal assessment and adopting-authority approval are required.

## Engineering checklist
- Maintain least-privilege Firestore rules and UID-based administrator authorization.
- Add organization membership and permission checks before multi-agency deployment.
- Require MFA for privileged accounts where Firebase configuration supports it.
- Define abuse protection and rate limiting for public reporting.
- Minimize contact data and document retention/deletion policy with the adopting authority.
- Define backup, restore, RTO/RPO, audit-log retention, breach response, and dependency maintenance procedures.
- Complete WCAG 2.1 AA-oriented keyboard, screen-reader, contrast, language, and text-resizing verification.
- Publish rules only through an authorized deployment process and record the deployed version.

## Current limitations
Live Firebase workflows, emulator rules tests, external routing, official alert feeds, SMS adapters, and formal compliance reviews remain unverified or unconfigured.
