# OffGrid.ke

A blog and tools site helping Kenyans evaluate off-grid and independent living options — solar power, water, and alternatives to the national grid — backed by real local pricing data.

**Live:** [offgrid.ke](https://offgrid.ke)

## Tools

- **Solar System Calculator** — enter your appliances and county, get a panel/battery/inverter recommendation priced in KSh, downloadable as a PDF
- **Grid vs Solar vs Generator** — compares 10–25 year cost of KPLC, solar, and generator for a given home size, with payback periods

Energy pricing (KPLC rate, fuel price, inflation, equipment costs) is centralized in one constants file so both tools stay in sync when prices change.

## Also includes

- A blog (posts index, individual post pages, reading progress indicator)
- Newsletter signup (via Formspree)
- SEO metadata per page

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React + Vite |
| Routing | React Router |
| Animation | Framer Motion |
| Icons | Lucide |
| PDF export | Client-side PDF generation for calculator results |

## Running locally

```bash
npm install
npm run dev
npm run build
```
