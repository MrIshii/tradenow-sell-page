# AutoNexus Component Specs

## Buttons

### Primary Button
Use for main conversion actions:
- View Inventory
- Search Cars
- Get Approved
- Check Availability
- Schedule Test Drive
- Value Your Trade

Specs:
- Background: `#008FDB`
- Text: `#FFFFFF`
- Hover: `#00648F`
- Active: `#004766`
- Radius: 12px
- Min height: 44px
- Padding: 14px 22px
- Font: Inter 700

### Secondary Button
Use for secondary actions:
- Learn More
- Save Vehicle
- Compare
- View Details

Specs:
- Background: `#F5F7FA`
- Text: `#101820`
- Border: `1px solid #D9E2EC`
- Hover background: `#D9E2EC`
- Radius: 12px
- Min height: 44px
- Font: Inter 700

## Vehicle Cards

### Default Vehicle Card
- Background: `#FFFFFF`
- Border: `#D9E2EC`
- Radius: 16px
- Shadow: medium
- Image ratio: 4:3 or 16:10
- Title: Inter 700
- Price: Inter 800
- Specs: Inter 400–500
- CTA: Primary or secondary depending on page context

### Premium Vehicle Card
- Same base as default
- Add subtle `#C58B2A` accent line
- Optional “Premium Selection” badge
- More whitespace
- Less promotional clutter

### Budget Vehicle Card
- Same base as default
- Use “Great Value” badge in Axio Blue if needed
- Highlight monthly payment clarity
- Avoid cheap-looking red sale treatment

## Forms

Form input states:

| State | Border | Background | Helper |
|---|---|---|---|
| Default | `#D9E2EC` | `#FFFFFF` | `#667481` |
| Focus | `#008FDB` | `#FFFFFF` | `#2F3A45` |
| Error | `#C1121F` | `#FFFFFF` | `#C1121F` |
| Success | `#2F6F3E` | `#FFFFFF` | `#2F6F3E` |

Rules:
- Use field labels.
- Use helper text when useful.
- Error states need icon and text.
- Do not rely on red border alone.

## Filter Chips

Default:
- Background: `#F5F7FA`
- Border: `#D9E2EC`
- Text: `#101820`

Selected:
- Background: `#008FDB`
- Border: `#008FDB`
- Text: `#FFFFFF`

## Badges

| Badge | Background | Text |
|---|---|---|
| Great Value | `#008FDB` | `#FFFFFF` |
| Premium Selection | `#C58B2A` | `#101820` |
| Verified Vehicle | `#2F6F3E` | `#FFFFFF` |
| Price Drop | `#C1121F` | `#FFFFFF` |
| New Arrival | `#101820` | `#FFFFFF` |
| Low Mileage | `#D9E2EC` | `#101820` |
