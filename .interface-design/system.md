# doc-qa — Interface Design System

## Intent
Knowledge workers who upload and query PDFs. Focused, reading-mode energy.
Feels like a well-organized reading desk — warm, precise, unhurried.

## Domain
Library stacks · parchment paper · ink · document trays · desk lamps · marginalia · manila folders

## Direction
Neutral-warm grays with brown undertones. Warmth comes from the brown tint in every gray,
not from a saturated accent. A single dark brown-taupe brand color ("aged leather / ink")
marks what's interactive and active. Everything else is quiet paper-white and warm gray.

## Palette

### Light mode
| Token       | Value                     | Role                           |
|-------------|---------------------------|--------------------------------|
| background  | oklch(0.995 0.002 75)     | Near-white with trace warmth   |
| foreground  | oklch(0.16 0.01 55)       | Deep warm brown-black          |
| card        | oklch(1 0 0)              | Pure white                     |
| muted       | oklch(0.965 0.003 75)     | Warm light gray                |
| muted-fg    | oklch(0.50 0.008 55)      | Warm medium gray               |
| border      | oklch(0.92 0.003 75)      | Very light warm divider        |
| brand       | oklch(0.35 0.025 55)      | Dark brown-taupe — aged leather|

### Dark mode
| Token       | Value                     | Role                           |
|-------------|---------------------------|--------------------------------|
| background  | oklch(0.15 0.006 55)      | Warm dark brown                |
| card        | oklch(0.20 0.006 55)      | Elevated surface               |
| brand       | oklch(0.70 0.03 55)       | Lighter brown-taupe on dark bg |

## Depth Strategy
**Borders-only** — no drop shadows. Appropriate for a focused document tool.
Dashed borders for empty states.

## Spacing
shadcn default scale. Chat content centered with max-w-2xl.
Messages gap-6 for breathing room. Dashboard content p-6.

## Signature
Dark brown-taupe `--brand` token — used for:
- Logo/icon color (FileText in header)
- Active nav state (bg-brand/10 + text-brand — subtle brown tint)
- Send button: solid bg-foreground with white arrow (like reference)
- Chat document badge: bg-brand/10 icon container

## Component Patterns

### Auth layout
Brand mark (icon + name) centered above the card. White bg, not gray.

### Sidebar nav active state
```tsx
isActive
  ? 'bg-brand/10 text-brand'
  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
```
Uses `usePathname()` — sidebar is a client component.

### Empty state
Centered in a dashed-border container with icon in muted rounded bg,
title in font-medium, description in muted-foreground max-w-xs.

### Chat input (inspired by Acme AI reference)
Card-like container with `rounded-xl border bg-card` wrapping a borderless textarea.
Send button: small dark circle (`bg-foreground text-background`) with ArrowUp icon.
Centered with `max-w-2xl`.

### Message bubbles
Labels "Vos" / "Asistente" in uppercase 11px above each bubble.
User: `bg-brand/8 rounded-xl` (barely-visible brown wash).
Assistant: `border border-border bg-card rounded-xl`.
Source chips: `rounded-lg border bg-muted/60`, expand inline on click.

## Typography
Geist Sans (sans) + Geist Mono (mono). Already configured in layout.tsx.
Text hierarchy: tracking-tight on headings, text-sm text-muted-foreground for metadata.

## Radius
`--radius: 0.625rem` (shadcn default — slightly rounder, friendlier)
