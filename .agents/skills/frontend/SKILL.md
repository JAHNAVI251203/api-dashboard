# Frontend Engineering Patterns

## Purpose

Provide consistent patterns for React + TypeScript development in API Sentinel.

---

# 1. Component Design

Prefer small components with one clear responsibility.

Before creating a component:
1. Search for similar components.
2. Determine whether an existing component can be reused.
3. Follow existing prop and naming conventions.
4. Consult the design-system skill for visual decisions.

Avoid duplicate components that differ only slightly.

---

# 2. Data Flow

Prefer predictable data flow:

```text
API / WebSocket
      ↓
Data / State
      ↓
Container / Hook
      ↓
Presentation Component
```
Keep API communication separate from purely presentational components where practical.

---

## 3. API Layer

Use the existing Axios/API abstraction.

Do not create direct Axios requests inside many unrelated components.

When consuming an API:
1. Understand the actual response
2. Type the response
3. Handle loading
4. Handle errors
5. Handle empty results

Never invent fields because they seem likely to exist.

---

## 4. Hooks

Create a custom hook when behavior is:
- reusable
- stateful
- lifecycle-dependent
- complex enough to obscure a component

Do not create a hook simply to move three lines of code elsewhere.

---

## 5. useEffect

Use effects for external synchronization.

Common legitimate uses:
- API synchronization
- WebSocket subscription
- event listener registration
- timers
- external browser APIs

Always consider cleanup.

Example pattern:
useEffect(() => {
  const handler = () => {
    // ...
  };

  socket.on("event", handler);

  return () => {
    socket.off("event", handler);
  };
}, []);

Do not add effects when derived values or normal rendering are sufficient.

---

## 6. State

Keep state close to where it is used.

Prefer:
Local state
↓
Lift state when necessary
↓
Shared/global state only when justified

Avoid duplicated state.If a value can be derived from existing state, prefer deriving it rather than storing another copy.

---

## 7. Real-Time Updates

For Socket.IO:
- subscribe once
- unsubscribe during cleanup
- use stable handlers
- validate incoming data
- update only the required state

Watch for:
- duplicate listeners
- stale closures
- reconnect behavior
- unnecessary rerenders

---

## 8. Forms

Forms should:
- provide clear labels
- validate input
- show useful errors
- prevent accidental duplicate submissions
- preserve user input where appropriate

Frontend validation improves UX but does not replace backend validation.

---

## 9. Charts

Analytics charts must represent real data accurately.

Handle:
- no data
- partial data
- loading
- errors
- large datasets

Do not distort scales or values merely to create a visually impressive chart.

---

## 10. Performance

Optimize based on evidence.

Avoid unnecessary:
- memoization
- callbacks
- derived state
- effects
- rerenders
- dependency additions

If a performance problem exists, identify its cause before optimizing.

---

## 11. Accessibility

Prefer semantic HTML.

Use:
- buttons for actions
- links for navigation
- labels for inputs
- headings for hierarchy

Ensure keyboard interaction remains possible.
Do not use visual styling as a replacement for semantic meaning.

---

## 12. Type Safety

Avoid any.

Use explicit domain types for:
- API responses
- props
- chart data
- WebSocket payloads
- state

If the backend contract changes, update the corresponding frontend types rather than bypassing the type system.