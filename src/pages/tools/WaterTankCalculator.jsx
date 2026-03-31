import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Droplets, Users, Home, Sprout, Building2, Check, AlertTriangle, ArrowRight } from 'lucide-react'
import SEOHead from '../../components/SEOHead'

// ── Data ───────────────────────────────────────────────────────────────────────

const USE_TYPES = [
  { id: 'household', label: 'Household',      Icon: Home,      litresPerPersonPerDay: 80,  description: 'Drinking, cooking, showers, toilets, laundry' },
  { id: 'basic',     label: 'Basic use',      Icon: Users,     litresPerPersonPerDay: 40,  description: 'Drinking, cooking, and basic washing only' },
  { id: 'farm',      label: 'Small farm',     Icon: Sprout,    litresPerPersonPerDay: 150, description: 'Household + livestock + irrigation' },
  { id: 'business',  label: 'Business / shop',Icon: Building2, litresPerPersonPerDay: 50,  description: 'Staff and customer use, no heavy water needs' },
]

const SUPPLY_TYPES = [
  { id: 'rationed',   label: 'Rationed county supply',  reserveDays: 7,  description: 'Supply comes 2–3 days per week' },
  { id: 'borehole',   label: 'Borehole / well',         reserveDays: 5,  description: 'Reliable but needs backup for pump failures' },
  { id: 'rainwater',  label: 'Rainwater only',           reserveDays: 30, description: 'Must store between rain seasons' },
  { id: 'mains',      label: 'Reliable mains supply',   reserveDays: 3,  description: 'Supply is mostly reliable with occasional cuts' },
]

// Kenyan tank brands with price ranges per 1000L (approximate)
const BRANDS = [
  {
    name: 'Kentank',
    maker: 'Kentainers',
    tier: 'premium',
    pricesPer1000L: { 1000: 9500, 2000: 9000, 3000: 8800, 5000: 8200, 10000: 7800 },
    warranty: '10 years',
    material: 'Virgin polyethylene, UV-stabilised',
    best: 'Best overall. Kenya\'s most trusted brand since the 1970s.',
    colors: ['Black', 'Green', 'Blue'],
  },
  {
    name: 'Roto',
    maker: 'Roto Moulders',
    tier: 'premium',
    pricesPer1000L: { 1000: 9200, 2000: 8800, 3000: 8500, 5000: 8000, 10000: 7500 },
    warranty: '17 years',
    material: 'Triple-layer polyethylene',
    best: 'Longest warranty in Kenya. Excellent quality.',
    colors: ['Black', 'Green'],
  },
  {
    name: 'Toptank',
    maker: 'Top Tank EA',
    tier: 'premium',
    pricesPer1000L: { 1000: 9800, 2000: 9200, 3000: 9000, 5000: 8500, 10000: 8000 },
    warranty: '10 years',
    material: 'Antimicrobial virgin polyethylene',
    best: 'Best for drinking water. Antimicrobial lining inhibits bacteria.',
    colors: ['Black', 'Green', 'Blue', 'Maroon'],
  },
  {
    name: 'Techno Tanks',
    maker: 'Techno Tanks EA',
    tier: 'midrange',
    pricesPer1000L: { 1000: 7500, 2000: 7200, 3000: 7000, 5000: 6800, 10000: 6500 },
    warranty: '7 years',
    material: '100% virgin polyethylene',
    best: 'Best mid-range value. No recycled plastic.',
    colors: ['Black', 'Green'],
  },
]

const STANDARD_SIZES = [500, 1000, 2000, 3000, 5000, 8000, 10000]

function fmt(n) { return 'KSh ' + Math.round(n).toLocaleString('en-KE') }
function fmtL(n) { return n >= 1000 ? `${(n/1000).toFixed(n % 1000 === 0 ? 0 : 1)}kL` : `${n}L` }

