# DESIGN.md — Coinbase Inspired

## Visual Theme
Institutional-grade calm. Pure white canvas, a single Coinbase Blue (#0052FF),
Inter font at weight 400 for headings instead of 700. Hairlines and surface
steps for depth instead of shadows.

## Colors
- brand: #0052FF
- brand-hover: #578BFA
- background: #FFFFFF
- surface: #F2F2F7
- surface-elevated: #FAFAFA
- dark: #0A0B0D
- dark-surface: #1A1B1E
- ink: #0A0B0D
- ink-secondary: #6B7280
- ink-tertiary: #9CA3AF
- border: #E5E5E5
- border-strong: #D1D5DB
- success: #00D26F
- error: #DC2626

## Typography
Font: Inter
- h1: 56px, weight 400, line-height 1.05, letter-spacing -0.02em
- h2: 40px, weight 400, line-height 1.1, letter-spacing -0.015em
- h3: 28px, weight 500, line-height 1.2
- h4: 20px, weight 600, line-height 1.3
- body-lg: 18px, weight 400, line-height 1.56
- body: 16px, weight 400, line-height 1.5
- caption: 14px, weight 500, line-height 1.4
- overline: 12px, weight 600, line-height 1.3, uppercase, letter-spacing 0.08em
- button: 16px, weight 600, line-height 1.2, letter-spacing 0.01em
- mono: 14px, weight 400, line-height 1.5, JetBrains Mono or monospace

## Spacing
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

## Radius
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- pill: 100px
- full: 9999px

## Shadows
None. Use hairlines (1px solid border) and surface steps for depth.

## Components

### Primary Button
- Background: #0052FF
- Color: #FFFFFF
- Radius: 100px (pill)
- Padding: 14px 28px
- Height: 56px
- Hover: #578BFA
- Focus: 2px solid #0052FF ring

### Secondary Button
- Background: transparent
- Color: #0052FF
- Border: 1px solid #E5E5E5
- Radius: 100px
- Hover: #F2F2F7 background

### Ghost Button
- Background: transparent
- Color: #6B7280
- Hover: #F2F2F7
- No border

### Card
- Background: #FFFFFF
- Border: 1px solid #E5E5E5
- Radius: 16px
- Padding: 24px

### Dark Card
- Background: #0A0B0D
- Border: 1px solid #1A1B1E
- Radius: 16px
- Padding: 24px

### Input
- Background: #FFFFFF
- Border: 1px solid #E5E5E5
- Radius: 12px
- Padding: 12px 16px
- Focus: border #0052FF
- Placeholder: #9CA3AF

### Badge
- Background: #F2F2F7
- Color: #0A0B0D
- Radius: 100px
- Padding: 4px 12px
- Font: 13px weight 600

## Rules
1. White background default, dark only for featured sections
2. Coinbase Blue only on primary CTAs — never decorative
3. 100px pill radius on all buttons — never rectangular
4. No box shadows anywhere
5. Hairlines (1px #E5E5E5) and surface steps for depth
6. Numbers use tabular numerals
7. Inter font throughout
