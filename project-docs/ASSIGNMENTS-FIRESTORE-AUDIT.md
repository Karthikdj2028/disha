# Assignments Firestore Audit

## Authorization path

The administrator signs in with Firebase Authentication. `src/services/authService.ts` reads `admins/{auth.currentUser.uid}` and requires `role == "admin"` and `active == true`. `AuthContext` repeats that UID-based check when restoring the session. Email alone is not used for authorization.

The local rules allow an authenticated user to `get` their own `admins/{uid}` document before `isAdmin()` is established. All protected collection rules use the same authenticated UID document, role, and active checks.

## Assignment page reads

| Code path | Firestore operation | Path/query | Required authorization | Local rule |
| --- | --- | --- | --- | --- |
| `incidentService.subscribeToIncidents` | Realtime query read | `incidents`, ordered by `createdAt desc` | Active administrator | `match /incidents/{incidentId}` `allow read: if isAdmin()` |
| `assignmentService.subscribeToAssignments` | Realtime query read | `assignments`, ordered by `assignedAt desc` | Active administrator | `match /assignments/{assignmentId}` `allow read: if isAdmin()` |
| `assignmentService.subscribeToAssignmentHistory` | Realtime query read | `assignmentEvents`, ordered by `timestamp desc` | Active administrator | `match /assignmentEvents/{eventId}` `allow read: if isAdmin()` |
| `teamService.getResponseTeams` | Query read | `responseTeams`, ordered by `teamName` | Active administrator | `match /responseTeams/{teamId}` `allow read: if isAdmin()` |
| `teamService.subscribeToResponseTeams` | Realtime query read | `responseTeams`, ordered by `teamName` | Active administrator | `match /responseTeams/{teamId}` `allow read: if isAdmin()` |
| `assignmentService.recommendTeamsForIncident` | Document read and query read | `incidents/{incidentId}` and ordered `responseTeams` query | Active administrator | Incident read and response-team read rules |

## Assignment writes

`assignTeamToIncident` uses one Firestore transaction. It reads the incident and team, verifies availability, capability, coordinates, and active-assignment state, then updates the team and incident and creates one `assignments` document plus one `assignmentEvents` document.

`reassignTeam` uses a transaction to release the old team, mark the new team busy, close the previous assignment, create the replacement assignment, update the incident, and create a reassignment event.

`releaseTeam` uses a transaction to return the team to `Available`, complete the active assignment, update the incident, and create an incident-resolution event.

The local rules require administrator authorization for all writes. Incident assignment/resolution changes use `getAfter` checks to require matching team and assignment state in atomic writes.

## Diagnosis

The local rules authorize every assignment-page read for the same administrator identity that already passed login verification. The page previously shared one generic error callback, so it could not identify which collection failed.

Given successful administrator login and no local Firebase configuration/emulator, the observed live `Missing or insufficient permissions` error is most consistent with stale deployed rules that do not yet include administrator read matches for `responseTeams`, `assignments`, and/or `assignmentEvents`. The application code cannot prove the deployed ruleset from this workspace.

The listeners now prefix errors with the collection name, making any remaining deployed-rule mismatch explicit.

## Rules hardening

- Team create/update payloads now validate strings, capability allowlists, availability values, optional `latlng` coordinates, nullable assignment references, member-count bounds, timestamps, immutable team codes, and server-time update fields.
- Assignment creation now validates actor UID, timestamps, numeric ranges, optional routing fields, score explanation, referenced incident/team documents, and atomic post-write incident/team state.
- Assignment updates require an existing `Active` assignment and permit only `Active -> Released` or `Active -> Completed` with a server timestamp. Reassignment and resolution use `getAfter` state checks.
- Assignment events validate actor UID, event type, timestamp, description, optional metadata, referenced documents, and post-write state. Events remain immutable.
- Public incident creation validates optional contact text and optional coordinates. Public reads and updates remain denied.
- The Firebase CLI initially rejected `is geopoint`; Firestore Rules uses `is latlng`. The corrected file compiled successfully in a non-deploying Firebase CLI dry run.
- Incident deletion is now limited to never-assigned incidents. The service and UI block incidents with assignment metadata, while the rule blocks deletion when any assignment fields exist. This preserves assignment history instead of orphaning it.
- `teamName` in an assignment is intentionally a historical snapshot. It records the name displayed when the assignment was created and is not required to track later team-name edits.
- Manual team updates cannot reserve a team as `Busy`; a Busy team must be tied to an active incident through the transaction state. Manual release of an assigned team is rejected unless the atomic incident state also releases or resolves that assignment. Location, name, capability, and unassigned availability edits remain supported.
- Event metadata is constrained to the actual numeric keys written by the service: `recommendationScore` and `distanceMeters`. Resolution events may omit metadata.
- Added pure policy tests for deletion eligibility, manual team availability guards, and assignment lifecycle transitions. Firebase Emulator rule tests are not configured.

## Required Firebase action

Publish the current root `firestore.rules` to the `diasa-d1b05` project through an approved Firebase Console or CLI workflow. No local rule file is deployed automatically. Verify the signed-in UID has a matching `admins/{UID}` document with `role: "admin"` and `active: true`.

Do not make any collection globally readable or writable. Do not modify production data as part of this diagnosis.

## Remaining risks

- The rules cannot query all historical assignment documents during incident deletion. Blocking any incident with assignment metadata prevents deletion of records created by the current service, but legacy records without those fields require a migration review.
- An authorized administrator can still edit non-assignment team fields. Assignment-affecting state is transaction-constrained, but a full role/permission model is not implemented.
- `TeamReleased` is an allowed event type but is not emitted by the current service; reassignment emits `TeamReassigned` and resolution emits `IncidentResolved`.
