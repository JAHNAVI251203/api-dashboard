# API Sentinel — Design System

## Purpose

Maintain a cohesive visual language across the API Sentinel dashboard.

**Core rule:** Reuse existing components, design tokens, styles, and layout patterns before creating anything new.

---

## 1. Visual Consistency

Reuse existing values for:

- Colors
- Typography
- Spacing
- Border radius
- Shadows
- Borders
- Icons
- Component sizing

Do not introduce arbitrary one-off styles when an existing pattern or token can be reused.

---

## 2. Layout

Use a consistent page structure:

```text
Dashboard
├── Page Header
├── Summary / Metrics
├── Primary Visualization
└── Detailed Data
```
## 3. Cards

Use cards for meaningful content such as:
- Metric summaries
- Charts
- Alert summaries
- Error groups
- Important data sections

Do not wrap every small UI element in a card.

## 4. Typography

Follow the existing typography scale and hierarchy:
- Page Title
- Section Heading
- Card Heading
- Body
- Secondary Text
- Metadata

Do not introduce arbitrary font sizes.

## 5. Colors & Status

Use colors semantically and consistently:
Success → Healthy / Normal
Warning → Attention Required
Error   → Failure / Problem
Neutral → Informational / Default

Do not use status colors decoratively.
Maintain sufficient contrast and never communicate important status through color alone.

## 6. Buttons & Controls

Reuse existing button/control components.
Keep consistent:
- Height
- Padding
- Radius
- Typography
- Default
- Hover
- Active
- Disabled
- Loading states

Avoid one-off button styles.

## 7. Tables

Prioritize readability and consistency in:
- Column spacing
- Headers
- Row height
- Alignment
- Status indicators
- Empty states

Long API endpoints, errors, or values must not unnecessarily break the layout.

## 8. Charts

Charts should follow a consistent visual language.

Reuse existing patterns for:
- Typography
- Axes
- Tooltips
- Legends
- Spacing
- Empty states

Avoid decorative elements that reduce readability of monitoring data.

## 9. Loading, Empty & Error States

Every data-driven component should account for:
- Loading - Prefer existing skeletons, spinners, or loading components.
- Success - Show the loaded data in an appropriate format.
- Empty - Explain why there is no data. Example: "No API traffic recorded yet."
- Error - Communicate what failed, whether retry is possible, and whether other dashboard functionality remains available.

Never expose stack traces or internal errors to users.

## 10. Responsive Design

Design for:
- Desktop
- Laptop
- Phone screens

Pay particular attention to:
- Tables
- Charts
- Metric cards
- Navigation
- Long API endpoint names
- Error messages

Avoid unnecessary horizontal overflow.

## 11. Accessibility

Ensure:
- Sufficient text contrast
- Keyboard-accessible controls
- Meaningful icon labels
- Visible focus states
- Proper form labels
- Status is not conveyed by color alone
- Semantic HTML is used where appropriate

Accessibility should be preserved when creating or modifying visual components.

## 12. Design Review Checklist

Before completing a UI change:
- Existing components/patterns were checked first.
- Existing design tokens/styles are reused.
- Typography follows the existing hierarchy.
- Spacing and layout are consistent.
- Colors have consistent semantic meaning.
- Loading state is handled.
- Empty state is handled.
- Error state is handled.
- Responsive behavior is checked.
- Accessibility is considered.
- No unnecessary one-off styling was introduced.