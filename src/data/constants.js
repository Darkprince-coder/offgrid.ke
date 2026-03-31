// ─────────────────────────────────────────────────────────────────────────────
// SHARED CONSTANTS — single source of truth for prices, config, and endpoints
// Update prices here and both tools reflect the change automatically
// ─────────────────────────────────────────────────────────────────────────────

// ── Endpoints ────────────────────────────────────────────────────────────────
export const FORMSPREE_URL = 'https://formspree.io/f/xdawgwwb'
export const SITE_URL      = 'https://offgrid.ke'

// ── KPLC / Energy ────────────────────────────────────────────────────────────
export const KPLC_RATE    = 26    // KSh per kWh (inc. all levies, 2026)
export const FUEL_PRICE   = 185   // KSh per litre (petrol, Nairobi 2026)
export const INFLATION    = 0.08  // 8% annual energy cost inflation
export const SOLAR_LIFE   = 25    // years
export const GEN_LIFE     = 5     // years before overhaul / replacement
export const GEN_MAINT    = 12000 // annual generator maintenance KSh
export const SOLAR_MAINT  = 3000  // annual solar maintenance KSh
export const KPLC_CONNECT = 35000 // KPLC connection fee estimate

// ── Solar panel prices (KSh) ─────────────────────────────────────────────────
export const PRICES = {
  panel300:     15000,
  panel400:     20000,
  inverter3kw:  95000,
  inverter5kw:  140000,
  inverter8kw:  220000,
  inverter12kw: 320000,
  battLead200:  35000,
  battLiPo100:  120000,
  mounting:     8000,
  wiring:       22000,
  installation: 28000,
}

// ── System sizes for cost comparison ─────────────────────────────────────────
export const SYSTEM_SIZES = [
  { label: 'Small (1–2 rooms)',        kwhPerDay: 1.5, solarCost: 180000, generatorCost: 120000, fuelLDay: 1.2 },
  { label: 'Medium (3-bed, no fridge)',kwhPerDay: 2.8, solarCost: 280000, generatorCost: 160000, fuelLDay: 2.0 },
  { label: 'Large (3-bed, full home)', kwhPerDay: 5.0, solarCost: 420000, generatorCost: 220000, fuelLDay: 3.5 },
  { label: 'Business / shop',          kwhPerDay: 8.0, solarCost: 650000, generatorCost: 350000, fuelLDay: 5.5 },
]

// ── Counties / sun hours ──────────────────────────────────────────────────────
export const COUNTIES = [
  { name: 'Nairobi',               sunHours: 5.2 },
  { name: 'Mombasa / Coast',       sunHours: 5.8 },
  { name: 'Kisumu / Nyanza',       sunHours: 4.8 },
  { name: 'Nakuru / Rift Valley',  sunHours: 5.4 },
  { name: 'Eldoret / Uasin Gishu', sunHours: 5.1 },
  { name: 'Nyeri / Mt. Kenya',     sunHours: 4.7 },
  { name: 'Meru / Eastern',        sunHours: 5.0 },
  { name: 'Turkana / Northern',    sunHours: 6.2 },
  { name: 'Garissa / North East',  sunHours: 6.0 },
  { name: 'Kisii / Western',       sunHours: 4.6 },
]

// ── Formatters ────────────────────────────────────────────────────────────────
export const fmt  = (n) => 'KSh ' + Math.round(n).toLocaleString('en-KE')
export const fmtN = (n) => Math.round(n).toLocaleString('en-KE')
