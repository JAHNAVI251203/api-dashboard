```md
# API Sentinel Frontend — Agent Instructions

## 1. Purpose

This repository contains the frontend dashboard for API Sentinel.

The dashboard is responsible for:

- Displaying API analytics
- Visualizing API performance
- Displaying errors and error groups
- Showing alert information
- Presenting AI-generated insights
- Receiving real-time updates
- Providing user interaction and navigation
- Communicating with the backend API

The frontend should prioritize clarity, consistency, responsiveness, maintainability, and predictable state behavior.

---

# 2. Technology Stack

Primary technologies:

- React
- TypeScript
- Axios
- Recharts
- Socket.IO Client

Use the existing project dependencies and architecture.

Do not add a dependency when the existing stack already provides a reasonable solution.

---

# 3. Repository Structure

Follow the existing repository structure.

Keep responsibilities separated between:

- components
- pages/views
- API/client functions
- hooks
- state management
- utilities
- types
- styling
- assets

Do not introduce a new architectural pattern in one feature without a clear reason.

Before creating a new component or utility, search for an existing reusable implementation.

---

# 4. React Principles

Prefer small, focused components.

A component should have a clear responsibility.

Avoid components that simultaneously handle:

- complex API logic
- large amounts of transformation
- WebSocket management
- business rules
- rendering
- unrelated UI state

Move reusable behavior into appropriate hooks/utilities when necessary.

Do not abstract prematurely.

---

# 5. TypeScript

Use TypeScript consistently.

Avoid `any`.

Prefer explicit types for:

- API responses
- component props
- hook return values
- WebSocket payloads
- chart data
- domain models

Keep frontend types consistent with actual backend responses.

Do not invent response fields.

If the backend contract is unclear, inspect the backend before modifying frontend assumptions.

---

# 6. Component Conventions

Before creating a new component:

1. Search for an existing similar component.
2. Check whether it can be reused.
3. Check existing prop patterns.
4. Follow existing naming conventions.
5. Follow the design system.

Do not create near-duplicate components.

Prefer composition over large conditional components.

---

# 7. API Communication

Use the project's existing Axios/API abstraction.

Do not create ad-hoc Axios calls throughout components if a shared API layer already exists.

API calls should be separated from presentation where the existing architecture supports it.

Handle:

- loading
- success
- empty state
- error state

appropriately.

Do not assume the request always succeeds.

---

# 8. Real-Time Data

Socket.IO Client is used for real-time updates.

When working with real-time functionality:

- follow existing event names
- follow existing payload structures
- clean up listeners
- avoid duplicate subscriptions
- avoid reconnecting unnecessarily
- update state predictably

Always consider the component lifecycle.

If a listener is registered inside an effect, ensure it is appropriately removed.

Avoid stale closures.

---

# 9. State Management

Keep state as local as possible.

Use local component state when only one component needs the data.

Lift state only when multiple components genuinely need shared access.

Do not introduce global state for convenience.

Avoid duplicated sources of truth.

---

# 10. Effects

Use `useEffect` only when synchronizing with an external system or lifecycle-dependent behavior.

Be careful with:

- dependency arrays
- event listeners
- WebSocket subscriptions
- timers
- API requests
- cleanup functions

Always consider whether an effect can cause:

- duplicate requests
- duplicate listeners
- stale data
- memory leaks
- unnecessary rerenders

---

# 11. Performance

Do not optimize prematurely.

Before using:

- `useMemo`
- `useCallback`
- `React.memo`
- virtualization
- complex caching

identify an actual performance problem or a clear expensive computation.

Avoid unnecessary rerenders by maintaining sensible state boundaries.

---

# 12. Charts & Data Visualization

Recharts is used for analytics visualization.

Charts should:

- accurately represent the underlying data
- have clear labels
- handle empty states
- handle loading states
- handle missing/invalid data safely
- remain readable at different viewport sizes

Do not manipulate analytics data solely to make charts look better.

The visualization must preserve the meaning of the data.

---

# 13. Loading / Empty / Error States

Every data-driven view should consider:

### Loading

Clearly communicate that data is being loaded.

### Empty

Explain when there is simply no data.

Do not show an error message for an empty dataset.

### Error

Communicate that something failed and provide an appropriate recovery/action when possible.

Do not expose raw API/server errors to users.

---

# 14. Forms & User Input

Validate user input appropriately.

Do not rely only on frontend validation when the backend requires validation.

Display validation errors clearly.

Avoid losing user input unnecessarily.

Prevent accidental duplicate submissions where relevant.

---

# 15. Accessibility

UI should remain usable with:

- keyboard navigation
- readable text
- appropriate labels
- meaningful buttons
- sensible focus behavior

Do not use a clickable `<div>` when a semantic `<button>` or link is appropriate.

Images/icons should have appropriate accessible treatment.

Do not sacrifice accessibility for visual appearance.

---

# 16. Responsive Design

The dashboard should behave sensibly across supported viewport sizes.

Do not assume desktop-only usage unless the existing product explicitly requires it.

Avoid:

- fixed widths that unnecessarily break layouts
- horizontal overflow
- content disappearing at smaller sizes
- overlapping elements

---

# 17. Styling

Follow the existing styling architecture.

Do not introduce a second styling system without a clear reason.

Reuse existing:

- spacing
- typography
- colors
- buttons
- cards
- inputs
- navigation
- responsive patterns

For visual decisions, consult the design-system skill.

---

# 18. Security

Never expose:

- API keys
- secrets
- backend credentials
- private tokens

in frontend source code.

Remember that frontend code is visible to users.

Do not treat client-side authorization checks as security boundaries.

The backend remains authoritative.

---

# 19. Testing & Verification

When changing frontend behavior:

1. Run the relevant tests/checks if available.
2. Run TypeScript/lint/build checks where appropriate.
3. Verify important user flows.
4. Review the final diff.

For UI changes, verify:

- layout
- interactions
- loading states
- empty states
- error states
- responsive behavior
- real-time updates where relevant

Do not claim a UI change was verified if it was not actually checked.

---

# 20. Minimal Change Principle

Do not redesign unrelated screens while implementing a feature.

Do not:

- rewrite working components
- replace libraries unnecessarily
- change the entire styling system
- rename unrelated components
- refactor unrelated features

Keep changes scoped.

---

# 21. What Not To Do

Never:

- invent backend API responses
- duplicate API clients unnecessarily
- create duplicate components
- add dependencies without reason
- ignore cleanup for subscriptions/listeners
- use `any` to silence typing problems
- hardcode secrets
- bypass backend authorization
- make unrelated UI changes
- sacrifice accessibility for aesthetics
- claim something works without verification

---

# 22. Agent Workflow

When working on this repository:

1. Inspect the relevant feature.
2. Find similar existing components.
3. Understand the API/data contract.
4. Identify the design-system pattern.
5. Plan the smallest change.
6. Implement.
7. Run appropriate checks.
8. Review the diff.
9. Report what changed and what was verified.

Do not make broad changes before understanding the existing implementation.

---

# 23. Definition of Done

A frontend task is complete when:

- The requested behavior is implemented.
- Existing architecture is respected.
- Existing UI patterns are reused.
- Types are correct.
- Loading/error/empty states are considered.
- Real-time subscriptions are cleaned up where applicable.
- Relevant checks have been run.
- The UI is visually consistent.
- No unrelated functionality was changed unnecessarily.
- The final diff has been reviewed.