function getPriceForBrand(brand, litres) {
  const sizes = Object.keys(brand.pricesPer1000L).map(Number).sort((a, b) => a - b)
  const closest = sizes.reduce((prev, curr) => Math.abs(curr - litres) < Math.abs(prev - litres) ? curr : prev)
  return Math.round((brand.pricesPer1000L[closest] / 1000) * litres)
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function WaterTankCalculator() {
  const [people,      setPeople]     = useState(4)
  const [useType,     setUseType]    = useState('household')
  const [supplyType,  setSupplyType] = useState('rationed')
  const [extraBuffer, setExtraBuffer]= useState(true)
  const [step,        setStep]       = useState(1)

  const selectedUse    = USE_TYPES.find(u => u.id === useType)
  const selectedSupply = SUPPLY_TYPES.find(s => s.id === supplyType)

  const R = useMemo(() => {
    const dailyLitres   = people * selectedUse.litresPerPersonPerDay
    const reserveDays   = selectedSupply.reserveDays
    const baseCapacity  = dailyLitres * reserveDays
    const recommended   = extraBuffer ? Math.ceil(baseCapacity * 1.2) : baseCapacity

    // Find the best standard tank size(s)
    const singleTank = STANDARD_SIZES.find(s => s >= recommended) || 10000
    const twoTanks   = STANDARD_SIZES.find(s => s * 2 >= recommended) || 10000
    const useTwoTanks = singleTank > 10000 || (recommended > 8000 && twoTanks <= 5000)

    return {
      dailyLitres: Math.round(dailyLitres),
      reserveDays,
      baseCapacity: Math.round(baseCapacity),
      recommended:  Math.round(recommended),
      singleTank,
      twoTanks,
      useTwoTanks,
      finalRecommendation: useTwoTanks ? twoTanks : singleTank,
      isMultiple: useTwoTanks,
    }
  }, [people, selectedUse, selectedSupply, extraBuffer])

  const inputStyle = { width: '100%', padding: '0.6rem 0.85rem', borderRadius: '7px', border: '1.5px solid var(--color-rule)', fontSize: '0.9rem', background: 'var(--color-paper)', color: 'var(--color-ink)', outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 5% 6rem' }}>
      <SEOHead
        title="Water Tank Size Calculator Kenya — How Much Storage Do You Need?"
        description="Free water tank calculator for Kenya. Enter your household size and water supply type to find the right tank capacity, with real KSh prices from Kentank, Roto, and Toptank."
        canonical="/tools/water-tank-calculator"
        breadcrumbs={[
          { name: 'Home',  url: '/' },
          { name: 'Tools', url: '/#tools' },
          { name: 'Water Tank Calculator', url: '/tools/water-tank-calculator' },
        ]}
        faqs={[
          { q: 'How big a water tank do I need in Kenya?', a: 'Multiply your number of people by 80 litres per person per day, then by the number of days you need backup storage. A family of 4 with rationed county supply needs at least 2,000–3,000 litres.' },
          { q: 'Which water tank brand is best in Kenya?', a: 'Kentank, Roto, and Toptank are the top three brands. Toptank is best for drinking water due to its antimicrobial lining. Roto has the longest warranty at 17 years. Kentank is the most widely available across Kenya.' },
        ]}
      />

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', marginBottom: '0.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--color-sky)', fontWeight: 600 }}>Home</Link>
          <ChevronRight size={12} color="var(--color-muted)" />
          <span style={{ color: 'var(--color-muted)' }}>Tools</span>
          <ChevronRight size={12} color="var(--color-muted)" />
          <span style={{ color: 'var(--color-muted)' }}>Water Tank Calculator</span>
        </div>
        <span style={{ fontSize: '0.67rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-sky)', display: 'block', marginBottom: '0.5rem' }}>Free Tool</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--color-ink)', marginBottom: '0.7rem', lineHeight: 1.1 }}>
          Water Tank Size Calculator
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.98rem', lineHeight: 1.72, maxWidth: '540px' }}>
          Find out exactly how much water storage you need and compare prices from Kenya's top tank brands.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2.5rem', alignItems: 'start' }} className="tank-grid">

        {/* LEFT — Inputs */}
        <div>
          <div style={{ background: '#fff', border: '1.5px solid var(--color-rule)', borderRadius: '14px', overflow: 'hidden', marginBottom: '1.2rem' }}>
            <div style={{ background: 'var(--color-sky)', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Droplets size={16} strokeWidth={2.5} /> Your household
              </h2>
              {R.dailyLitres > 0 && (
                <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: 20 }}>
                  {R.dailyLitres}L/day
                </span>
              )}
            </div>

            <div style={{ padding: '1.4rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>

              {/* People */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.84rem', color: 'var(--color-ink)', marginBottom: '0.55rem' }}>
                  Number of people: <span style={{ color: 'var(--color-sky)', fontWeight: 800 }}>{people}</span>
                </label>
                <input type="range" min="1" max="20" step="1" value={people} onChange={e => setPeople(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--color-sky)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                  <span>1 person</span><span>10</span><span>20 people</span>
                </div>
              </div>

              {/* Use type */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.84rem', color: 'var(--color-ink)', marginBottom: '0.6rem' }}>How will the water be used?</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {USE_TYPES.map(u => (
                    <label key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.7rem 0.9rem', border: `1.5px solid ${useType === u.id ? 'var(--color-sky)' : 'var(--color-rule)'}`, borderRadius: '8px', cursor: 'pointer', background: useType === u.id ? '#eef6fb' : '#fff', transition: 'all 0.15s' }}>
                      <input type="radio" name="useType" checked={useType === u.id} onChange={() => setUseType(u.id)} style={{ accentColor: 'var(--color-sky)', flexShrink: 0 }} />
                      <u.Icon size={16} strokeWidth={2.5} color={useType === u.id ? 'var(--color-sky)' : 'var(--color-muted)'} style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-ink)' }}>{u.label}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>{u.description} · {u.litresPerPersonPerDay}L/person/day</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Supply type */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.84rem', color: 'var(--color-ink)', marginBottom: '0.6rem' }}>Your water supply situation</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {SUPPLY_TYPES.map(s => (
                    <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.7rem 0.9rem', border: `1.5px solid ${supplyType === s.id ? 'var(--color-sky)' : 'var(--color-rule)'}`, borderRadius: '8px', cursor: 'pointer', background: supplyType === s.id ? '#eef6fb' : '#fff', transition: 'all 0.15s' }}>
                      <input type="radio" name="supplyType" checked={supplyType === s.id} onChange={() => setSupplyType(s.id)} style={{ accentColor: 'var(--color-sky)', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-ink)' }}>{s.label}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>{s.description} · {s.reserveDays} day reserve recommended</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Buffer toggle */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', padding: '0.8rem', background: 'var(--color-paper-2)', borderRadius: '8px', border: '1px solid var(--color-rule)' }}>
                <input type="checkbox" checked={extraBuffer} onChange={e => setExtraBuffer(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--color-sky)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-ink)' }}>Add 20% safety buffer</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>Recommended — accounts for guests, leaks, and dry season variation</div>
                </div>
              </label>

              <button onClick={() => setStep(2)}
                style={{ background: 'var(--color-sky)', color: '#fff', border: 'none', padding: '0.85rem', borderRadius: '9px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Droplets size={16} strokeWidth={2.5} /> Get My Tank Recommendation
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — Results */}
        <div>
          {step < 2 ? (
            <div style={{ background: 'var(--color-paper-2)', border: '2px dashed var(--color-rule)', borderRadius: '14px', padding: '2.5rem 2rem', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Droplets size={26} strokeWidth={2} color="var(--color-sky)" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.5rem' }}>Your recommendation appears here</h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-muted)', lineHeight: 1.65 }}>Fill in your household details and click Get Recommendation.</p>

              {/* Live preview */}
              <div style={{ marginTop: '1.5rem', background: '#fff', borderRadius: 12, padding: '1.2rem', border: '1px solid var(--color-rule)', textAlign: 'left' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-muted)', marginBottom: '0.6rem' }}>Live preview</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-sky)', lineHeight: 1 }}>{fmtL(R.dailyLitres)}/day</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginTop: '0.3rem' }}>
                  {people} {people === 1 ? 'person' : 'people'} × {selectedUse.litresPerPersonPerDay}L · {selectedSupply.reserveDays} day reserve
                </div>
                <div style={{ marginTop: '0.8rem', padding: '0.6rem 0.8rem', background: 'var(--color-paper-2)', borderRadius: 8, fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--color-muted)' }}>Minimum capacity: </span>
                  <strong style={{ color: 'var(--color-sky)' }}>{fmtL(R.recommended)}</strong>
                </div>
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

              {/* Calculation breakdown */}
              <div style={{ background: 'var(--color-sky)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.2rem' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.6)', marginBottom: '0.8rem' }}>Your water needs</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
                  {([
                    { label: 'Daily usage',          val: `${R.dailyLitres}L` },
                    { label: 'Reserve days',          val: `${R.reserveDays} days` },
                    { label: 'Base capacity needed',  val: fmtL(R.baseCapacity) },
                    { label: 'With 20% buffer',       val: fmtL(R.recommended) },
                  ].map(item => (
                    <div key={item.label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '0.8rem' }}>
                      <div style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.55)', marginBottom: '0.25rem' }}>{item.label}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>{item.val}</div>
                    </div>
                  )))}
                </div>
                {/* Recommendation */}
                <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>
                      {R.isMultiple ? 'Best option: 2 tanks' : 'Recommended tank size'}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                      {R.isMultiple ? `2 × ${fmtL(R.finalRecommendation)}` : fmtL(R.finalRecommendation)}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', maxWidth: 180, lineHeight: 1.5 }}>
                    {R.isMultiple
                      ? 'Two smaller tanks are easier to install and give redundancy if one fails.'
                      : `Nearest standard size above your ${fmtL(R.recommended)} requirement.`}
                  </div>
                </div>
              </div>

              {/* Brand price comparison */}
              <div style={{ background: '#fff', border: '1.5px solid var(--color-rule)', borderRadius: '14px', padding: '1.4rem', marginBottom: '1.2rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-muted)', marginBottom: '1rem' }}>
                  Price comparison — {R.isMultiple ? `2 × ${fmtL(R.finalRecommendation)}` : fmtL(R.finalRecommendation)} tank
                </div>

                {BRANDS.map((brand, i) => {
                  const price     = getPriceForBrand(brand, R.isMultiple ? R.finalRecommendation * 2 : R.finalRecommendation)
                  const isBest    = i === 0
                  return (
                    <motion.div key={brand.name}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                      style={{ padding: '0.9rem 0', borderBottom: i < BRANDS.length - 1 ? '1px solid var(--color-rule)' : 'none', display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.8rem', alignItems: 'start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-ink)' }}>{brand.name}</span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>by {brand.maker}</span>
                          {brand.tier === 'premium' && (
                            <span style={{ fontSize: '0.62rem', fontWeight: 700, background: '#fff3e0', color: 'var(--color-sun)', padding: '1px 6px', borderRadius: 4 }}>Premium</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '0.2rem' }}>{brand.best}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>
                          Warranty: {brand.warranty} · {brand.colors.join(', ')}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-sky)' }}>{fmt(price)}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>
                          {R.isMultiple ? '2 tanks' : '1 tank'}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}

                <div style={{ marginTop: '0.8rem', padding: '0.7rem', background: 'var(--color-paper-2)', borderRadius: 8, fontSize: '0.72rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                  Prices are Nairobi market estimates. Upcountry prices are 5–15% higher due to transport. Always get quotes from at least 2 suppliers.
                </div>
              </div>

              {/* Buying tips */}
              <div style={{ background: 'linear-gradient(135deg, var(--color-ink), #2c3e50)', borderRadius: '12px', padding: '1.4rem', marginBottom: '1.2rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)', marginBottom: '0.8rem' }}>3 things to check before buying</div>
                {([
                  { tip: 'Ask for the KEBS certification mark', detail: 'All reputable brands carry the Kenya Bureau of Standards Diamond Mark.' },
                  { tip: 'Choose black or dark green for outdoor use', detail: 'Dark colours block UV and prevent algae. Avoid white or light blue tanks outdoors.' },
                  { tip: 'Budget for installation extras', detail: 'Add KSh 3,000–8,000 for the tank stand, inlet pipe, overflow pipe, and tap fittings.' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.7rem', marginBottom: i < 2 ? '0.8rem' : 0 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <Check size={12} strokeWidth={2.5} color="rgba(255,255,255,0.7)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: '0.15rem' }}>{item.tip}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>{item.detail}</div>
                    </div>
                  </div>
                )))}
              </div>

              {/* Redo */}
              <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                <button onClick={() => setStep(1)}
                  style={{ flex: 1, background: 'var(--color-paper-2)', border: '1.5px solid var(--color-rule)', color: 'var(--color-ink)', padding: '0.75rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  ← Adjust inputs
                </button>
                <Link to="/posts/best-water-tanks-kenya"
                  style={{ flex: 1, background: 'var(--color-sky)', color: '#fff', padding: '0.75rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  Read Tank Guide <ArrowRight size={14} strokeWidth={2.5} />
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <style>{`@media (max-width: 700px) { .tank-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
    
  )
}