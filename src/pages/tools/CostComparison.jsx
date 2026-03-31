import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../../components/SEOHead'
import {
  KPLC_RATE, FUEL_PRICE, SOLAR_LIFE, GEN_LIFE, GEN_MAINT,
  SOLAR_MAINT, KPLC_CONNECT, INFLATION, SYSTEM_SIZES, fmt
} from '../../data/constants'

export default function CostComparison() {
  const [sizeIdx,     setSizeIdx]     = useState(2)
  const [years,       setYears]       = useState(10)
  const [kwhCustom,   setKwhCustom]   = useState('')
  const [solarCustom, setSolarCustom] = useState('')

  const size = SYSTEM_SIZES[sizeIdx]
  const kwhDay   = kwhCustom   ? Number(kwhCustom)   : size.kwhPerDay
  const solarCap = solarCustom ? Number(solarCustom) : size.solarCost

  const R = useMemo(() => {
    let kplcTotal = 0
    for (let y = 1; y <= years; y++) {
      kplcTotal += kwhDay * 365 * KPLC_RATE * Math.pow(1 + INFLATION, y - 1)
    }
    kplcTotal += KPLC_CONNECT

    let genTotal = 0
    for (let y = 1; y <= years; y++) {
      genTotal += FUEL_PRICE * Math.pow(1 + INFLATION, y - 1) * size.fuelLDay * 365 + GEN_MAINT
    }
    genTotal += size.generatorCost * (1 + Math.floor(years / GEN_LIFE))

    const solarTotal       = solarCap + (SOLAR_MAINT * years)
    const kplcMonthly      = kwhDay * 30 * KPLC_RATE
    const genMonthly       = size.fuelLDay * 30 * FUEL_PRICE + GEN_MAINT / 12
    const solarMonthly     = solarCap / (SOLAR_LIFE * 12)
    const solarVsKplcBreakeven = solarCap / (kplcMonthly - SOLAR_MAINT / 12)
    const solarVsGenBreakeven  = (solarCap - size.generatorCost) / (genMonthly - solarMonthly)

    return { kplcTotal, genTotal, solarTotal, kplcMonthly, genMonthly, solarMonthly, solarVsKplcBreakeven, solarVsGenBreakeven }
  }, [sizeIdx, years, kwhDay, solarCap, size])

  const cheapest        = Math.min(R.kplcTotal, R.genTotal, R.solarTotal)
  const isSolarCheapest = R.solarTotal === cheapest
  const isGenCheapest   = R.genTotal   === cheapest
  const barMax          = Math.max(R.kplcTotal, R.genTotal, R.solarTotal)

  const Bar = ({ val, color, label }) => (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-ink)' }}>{label}</span>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color }}>{fmt(val)}</span>
      </div>
      <div style={{ height: 28, background: 'var(--color-rule)', borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(val / barMax) * 100}%`, background: color, borderRadius: 6, transition: 'width 0.6s ease', display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
          {val / barMax > 0.25 && <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>{fmt(val)}</span>}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 5% 6rem' }}>
      <SEOHead
        title="KPLC vs Solar vs Generator Cost Comparison Kenya 2026"
        description="Compare the real 10-year cost of KPLC grid power, solar, and generator in Kenya. See payback periods and KSh savings with our free tool."
        canonical="/tools/cost-comparison"
        breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'Tools', url: '/#tools' }, { name: 'Cost Comparison', url: '/tools/cost-comparison' }]}
      />

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', marginBottom: '0.8rem' }}>
          <Link to="/" style={{ color: 'var(--color-sky)', fontWeight: 600 }}>Home</Link>
          <span style={{ color: 'var(--color-muted)' }}>/</span>
          <Link to="/#tools" style={{ color: 'var(--color-sky)', fontWeight: 600 }}>Tools</Link>
          <span style={{ color: 'var(--color-muted)' }}>/</span>
          <span style={{ color: 'var(--color-muted)' }}>Cost Comparison</span>
        </div>
        <span style={{ fontSize: '0.67rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-sun)', display: 'block', marginBottom: '0.5rem' }}>Free Tool</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--color-ink)', marginBottom: '0.7rem', lineHeight: 1.1 }}>
          Grid vs Solar vs Generator
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.98rem', lineHeight: 1.72, maxWidth: '540px' }}>
          See the real {years}-year cost of each option in Kenya — including KPLC bills, fuel costs, and solar payback.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '2.5rem', alignItems: 'start' }} className="cmp-grid">

        {/* Inputs */}
        <div>
          <div style={{ background: '#fff', border: '1.5px solid var(--color-rule)', borderRadius: '14px', padding: '1.6rem', marginBottom: '1.2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '1.2rem' }}>Your home profile</h3>

            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.84rem', color: 'var(--color-ink)', marginBottom: '0.5rem' }}>Home / business size</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.3rem' }}>
              {SYSTEM_SIZES.map((s, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.7rem 0.9rem', border: `1.5px solid ${sizeIdx === i ? 'var(--color-sun)' : 'var(--color-rule)'}`, borderRadius: '8px', cursor: 'pointer', background: sizeIdx === i ? '#fff8f0' : '#fff' }}>
                  <input type="radio" name="size" checked={sizeIdx === i} onChange={() => setSizeIdx(i)} style={{ accentColor: 'var(--color-sun)' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-ink)' }}>{s.label}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--color-muted)' }}>{s.kwhPerDay} kWh/day</div>
                  </div>
                </label>
              ))}
            </div>

            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.84rem', color: 'var(--color-ink)', marginBottom: '0.5rem' }}>
              Comparison period: <span style={{ color: 'var(--color-sun)' }}>{years} years</span>
            </label>
            <input type="range" min="5" max="25" step="5" value={years} onChange={e => setYears(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--color-sun)', marginBottom: '0.2rem' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-muted)', marginBottom: '1.3rem' }}>
              {[5, 10, 15, 20, 25].map(y => <span key={y}>{y} yrs</span>)}
            </div>

            <div style={{ borderTop: '1px dashed var(--color-rule)', paddingTop: '1rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--color-muted)', marginBottom: '0.6rem' }}>Custom overrides (optional)</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
                {[
                  { label: 'Daily usage (kWh)', val: kwhCustom, set: setKwhCustom, ph: size.kwhPerDay },
                  { label: 'Solar cost (KSh)',   val: solarCustom, set: setSolarCustom, ph: size.solarCost },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ fontSize: '0.78rem', color: 'var(--color-muted)', display: 'block', marginBottom: '0.3rem' }}>{f.label}</label>
                    <input type="number" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                      style={{ width: '100%', padding: '0.45rem 0.6rem', border: '1.5px solid var(--color-rule)', borderRadius: '6px', fontSize: '0.85rem', background: 'var(--color-paper)', color: 'var(--color-ink)', outline: 'none' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--color-paper-2)', border: '1px solid var(--color-rule)', borderRadius: '10px', padding: '1rem 1.2rem', fontSize: '0.74rem', color: 'var(--color-muted)', lineHeight: 1.65 }}>
            <strong style={{ color: 'var(--color-ink-2)', display: 'block', marginBottom: '0.4rem' }}>Assumptions used</strong>
            KPLC rate (2026): KSh {KPLC_RATE}/kWh · Petrol: KSh {FUEL_PRICE}/L · Energy inflation: {INFLATION * 100}%/yr · Solar life: {SOLAR_LIFE} yrs · Generator replaced every {GEN_LIFE} yrs · Includes VAT and levies.
            <br /><em>* Estimates only. Actual costs vary.</em>
          </div>
        </div>

        {/* Results */}
        <div>
          <div style={{ background: isSolarCheapest ? 'var(--color-sun)' : isGenCheapest ? '#5b4a9e' : 'var(--color-sky)', borderRadius: '12px', padding: '1.3rem 1.5rem', marginBottom: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.6)', marginBottom: '0.25rem' }}>Cheapest over {years} years</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                {isSolarCheapest ? '☀️ Solar' : isGenCheapest ? '⛽ Generator' : '🔌 KPLC Grid'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{fmt(cheapest)}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)' }}>total {years}-year cost</div>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1.5px solid var(--color-rule)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '1.3rem' }}>
              Total {years}-year cost
            </h3>
            <Bar val={R.kplcTotal}  color="var(--color-sky)"  label="🔌 KPLC Grid" />
            <Bar val={R.genTotal}   color="#7c3aed"            label="⛽ Generator" />
            <Bar val={R.solarTotal} color="var(--color-sun)"  label="☀️ Solar" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.7rem', marginTop: '1.3rem' }}>
              {[
                { label: 'KPLC monthly',      val: fmt(R.kplcMonthly),  color: 'var(--color-sky)' },
                { label: 'Generator monthly',  val: fmt(R.genMonthly),   color: '#7c3aed' },
                { label: 'Solar monthly*',     val: fmt(R.solarMonthly), color: 'var(--color-sun)' },
              ].map(item => (
                <div key={item.label} style={{ background: 'var(--color-paper-2)', borderRadius: 8, padding: '0.8rem', borderTop: `3px solid ${item.color}` }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)', marginBottom: '0.3rem' }}>{item.label}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-ink)' }}>{item.val}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: '0.6rem' }}>* Solar monthly = amortised capital cost only — no fuel after payback.</p>
          </div>

          <div style={{ background: 'linear-gradient(135deg,var(--color-ink),#2c3e50)', borderRadius: '12px', padding: '1.4rem', marginBottom: '1.2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Solar payback periods</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              {[
                { label: 'Solar breaks even vs KPLC',              val: `~${Math.max(1, Math.round(R.solarVsKplcBreakeven / 12 * 10) / 10)} years` },
                { label: 'Solar breaks even vs Generator',         val: R.solarVsGenBreakeven > 0 ? `~${Math.round(R.solarVsGenBreakeven / 12 * 10) / 10} years` : 'Already cheaper' },
                { label: `Solar saves vs KPLC over ${years} yrs`, val: fmt(R.kplcTotal - R.solarTotal) },
                { label: `Solar saves vs Gen over ${years} yrs`,  val: fmt(R.genTotal - R.solarTotal) },
              ].map(item => (
                <div key={item.label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 7, padding: '0.8rem' }}>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.3rem' }}>{item.label}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-sun)' }}>{item.val}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
            <Link to="/tools/solar-calculator" style={{ flex: 1, background: 'var(--color-sun)', color: '#fff', padding: '0.75rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem', textAlign: 'center' }}>
              ☀️ Size My Solar System
            </Link>
            <Link to="/posts/solar-3-bedroom-house" style={{ flex: 1, background: 'var(--color-paper-2)', border: '1px solid var(--color-rule)', color: 'var(--color-ink)', padding: '0.75rem 1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.88rem', textAlign: 'center' }}>
              📖 Read Solar Guide
            </Link>
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 700px) { .cmp-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
