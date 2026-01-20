# PALETTE'S JOURNAL - CRITICAL LEARNINGS ONLY

## 2024-07-25 - The Silence of the Icons

**Learning:** Discovered that icon-only buttons in the main navigation bar in `App.tsx` were missing `aria-label` attributes. This makes them effectively invisible to screen reader users, preventing them from accessing key functionality like account settings and logging out. It's a critical reminder that an aesthetically clean UI can inadvertently create significant accessibility barriers. A button without a label is just a picture.

**Action:** Prioritize auditing all icon-only interactive elements for proper accessibility labels during initial component exploration. This is a low-effort, high-impact fix that should be a standard check.
