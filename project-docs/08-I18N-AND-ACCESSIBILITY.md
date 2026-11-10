# Internationalization and Accessibility

## Implemented foundation
- i18next, react-i18next, and browser language detection are configured.
- English, Tamil, and Hindi resources are available under `src/locales`.
- A manual language selector persists the choice in local storage.
- English is the fallback language.
- The document `lang` attribute updates when the language changes.
- Canonical Firestore category, status, severity, and assignment values remain unchanged.
- Public reporting and administrator authentication currently use translated resources.

## Required follow-up
Translate the remaining React Hook Form validation messages, password show/hide labels, response-category and availability labels, priority/event/status values, backend-generated recommendation/severity explanations, and provider error messages. Verify keyboard/screen-reader behavior in Tamil and Hindi, and review emergency instructions with qualified translators before public deployment.

## Accessibility target
Use WCAG 2.1 AA-oriented contrast, focus visibility, semantic headings, labelled controls, live status announcements, keyboard-accessible dialogs, and layouts that tolerate longer Tamil and Devanagari strings.
