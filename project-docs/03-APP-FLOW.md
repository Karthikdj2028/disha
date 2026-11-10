# DIASA Application Flow

```mermaid
flowchart TD
  A[Public report] --> B[Zod validation]
  B --> C[Severity classification]
  C --> D[Firestore incident]
  D --> E[Admin realtime dashboard]
  E --> F[Search and status tracking]
  F --> G[Priority and team recommendation roadmap]
  G --> H[Manual assignment roadmap]
  H --> I[Resolution and release]
```

Public users never read incident records. Administrators authenticate, pass the UID/role/active check, then access protected views. Incident status currently supports `Reported`, `Pending`, `In Progress`, and `Resolved`; `Assigned` is reserved for the assignment milestone and must be added with coordinated UI and rules changes.
