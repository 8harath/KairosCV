# KairosCV Theme Color Palette

This document describes the application's color scheme and usage guidelines.

## Color Palette

### Background Hierarchy

- **Primary Background**: `#F5F4ED` (warm beige) - Main app background
- **Card/Section Background**: `#FEF3C7` (warm yellow) - Used for cards, sections, and content blocks
- **Dark Mode Background**: `#121212` (near black) - Background in dark mode

### Text Colors

- **Primary Text**: `#121212` on light backgrounds
- **Secondary Text**: `rgba(18, 18, 18, 0.7)` - Used for descriptions and hints
- **On Dark Background**: `#F5F4ED` or `#FEF3C7` for readability

### Accent & Interaction

- **Primary Accent/Button**: `#C6613F` (warm terracotta) - Primary buttons, links, and focus states
- **Hover/Active State**: `#A54E2E` - Darkened version for hover effects
- **Secondary Buttons**: `#D97706` (warm orange) - Secondary actions and highlights

### Feedback & Alerts

- **Error**: `#E81123` (red) - Error messages and destructive actions
- **Warning**: `#D97706` (orange) - Warnings and caution banners
- **Success**: `#4CAF50` (green) - Success messages and positive feedback

### Highlights and Surfaces

- **Highlight/Selection**: `#FFFFCC` (light yellow) - Hover backgrounds, selection markers, active tabs
- **Dividers/Borders**: `rgba(18, 18, 18, 0.1)` - Low-contrast borders and dividers

## Implementation

The colors are implemented in:
- `styles/globals.css` - CSS custom properties using OKLCH color space
- `lib/simple-pdf-generator.ts` - PDF export styling
- `lib/pdf-generator.ts` - PDF export styling (Puppeteer version)

All components use Tailwind CSS utility classes that reference these theme colors through CSS variables.

## Usage in Components

- Use `bg-background` for main backgrounds
- Use `bg-card` for card backgrounds
- Use `bg-primary` for primary buttons and accents
- Use `bg-secondary` for secondary actions
- Use `text-foreground` for primary text
- Use `text-muted-foreground` for secondary text
- Use `border-border` for borders and dividers

## Design Philosophy

This color palette creates a warm, approachable aesthetic that:
- Reduces eye strain with soft beige backgrounds
- Maintains excellent readability with high contrast text
- Uses warm accent colors (terracotta/orange) for a confident, approachable tone
- Provides clear visual hierarchy through color contrast
- Works well in both light and dark modes

