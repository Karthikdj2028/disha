# Multi-Agency Expansion

## Current baseline
DIASA currently supports one authorized administrator identity, public incident reporting, preliminary severity, operational priority, response teams, transactional assignment, assignment history, and realtime incident operations.

## Planned boundaries
Multi-organization access requires `organizations`, `departments`, and membership records before tenant-scoped rules can be safely introduced. Existing `admins/{uid}` remains compatible during migration; no production data is rewritten by the multilingual phase.

Future modules include personnel, duty scheduling, internal incident messages, inventory, shelters, aid requests, missing-person case management, duplicate review, confidence scoring, simulation, and optional routing adapters. Each module must ship with schemas, rules, tests, and an explicit not-configured state for external providers.

## Compatibility risks
Canonical Firestore enums remain English and must never be translated. Adding tenant IDs, coordinates, assignment metadata, or new collections requires additive migrations and rule review. Existing public incident creation must remain available without authentication.
