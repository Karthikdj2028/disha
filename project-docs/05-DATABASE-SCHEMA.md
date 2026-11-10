# DIASA Database Schema

## Current collection: `incidents`
`title`, `description`, `category`, `location`, optional `contactInfo`, `peopleAffected`, `severity`, `severityScore`, `severityReason`, `status`, `createdAt`, `updatedAt`.

## Planned collections
`admins/{uid}`: `email`, `role`, `active`.

`responseTeams/{id}`: `teamCode`, `teamName`, `responseCategories`, `currentLocation` GeoPoint, `availabilityStatus`, nullable `assignedIncidentId`, optional `memberCount`, `lastLocationUpdate`, `createdAt`, `updatedAt`.

`assignments/{id}`: incident/team identity, administrator UID, assignment timestamps/status, distance fields, travel estimate, recommendation score.

`assignmentEvents/{id}`: incident/team identity, actor UID, event type, metadata, timestamp.

Rules must prevent public reads and all public team/assignment writes. Assignment transitions must use transactions.
