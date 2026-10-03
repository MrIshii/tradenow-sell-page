# AutoNexus Style Guide

## 1. Brand Overview

**AutoNexus** is a Utah-based dealership with a large inventory of new and used cars ranging from affordable vehicles to premium and high-end vehicles.

The visual system should be modern, trustworthy, clean, fast, and inventory-first.

## 2. Brand Personality

| Trait | Design Translation |
|---|---|
| Trustworthy | Strong hierarchy, clean surfaces, high contrast |
| Fast | Prominent search, clear CTAs, scannable cards |
| Premium | Graphite, restrained gold, polished imagery |
| Accessible | Readable typography, simple filters, clear forms |
| Utah-grounded | Subtle mountain/road/showroom cues |

## 3. Color System

| Role | Name | Hex | Usage |
|---|---|---:|---|
| Primary | Axio Graphite | `#101820` | Nav, footer, hero overlays, premium structure |
| Secondary | Axio Blue | `#008FDB` | CTAs, links, selected states, active filters |
| Tertiary | Wasatch Gold | `#C58B2A` | Premium inventory, luxury badges, featured accents |
| Error | Signal Red | `#C1121F` | Errors, warnings, destructive actions, price drops |
| Neutral | Showroom White | `#F5F7FA` | Main page backgrounds and clean surfaces |
| Neutral Variant | Silver Lot | `#D9E2EC` | Cards, borders, dividers, input fields, filter panels |
| Extended Success | Pine Green | `#2F6F3E` | Verified vehicle, approved financing, warranty, trust messaging |

## 4. Typography

Use **Montserrat** for headings and brand moments.  
Use **Inter** for UI, body, inventory, filters, buttons, pricing, and specs.

| Token | Size | Line Height | Font | Weight |
|---|---:|---:|---|---:|
| display-xl | 64px | 68px | Montserrat | 800 |
| display-lg | 56px | 60px | Montserrat | 800 |
| display-md | 48px | 54px | Montserrat | 700 |
| headline-lg | 40px | 46px | Montserrat | 700 |
| headline-md | 32px | 40px | Montserrat | 700 |
| headline-sm | 28px | 36px | Montserrat | 700 |
| title-lg | 24px | 32px | Inter | 700 |
| title-md | 20px | 28px | Inter | 600 |
| title-sm | 18px | 24px | Inter | 600 |
| body-lg | 18px | 30px | Inter | 400 |
| body-md | 16px | 26px | Inter | 400 |
| body-sm | 14px | 22px | Inter | 400 |
| label-lg | 16px | 20px | Inter | 700 |
| label-md | 14px | 18px | Inter | 600 |
| label-sm | 12px | 16px | Montserrat | 700 |

## 5. Component Rules

### Primary Button
- Background: `#008FDB`
- Text: white
- Hover: `#00648F`
- Radius: 12px
- Font: Inter 700
- Minimum height: 44px

### Secondary Button
- Background: `#F5F7FA`
- Text: `#101820`
- Border: `#D9E2EC`
- Radius: 12px
- Font: Inter 700

### Vehicle Card
- Background: white
- Border: `1px solid #D9E2EC`
- Radius: 16px
- Shadow: `0 8px 24px rgba(16, 24, 32, 0.12)`
- Price: Inter 800 with tabular numbers
- CTA: Axio Blue

Vehicle card hierarchy:
1. Image
2. Vehicle title
3. Price
4. Specs
5. Location
6. CTA

### Badge Rules
Use no more than 2–3 badges per vehicle card.

| Badge | Color |
|---|---|
| Great Value | `#008FDB` |
| Premium Selection | `#C58B2A` |
| Verified Vehicle | `#2F6F3E` |
| Price Drop | `#C1121F` |
| New Arrival | `#101820` |
| Low Mileage | `#D9E2EC` |

## 6. Accessibility

- Meet WCAG AA contrast.
- Buttons must be at least 44px tall.
- Focus states must be visible.
- Do not rely on color alone.
- Error states must include text and icon.
- Prices and mileage must be easy to scan.
