# AutoNexus — Figma Make Upload

Use this document in Figma Make to generate AutoNexus components, page layouts, and a reusable dealership UI system.

## Project

Create a responsive automotive dealership website system for **AutoNexus**, a Utah dealership with large new and used vehicle inventory.

The system must support:

- Affordable used vehicles
- Premium/high-end vehicles
- Trucks and SUVs
- Family vehicles
- EVs and hybrids
- Financing
- Trade-ins
- Inventory search
- Vehicle detail pages
- Location pages
- Trust and service messaging

## Visual Style

The design should feel:

- Modern
- Clean
- Trustworthy
- Automotive
- Fast
- Helpful
- Premium but approachable
- Affordable without looking cheap
- Utah / Mountain West grounded

Avoid:

- Cheap used-car-lot graphics
- Loud sales clutter
- Racing fonts
- Overuse of red
- Overuse of gold
- Dense inventory cards
- Confusing filters
- Low-contrast text

## Figma Color Styles

Create these Figma color styles:

```text
Axio/Primary/Axio Graphite       #101820
Axio/Secondary/Axio Blue         #008FDB
Axio/Tertiary/Wasatch Gold       #C58B2A
Axio/Error/Signal Red            #C1121F
Axio/Neutral/Showroom White      #F5F7FA
Axio/Neutral Variant/Silver Lot  #D9E2EC
Axio/Extended/Success/Pine Green #2F6F3E
```

Important:

- `#D9E2EC` is the neutral variant.
- `#2F6F3E` is extended success/trust only.
- Do not use Pine Green as a neutral surface.

## Figma Text Styles

Create these text styles:

```text
Display/XL       Montserrat 800 64/68
Display/LG       Montserrat 800 56/60
Display/MD       Montserrat 700 48/54
Headline/LG      Montserrat 700 40/46
Headline/MD      Montserrat 700 32/40
Headline/SM      Montserrat 700 28/36
Title/LG         Inter 700 24/32
Title/MD         Inter 600 20/28
Title/SM         Inter 600 18/24
Body/LG          Inter 400 18/30
Body/MD          Inter 400 16/26
Body/SM          Inter 400 14/22
Label/LG         Inter 700 16/20
Label/MD         Inter 600 14/18
Label/SM         Montserrat 700 12/16
```

Use tabular numbers for vehicle prices, mileage, payments, APR, and comparison tables.

## Layout Grid

Create responsive frames:

### Desktop
- Frame width: 1440px
- Content max width: 1200–1320px
- Gutters: 24–40px
- Inventory grid: 3–4 columns

### Tablet
- Frame width: 768px
- Inventory grid: 2 columns
- Filters collapsible

### Mobile
- Frame width: 390px
- Inventory grid: 1 column
- Bottom-sheet filters
- Sticky CTA on vehicle detail pages

## Spacing Tokens

Use an 8-point spacing system:

```text
Space/1  4px
Space/2  8px
Space/3  12px
Space/4  16px
Space/5  24px
Space/6  32px
Space/7  40px
Space/8  48px
Space/9  64px
Space/10 80px
Space/11 96px
Space/12 120px
```

## Radius Tokens

```text
Radius/XS    4px
Radius/SM    8px
Radius/MD    12px
Radius/LG    16px
Radius/XL    24px
Radius/Pill  999px
```

## Shadow Tokens

```text
Shadow/SM    0 1px 2px rgba(16, 24, 32, 0.08)
Shadow/MD    0 8px 24px rgba(16, 24, 32, 0.12)
Shadow/LG    0 18px 48px rgba(16, 24, 32, 0.18)
Shadow/Blue  0 10px 30px rgba(0, 143, 219, 0.25)
```

## Component Set to Generate

Create component variants for:

- Button / Primary / Default / Hover / Disabled
- Button / Secondary / Default / Hover / Disabled
- Button / Dark / Default / Hover / Disabled
- Badge / Great Value
- Badge / Premium Selection
- Badge / Verified Vehicle
- Badge / Price Drop
- Badge / New Arrival
- Badge / Low Mileage
- Vehicle Card / Default
- Vehicle Card / Premium
- Vehicle Card / Budget
- Filter Chip / Default / Selected
- Form Input / Default / Focus / Error / Success
- Header / Desktop / Mobile
- Footer / Desktop / Mobile
- Hero Search / Desktop / Mobile
- Price Range Card
- Body Style Card
- Financing CTA
- Trade-In CTA
- Location Card
- Review Card

## Page Templates

Generate full responsive pages for:

1. Homepage
2. Inventory Listing
3. Vehicle Detail
4. Financing
5. Trade-In
6. Locations
7. Premium Inventory
8. Budget Inventory
