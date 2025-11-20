# KairosCV Design System
## Soft Brutalism with Sky Blue Accent

### 🎨 Design Philosophy
**Soft Brutalism** - Keeping the bold, confident neo-brutalist foundation while adding 20% refinement through:
- Subtle border radius (4-12px)
- Softer shadows with rgba for depth
- Sky Blue accent color for trust and modernity
- Improved transitions and micro-interactions

---

## Color Palette

### Primary Colors
```css
--black-100: #000000    /* Primary text, borders */
--white-100: #ffffff    /* Background, cards */
```

### Grayscale Hierarchy
```css
--gray-70: #4a4a4a     /* Secondary text (WCAG AA compliant) */
--gray-30: #b3b3b3     /* Dividers, subtle elements */
--gray-10: #e6e6e6     /* Backgrounds, hover states */
--gray-05: #f5f5f5     /* Subtle backgrounds */
```

### Accent Color (NEW!)
```css
--accent-blue: #0EA5E9        /* Sky Blue - primary accent */
--accent-blue-light: #38BDF8  /* Hover states */
--accent-blue-dark: #0284C7   /* Active states */
```

### Semantic Colors
```css
--success: #059669     /* Green for positive actions */
--destructive: #dc2626 /* Red for errors */
```

---

## Spacing System (8px Grid)
```css
--space-1: 0.5rem   /* 8px  - Tight spacing */
--space-2: 1rem     /* 16px - Small gaps */
--space-3: 1.5rem   /* 24px - Medium gaps */
--space-4: 2rem     /* 32px - Section spacing */
--space-6: 3rem     /* 48px - Card padding */
--space-8: 4rem     /* 64px - Large sections */
--space-10: 5rem    /* 80px - Hero spacing */
```

---

## Border Radius
```css
--radius-sm: 4px   /* Buttons, small elements */
--radius-md: 8px   /* Cards, inputs */
--radius-lg: 12px  /* Hero cards */
--radius-xl: 16px  /* Special components */
```

---

## Component Classes

### Buttons

#### Primary CTA
```tsx
<button className="btn">
  Standard Action
</button>
```
- 3px border
- 4px border-radius
- 5px shadow with rgba(0,0,0,0.15)

#### Hero CTA (Largest)
```tsx
<Link href="/action" className="btn-hero inline-flex items-center gap-2">
  Main Call to Action
  <Icon className="w-5 h-5" />
</Link>
```
- 3px border
- 8px border-radius
- 6px shadow with rgba(0,0,0,0.2)

#### Accent Button (NEW!)
```tsx
<button className="btn-accent">
  Interactive Element
</button>
```
- Sky Blue background
- 3px border
- Blue tinted shadow

#### Secondary
```tsx
<button className="btn-secondary">
  Secondary Action
</button>
```
- White background
- 2px border
- Lighter shadow

#### Ghost
```tsx
<button className="btn-ghost">
  Tertiary Action
</button>
```
- Transparent background
- Border on hover only

### Cards

#### Standard Card
```tsx
<div className="card">
  <h3>Card Title</h3>
  <p>Card content...</p>
</div>
```
- 2px border
- 8px border-radius
- 4px shadow with rgba(0,0,0,0.08)

#### Interactive Card
```tsx
<div className="card-interactive">
  <h3>Clickable Card</h3>
</div>
```
- Lifts on hover (-4px translateY)
- Shadow increases to 6px 8px

#### Elevated Card
```tsx
<div className="card-elevated">
  <h2>Important Content</h2>
</div>
```
- 12px border-radius
- 6px shadow
- More padding

---

## Loading States

### Document Transform (For file uploads)
```tsx
import LoadingDocumentTransform from '@/components/LoadingDocumentTransform'

<LoadingDocumentTransform />
```

### Confident Pulse Spinner
```tsx
import LoadingSpinner from '@/components/LoadingSpinner'

<LoadingSpinner size="md" label="Processing..." />
// Sizes: "sm" | "md" | "lg"
```

---

## Icons

All icons from `@/components/icons`:
```tsx
import {
  UploadIcon,
  DownloadIcon,
  CheckIcon,
  ArrowRightIcon,
  SparklesIcon,
  FileIcon
} from '@/components/icons'

<UploadIcon className="w-6 h-6" />
```

