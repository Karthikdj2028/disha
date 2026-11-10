# DIASA Product Requirements

## Product
DIASA is an emergency incident reporting and administrator operations platform. Its Round 1 workflow is public reporting, deterministic preliminary severity classification, realtime administrator monitoring, status management, and resolution.

## Expanded roadmap
Priority ranking, response-team management, manual assignment, assignment history, maps, analytics, duplicate review, command timeline, simulation, and English/Tamil labels are planned in explicit milestones. They must not be presented as complete until implemented and tested.

## Roles
Public reporters may submit validated reports only. Authorized administrators may authenticate, read and manage incidents, and later manage teams and assignments.

## Routes
`/report`, `/admin/login`, `/admin/forgot-password`, `/admin/dashboard`, `/admin/incidents`, `/admin/incidents/:id`, `/admin/teams`, `/admin/map`, `/admin/analytics`, `/403`, `/404`, `/500`.

## Exclusions
No public registration, GPS auto-collection, offline delivery claims, autonomous dispatch, paid routing dependency, notifications, AI prediction, inventory, volunteer management, or unrelated commercial features.

## Acceptance basis
Every completed milestone must have real Firestore data, explicit loading/error/empty states, matching security rules, and executable validation.
