# DIASA Technical Requirements

## Stack
React 19, Vite, TypeScript strict mode, Tailwind CSS v4, React Router, Lucide React, Firebase Authentication, Cloud Firestore realtime listeners, Zod, React Hook Form, and Recharts where charting is implemented.

## Boundaries
Firebase initialization is centralized in `src/lib/firebase.ts`. Domain types live in `src/types`. Classification and operational scoring live in `src/lib`. Firestore access is isolated in `src/services`.

## Reliability
Use unsubscribe cleanup for listeners, server timestamps for mutations, deterministic pure engines, transaction-based assignments when implemented, and visible loading/error/empty states. Client severity is preliminary and must be treated as untrusted by rules.

## Security
Admin authorization is UID-based through `admins/{uid}` with `role == admin` and `active == true`. The admin document owner may read their own document to establish authorization. Local rule changes require manual deployment.