---

## Badges

```tsx
import Badge from '@/components/Badge'

<Badge variant="success">✓ ATS Score: 95%</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="neutral">Info</Badge>
```

---

## Animation Utilities

### Fade In
```tsx
<div className="animate-in fade-in">
  Content fades in
</div>
```

### Zoom In
```tsx
<div className="animate-in zoom-in">
  Content zooms in
</div>
```

### Slide In from Bottom
```tsx
<div className="animate-in slide-in-from-bottom-3">
  Content slides up
</div>
```

### Delays
```tsx
<div className="animate-in fade-in delay-100">First</div>
<div className="animate-in fade-in delay-200">Second</div>
<div className="animate-in fade-in delay-300">Third</div>
```

---

## Usage Guidelines

### When to Use Accent Color
✅ **DO use Sky Blue for:**
- Secondary CTAs (less critical than primary)
- Interactive text links
- Progress indicators
- Focus states
- Trust indicators (badges, checkmarks)

❌ **DON'T use Sky Blue for:**
- Primary CTAs (keep black)
- Body text
- Borders on most cards
- Backgrounds

### Shadow Intensity
- **Light (0.08):** Default cards, subtle depth
- **Medium (0.12-0.15):** Buttons, elevated cards
- **Heavy (0.2-0.25):** Hero elements, hover states

### Border Radius Usage
- **None (0px):** Maintain for specific brutalist elements
- **Small (4px):** Buttons, badges, small components
- **Medium (8px):** Cards, inputs, most containers
- **Large (12-16px):** Hero sections, special features

---

## Accessibility

### Focus States
All interactive elements have 3px outlines with accent color:
```css
*:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}
```

### Color Contrast
- Primary text (#000) on white: 21:1 (AAA)
- Muted text (#4a4a4a) on white: 9.4:1 (AAA)
- Accent blue (#0EA5E9) on white: 3.4:1 (AA for large text)

### Touch Targets
All interactive elements have minimum 44px height (Apple HIG standard)

---

## Migration from Pure Neo-Brutalism

### Before (Pure Neo-Brutalism)
```tsx
<button className="bg-black text-white border-4 border-black px-6 py-3">
  Button
</button>
```

### After (Soft Brutalism)
```tsx
<button className="btn">
  Button
</button>
```

**Changes:**
- Border: 4px → 3px
- Added: border-radius: 4px
- Shadow: Solid black → rgba(0,0,0,0.15)
- Smoother transitions (200ms vs 150ms)

---

## Examples in Production

### Homepage Hero
```tsx
<div className="flex flex-col sm:flex-row gap-4 items-center">
  {/* Primary action - Black */}
  <Link href="/optimize" className="btn-hero">
    Optimize Your Resume Now
  </Link>

  {/* Secondary action - Accent blue */}
  <Link href="/intent" className="text-sm font-semibold text-accent hover:text-accent-blue-dark">
    See how it works →
  </Link>
</div>
```

### Feature Card
```tsx
<div className="card-interactive group text-center">
  <div className="mb-6 flex justify-center">
    <div className="relative">
      <UploadIcon className="w-16 h-16 stroke-2" />
      <span className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white font-black flex items-center justify-center text-sm border-2 border-black">
        1
      </span>
    </div>
  </div>
  <h3 className="mb-3">Upload</h3>
  <p className="text-sm text-muted-foreground">
    Drop your resume in any format
  </p>
</div>
```

---

## Quick Reference

| Element | Class | Border | Radius | Shadow |
|---------|-------|--------|--------|--------|
| Hero CTA | `.btn-hero` | 3px | 8px | 6px rgba |
| Primary Button | `.btn` | 3px | 4px | 5px rgba |
| Secondary Button | `.btn-secondary` | 2px | 4px | 4px rgba |
| Accent Button | `.btn-accent` | 3px | 4px | 5px blue rgba |
| Card | `.card` | 2px | 8px | 4px rgba |
| Interactive Card | `.card-interactive` | 2px | 8px | 4px→6px rgba |

---

**Last Updated:** Nov 2025
**Version:** 2.0 (Soft Brutalism)
