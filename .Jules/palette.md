This journal is for Palette's critical UX/accessibility learnings.

## 2024-07-25 - Missing ARIA Labels on Icon-Only Buttons
**Learning:** The application's main navigation bar (`App.tsx`) contained several icon-only buttons for primary actions like "User profile", "Settings", and "Sign out" that were missing `aria-label` attributes. This is a recurring accessibility anti-pattern that makes the interface unusable for screen reader users.
**Action:** When working on this repository, I will proactively inspect all icon-only buttons to ensure they have an appropriate `aria-label` to provide an accessible name.
