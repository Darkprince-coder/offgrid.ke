import { useState, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Lightbulb, Tv2, Radio, Laptop, Smartphone, Wifi,
  Refrigerator, Droplets, WashingMachine, Microwave,
  Coffee, Wind, Shirt, Camera, Sun, Printer,
  Battery, Zap, Wrench, Download, RotateCcw,
  ChevronRight, MapPin, Check, AlertTriangle, BookOpen,
  Plus, Trash2, ChevronDown, ChevronUp, Info, Share2, X
} from 'lucide-react'
import SEOHead from '../../components/SEOHead'
import { PRICES, COUNTIES, FORMSPREE_URL, fmt, fmtN } from '../../data/constants'
import { downloadPDF } from '../../utils/downloadPDF'

// ── Default appliances ────────────────────────────────────────────────────────
const DEFAULT_APPLIANCES = [
  { id: 1,  Icon: Lightbulb,     name: 'LED Bulbs (×8)',        watts: 80,   hours: 5,   surge: 1.0, active: true,  category: 'lighting' },
  { id: 2,  Icon: Tv2,           name: 'TV 32"',                watts: 60,   hours: 5,   surge: 1.0, active: true,  category: 'entertainment' },
  { id: 3,  Icon: Radio,         name: 'Decoder / DStv',        watts: 20,   hours: 5,   surge: 1.0, active: true,  category: 'entertainment' },
  { id: 4,  Icon: Laptop,        name: 'Laptop',                watts: 60,   hours: 4,   surge: 1.0, active: true,  category: 'office' },
  { id: 5,  Icon: Smartphone,    name: 'Phone Charging (×3)',   watts: 30,   hours: 2,   surge: 1.0, active: true,  category: 'office' },
  { id: 6,  Icon: Wifi,          name: 'Wi-Fi Router',          watts: 15,   hours: 16,  surge: 1.0, active: true,  category: 'office' },
  { id: 7,  Icon: Refrigerator,  name: 'Refrigerator 120L',     watts: 80,   hours: 24,  surge: 2.5, active: false, category: 'kitchen' },
  { id: 8,  Icon: Droplets,      name: 'Water Pump 0.5HP',      watts: 375,  hours: 1,   surge: 3.0, active: false, category: 'pump' },
  { id: 9,  Icon: WashingMachine,name: 'Washing Machine',       watts: 500,  hours: 1,   surge: 2.5, active: false, category: 'kitchen' },
  { id: 10, Icon: Microwave,     name: 'Microwave',             watts: 900,  hours: 0.5, surge: 1.2, active: false, category: 'kitchen' },
  { id: 11, Icon: Coffee,        name: 'Electric Kettle',       watts: 1500, hours: 0.3, surge: 1.0, active: false, category: 'kitchen' },
  { id: 12, Icon: Wind,          name: 'Air Conditioner 1HP',   watts: 900,  hours: 4,   surge: 3.0, active: false, category: 'cooling' },
  { id: 13, Icon: Shirt,         name: 'Iron Box',              watts: 1000, hours: 0.5, surge: 1.0, active: false, category: 'kitchen' },
  { id: 14, Icon: Camera,        name: 'Security Cameras (×4)', watts: 40,   hours: 24,  surge: 1.0, active: false, category: 'security' },
  { id: 15, Icon: Sun,           name: 'Outdoor Lights (×4)',   watts: 60,   hours: 6,   surge: 1.0, active: false, category: 'lighting' },
  { id: 16, Icon: Printer,       name: 'Printer / Copier',      watts: 400,  hours: 0.5, surge: 1.5, active: false, category: 'office' },
]

const WATT_HINTS = {
  1:  'Tip: LED bulb = 5–15W each. 8 bulbs × 10W = 80W. Check the label.',
  2:  'Tip: 32" TV ≈ 40–80W · 43" ≈ 80–120W · 55" ≈ 100–150W',
  7:  'Tip: Check fridge label. 100L ≈ 60W · 200L ≈ 80W · 300L+ ≈ 120W',
  8:  'Tip: 0.5HP pump ≈ 375W · 1HP ≈ 750W. Check the motor nameplate.',
  12: 'Tip: 1HP AC ≈ 900W · 1.5HP ≈ 1200W · 2HP ≈ 1500W',
}

// ── Sub-components ────────────────────────────────────────────────────────────
function StepBar({ step }) {
  const steps = ['Appliances', 'Battery & Backup', 'Your Results']
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem' }}>
      {steps.map((s, i) => {
        const active = i + 1 === step
        const done   = i + 1 < step
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', background: done ? 'var(--color-sun)' : active ? 'var(--color-ink)' : 'var(--color-rule)', color: done || active ? '#fff' : 'var(--color-muted)', transition: 'all 0.3s' }}>
                {done ? <Check size={16} strokeWidth={3} /> : i + 1}
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: active ? 700 : 500, color: active ? 'var(--color-ink)' : 'var(--color-muted)', whiteSpace: 'nowrap' }}>{s}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 2, background: done ? 'var(--color-sun)' : 'var(--color-rule)', margin: '0 0.5rem', marginBottom: '1.4rem', transition: 'background 0.3s' }} />}
          </div>
        )
      })}
    </div>
  )
}

function InlineNumber({ value, onChange, min = 0, max, step = 1, suffix = '' }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
      <input type="number" value={value} min={min} max={max} step={step}
        onChange={e => onChange(Number(e.target.value) || 0)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ width: suffix === 'W' ? 62 : 48, padding: '0.25rem 0.4rem', border: `1.5px solid ${focused ? 'var(--color-sun)' : 'var(--color-rule)'}`, borderRadius: 6, fontSize: '0.83rem', fontWeight: 600, textAlign: 'center', color: 'var(--color-ink)', background: focused ? '#fffaf5' : 'var(--color-paper)', outline: 'none', transition: 'border-color 0.15s' }} />
      {suffix && <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)', fontWeight: 600 }}>{suffix}</span>}
    </div>
  )
}

function ResultRow({ label, value, sub }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.75rem 0', borderBottom: '1px solid var(--color-rule)', gap: '0.5rem' }}>
      <div>
        <div style={{ fontSize: '0.87rem', color: 'var(--color-ink-2)', fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginTop: '0.15rem' }}>{sub}</div>}
      </div>
      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-ink)', flexShrink: 0 }}>{value}</span>
    </div>
  )
}

function ComponentCard({ Icon, title, spec, price, note, color = 'var(--color-sun)' }) {
  return (
    <div style={{ border: '1.5px solid var(--color-rule)', borderRadius: 10, padding: '1rem', background: '#fff', borderLeft: `4px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} strokeWidth={2.5} color={color} />
        </div>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fff', background: color, padding: '0.18rem 0.55rem', borderRadius: 20 }}>{price}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-ink)', marginBottom: '0.18rem' }}>{title}</div>
      <div style={{ fontSize: '0.82rem', color, fontWeight: 600, marginBottom: '0.18rem' }}>{spec}</div>
      {note && <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>{note}</div>}
    </div>
  )
}

function EnergyBreakdownBar({ appliances }) {
  const active = appliances.filter(a => a.active && a.watts > 0)
  const total  = active.reduce((s, a) => s + a.watts * a.hours, 0)
  if (total === 0 || active.length === 0) return null
  const COLORS = ['#d4721a','#1d5c7a','#2d6a2d','#7c3aed','#c65d00','#0e4a5e','#b91c1c']
  return (
    <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--color-paper-2)', borderRadius: 10, border: '1px solid var(--color-rule)' }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--color-muted)', marginBottom: '0.6rem' }}>
        Daily energy breakdown — {(total / 1000).toFixed(2)} kWh total
      </div>
      <div style={{ display: 'flex', height: 14, borderRadius: 8, overflow: 'hidden', marginBottom: '0.7rem', gap: 1 }}>
        {active.map((a, i) => {
          const pct = ((a.watts * a.hours) / total) * 100
          return pct > 1 ? <div key={a.id} title={`${a.name}: ${(a.watts * a.hours / 1000).toFixed(2)} kWh`} style={{ width: `${pct}%`, background: COLORS[i % COLORS.length], transition: 'width 0.5s ease' }} /> : null
        })}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {[...active].sort((a, b) => (b.watts * b.hours) - (a.watts * a.hours)).slice(0, 5).map((a, i) => (
          <span key={a.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--color-ink-2)' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i % COLORS.length], display: 'inline-block' }} />
            {a.name} ({(a.watts * a.hours / 1000).toFixed(2)} kWh)
          </span>
        ))}
      </div>
    </div>
  )
}

function buildShareUrl(countyIdx, battType, battDays, activeIds) {
  const params = new URLSearchParams({ c: countyIdx, b: battType, d: battDays, a: activeIds.join(',') })
  return `${window.location.origin}/tools/solar-calculator?${params.toString()}`
}

// ── Main Calculator ───────────────────────────────────────────────────────────
export default function SolarCalculator() {
  const [searchParams] = useSearchParams()
  const initCounty   = Number(searchParams.get('c') || 0)
  const initBattType = searchParams.get('b') || 'lithium'
  const initBattDays = Number(searchParams.get('d') || 1)
  const initActive   = searchParams.get('a') ? searchParams.get('a').split(',').map(Number) : null

  const [step,         setStep]         = useState(initActive ? 3 : 1)
  const [appliances,   setAppliances]   = useState(() =>
    initActive ? DEFAULT_APPLIANCES.map(a => ({ ...a, active: initActive.includes(a.id) })) : DEFAULT_APPLIANCES
  )
  const [countyIdx,    setCountyIdx]    = useState(initCounty)
  const [battType,     setBattType]     = useState(initBattType)
  const [battDays,     setBattDays]     = useState(initBattDays)
  const [showAll,      setShowAll]      = useState(false)
  const [editingId,    setEditingId]    = useState(null)
  const [editingName,  setEditingName]  = useState('')
  const [showAddForm,  setShowAddForm]  = useState(false)
  const [customName,   setCustomName]   = useState('')
  const [customW,      setCustomW]      = useState('')
  const [customH,      setCustomH]      = useState('')
  const [customSurge,  setCustomSurge]  = useState('1.2')
  const [leadName,     setLeadName]     = useState('')
  const [leadPhone,    setLeadPhone]    = useState('')
  const [leadCounty,   setLeadCounty]   = useState('')
  const [leadSent,     setLeadSent]     = useState(false)
  const [leadLoading,  setLeadLoading]  = useState(false)
  const [copied,       setCopied]       = useState(false)
  const [pdfLoading,   setPdfLoading]   = useState(false)
  const [resultsVisible, setResultsVisible] = useState(initActive ? true : false)
  const [showHint,     setShowHint]     = useState(null)
  const resultsRef = useRef(null)

  const county   = COUNTIES[countyIdx]
  const sunHours = county.sunHours

  const toggle    = (id) => setAppliances(p => p.map(a => a.id === id ? { ...a, active: !a.active } : a))
  const setWatts  = (id, v) => setAppliances(p => p.map(a => a.id === id ? { ...a, watts: Math.max(0, Math.min(10000, v)) } : a))
  const setHoursF = (id, v) => setAppliances(p => p.map(a => a.id === id ? { ...a, hours: Math.max(0, Math.min(24, v)) } : a))
  const removeApp = (id)    => setAppliances(p => p.filter(a => a.id !== id))

  const saveEditName = (id) => {
    if (editingName.trim()) setAppliances(p => p.map(a => a.id === id ? { ...a, name: editingName.trim() } : a))
    setEditingId(null)
  }

  const addCustom = () => {
    if (!customName.trim() || !customW || !customH) return
    setAppliances(p => [...p, { id: Date.now(), Icon: Zap, name: customName.trim(), watts: Number(customW), hours: Number(customH), surge: Number(customSurge) || 1.2, active: true, category: 'custom' }])
    setCustomName(''); setCustomW(''); setCustomH(''); setCustomSurge('1.2')
    setShowAddForm(false)
  }

  const goToResults = () => {
    setStep(3)
    setTimeout(() => { setResultsVisible(true); resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, 50)
  }

  const handleDownload = async () => {
    setPdfLoading(true)
    try {
      await downloadPDF(R, county, battDays, appliances)
    } catch (e) {
      console.error('PDF error:', e)
    } finally {
      setPdfLoading(false)
    }
  }

  const copyShareLink = () => {
    const activeIds = appliances.filter(a => a.active && a.id <= 16).map(a => a.id)
    const url = buildShareUrl(countyIdx, battType, battDays, activeIds)
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500) })
  }

  const sorted  = [...appliances.filter(a => a.active), ...appliances.filter(a => !a.active)]
  const visible = showAll ? sorted : sorted.slice(0, 10)

  const R = useMemo(() => {
    const active      = appliances.filter(a => a.active && a.watts > 0 && a.hours > 0)
    const dailyWh     = active.reduce((s, a) => s + a.watts * a.hours, 0)
    const dailyWhAdj  = dailyWh * 1.25
    const solarW      = dailyWhAdj / sunHours
    const panels300   = Math.ceil(solarW / 300)
    const panels400   = Math.ceil(solarW / 400)
    const totalKwp    = panels300 * 0.3
    const peakSurge   = active.reduce((max, a) => Math.max(max, a.watts * a.surge), 0)
    const inverterMinKw = Math.max(solarW, peakSurge) * 1.25 / 1000

    let inverterKw, inverterCost, inverterLabel
    if      (inverterMinKw <= 3)  { inverterKw = 3;  inverterCost = PRICES.inverter3kw;  inverterLabel = '3kW Hybrid (Growatt / Deye)' }
    else if (inverterMinKw <= 5)  { inverterKw = 5;  inverterCost = PRICES.inverter5kw;  inverterLabel = '5kW Hybrid (Growatt / Deye)' }
    else if (inverterMinKw <= 8)  { inverterKw = 8;  inverterCost = PRICES.inverter8kw;  inverterLabel = '8kW Hybrid (Deye)' }
    else                          { inverterKw = 12; inverterCost = PRICES.inverter12kw; inverterLabel = '12kW Hybrid (Deye / Victron)' }

    const battWhNeeded = dailyWhAdj * battDays
    let battCount, battTotalCost, battLabel, battSpec
    if (battType === 'lithium') {
      battCount = Math.ceil(battWhNeeded / (24 * 100 * 0.9))
      battTotalCost = battCount * PRICES.battLiPo100
      battLabel = `${battCount} × 100Ah LiFePO4 (24V)`; battSpec = `${(battCount * 24 * 100 * 0.9 / 1000).toFixed(1)} kWh usable`
    } else {
      battCount = Math.ceil(battWhNeeded / (12 * 200 * 0.5))
      battTotalCost = battCount * PRICES.battLead200
      battLabel = `${battCount} × 200Ah Lead-Acid (12V)`; battSpec = `${(battCount * 12 * 200 * 0.5 / 1000).toFixed(1)} kWh usable`
    }

    const panelCost300 = panels300 * PRICES.panel300
    const panelCost400 = panels400 * PRICES.panel400
    const extras       = PRICES.mounting + PRICES.wiring + PRICES.installation
    const total300     = panelCost300 + inverterCost + battTotalCost + extras
    const total400     = panelCost400 + inverterCost + battTotalCost + extras
    const monthlyKplc  = (dailyWh / 1000) * 30 * 26
    const monthlySaving = monthlyKplc * 0.8
    const paybackYrs   = monthlySaving > 0 ? (total300 / monthlySaving / 12).toFixed(1) : null
    const tenYrSaving  = monthlySaving * 120 - total300
    const topConsumers = [...active].sort((a, b) => (b.watts * b.hours) - (a.watts * a.hours)).slice(0, 3)

    return { dailyWh: Math.round(dailyWh), dailyWhAdj: Math.round(dailyWhAdj), solarW: Math.round(solarW), panels300, panels400, totalKwp, peakSurge: Math.round(peakSurge), inverterKw, inverterLabel, inverterCost, battLabel, battSpec, battTotalCost, panelCost300, panelCost400, extras, total300, total400, monthlyKplc: Math.round(monthlyKplc), monthlySaving: Math.round(monthlySaving), paybackYrs, tenYrSaving: Math.round(tenYrSaving), topConsumers, activeCount: active.length }
  }, [appliances, sunHours, battType, battDays])

  const inputStyle   = { width: '100%', padding: '0.6rem 0.85rem', borderRadius: '7px', border: '1.5px solid var(--color-rule)', fontSize: '0.9rem', background: 'var(--color-paper)', color: 'var(--color-ink)', outline: 'none', boxSizing: 'border-box' }
  const btnPrimary   = { background: 'var(--color-sun)', color: '#fff', border: 'none', padding: '0.85rem 1.8rem', borderRadius: '9px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }
  const btnSecondary = { background: 'var(--color-paper-2)', color: 'var(--color-ink-2)', border: '1px solid var(--color-rule)', padding: '0.75rem 1.4rem', borderRadius: '9px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '3rem 5% 6rem' }}>
      <SEOHead
        title="Free Solar System Calculator for Kenya — Panels, Batteries & Inverter"
        description="Enter your appliances and county. Get an instant solar system recommendation with real Kenyan prices for panels, batteries, and inverter. Free tool, no sign-up."
        canonical="/tools/solar-calculator"
        breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'Tools', url: '/#tools' }, { name: 'Solar Calculator', url: '/tools/solar-calculator' }]}
      />

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', marginBottom: '0.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--color-sky)', fontWeight: 600 }}>Home</Link>
          <ChevronRight size={12} color="var(--color-muted)" />
          <span style={{ color: 'var(--color-muted)' }}>Tools</span>
          <ChevronRight size={12} color="var(--color-muted)" />
          <span style={{ color: 'var(--color-muted)' }}>Solar Calculator</span>
        </div>
        <span style={{ fontSize: '0.67rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-sun)', display: 'block', marginBottom: '0.5rem' }}>Free Tool — Updated March 2026</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--color-ink)', marginBottom: '0.7rem', lineHeight: 1.1 }}>Solar System Calculator</h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.98rem', lineHeight: 1.72, maxWidth: '560px' }}>Select your appliances, edit wattage to match your actual devices, and get a complete system recommendation with real Kenyan prices.</p>
      </div>

      <StepBar step={step} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.15fr) minmax(0,1fr)', gap: '2.5rem', alignItems: 'start' }} className="calc-grid">

        {/* LEFT */}
        <div>
          <div style={{ background: '#fff', border: '1.5px solid var(--color-rule)', borderRadius: '14px', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--color-ink)', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={16} strokeWidth={2.5} color="var(--color-sun)" /> Step 1 — Your Appliances
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {R.dailyWh > 0 && <span style={{ background: 'var(--color-sun)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: 20 }}>{(R.dailyWh/1000).toFixed(2)} kWh/day</span>}
                <span style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', padding: '0.2rem 0.65rem', borderRadius: 20 }}>{R.activeCount} selected</span>
              </div>
            </div>
            <div style={{ padding: '1.2rem 1.5rem' }}>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.84rem', color: 'var(--color-ink)', marginBottom: '0.45rem' }}>
                  <MapPin size={14} strokeWidth={2.5} color="var(--color-sun)" /> Your county or region
                </label>
                <select value={countyIdx} onChange={e => setCountyIdx(Number(e.target.value))} style={inputStyle}>
                  {COUNTIES.map((c, i) => <option key={i} value={i}>{c.name} — {c.sunHours} sun hrs/day</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 72px 56px 44px', gap: '0.4rem', padding: '0 0.9rem 0.4rem' }}>
                {['Appliance', 'Watts', 'Hrs/day', 'Wh'].map(h => (
                  <span key={h} style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--color-muted)', textAlign: h !== 'Appliance' ? 'center' : 'left' }}>{h}</span>
                ))}
              </div>

              <div style={{ border: '1px solid var(--color-rule)', borderRadius: '8px', overflow: 'hidden' }}>
                {visible.map((a, idx) => {
                  const wh       = Math.round(a.watts * a.hours)
                  const isLast   = idx === visible.length - 1
                  const isCustom = a.id > 16
                  return (
                    <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '1fr 72px 56px 44px', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem', borderBottom: !isLast ? '1px solid var(--color-rule)' : 'none', background: a.active ? '#fff' : 'var(--color-paper)', position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                        <input type="checkbox" checked={a.active} onChange={() => toggle(a.id)} style={{ width: 15, height: 15, accentColor: 'var(--color-sun)', cursor: 'pointer', flexShrink: 0 }} />
                        <div style={{ width: 24, height: 24, borderRadius: 5, background: a.active ? 'var(--color-paper-2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <a.Icon size={13} strokeWidth={2.5} color={a.active ? 'var(--color-sun)' : 'var(--color-muted)'} />
                        </div>
                        {editingId === a.id ? (
                          <input autoFocus value={editingName} onChange={e => setEditingName(e.target.value)} onBlur={() => saveEditName(a.id)} onKeyDown={e => e.key === 'Enter' && saveEditName(a.id)}
                            style={{ flex: 1, fontSize: '0.83rem', padding: '0.18rem 0.35rem', border: '1.5px solid var(--color-sun)', borderRadius: 5, outline: 'none', minWidth: 0, color: 'var(--color-ink)', background: '#fffaf5' }} />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', minWidth: 0, flex: 1 }}>
                            <span onClick={() => { setEditingId(a.id); setEditingName(a.name) }} style={{ fontSize: '0.83rem', color: a.active ? 'var(--color-ink)' : 'var(--color-muted)', fontWeight: a.active ? 500 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'text', flex: 1 }}>{a.name}</span>
                            {WATT_HINTS[a.id] && <button onClick={() => setShowHint(showHint === a.id ? null : a.id)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--color-muted)', display: 'flex', flexShrink: 0 }}><Info size={11} strokeWidth={2.5} /></button>}
                            {isCustom && <button onClick={() => removeApp(a.id)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#c0392b', display: 'flex', flexShrink: 0 }}><Trash2 size={12} strokeWidth={2.5} /></button>}
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        {a.active ? <InlineNumber value={a.watts} onChange={v => setWatts(a.id, v)} min={0} max={10000} step={10} suffix="W" />
                          : <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{a.watts}W</span>}
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        {a.active ? <InlineNumber value={a.hours} onChange={v => setHoursF(a.id, v)} min={0} max={24} step={0.5} suffix="h" />
                          : <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{a.hours}h</span>}
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        {a.active && wh > 0 ? <span style={{ fontSize: '0.72rem', fontWeight: 700, color: wh > 2000 ? '#c65d00' : 'var(--color-sky)' }}>{fmtN(wh)}</span>
                          : <span style={{ fontSize: '0.7rem', color: 'var(--color-rule)' }}>—</span>}
                      </div>
                    </div>
                  )
                })}
              </div>

              {showHint && WATT_HINTS[showHint] && (
                <div style={{ marginTop: '0.5rem', background: '#fffaf0', border: '1px solid #f5d9c0', borderLeft: '3px solid var(--color-sun)', borderRadius: 8, padding: '0.6rem 0.9rem', fontSize: '0.78rem', color: 'var(--color-ink-2)', lineHeight: 1.6 }}>
                  💡 {WATT_HINTS[showHint]}
                </div>
              )}

              {appliances.length > 10 && (
                <button onClick={() => setShowAll(p => !p)} style={{ width: '100%', marginTop: '0.5rem', background: 'none', border: '1px dashed var(--color-rule)', borderRadius: 7, padding: '0.45rem', fontSize: '0.8rem', color: 'var(--color-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                  {showAll ? <><ChevronUp size={14} strokeWidth={2.5} /> Show fewer</> : <><ChevronDown size={14} strokeWidth={2.5} /> Show all {appliances.length} appliances</>}
                </button>
              )}

              <EnergyBreakdownBar appliances={appliances} />

              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--color-rule)' }}>
                {!showAddForm ? (
                  <button onClick={() => setShowAddForm(true)} style={{ width: '100%', background: 'var(--color-paper-2)', border: '1.5px dashed var(--color-rule)', borderRadius: 8, padding: '0.6rem', fontSize: '0.83rem', fontWeight: 600, color: 'var(--color-ink-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <Plus size={15} strokeWidth={2.5} /> Add custom appliance
                  </button>
                ) : (
                  <div style={{ background: 'var(--color-paper-2)', border: '1.5px solid var(--color-rule)', borderRadius: 10, padding: '1rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.7rem' }}>Add custom appliance</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <input type="text" value={customName} onChange={e => setCustomName(e.target.value)} placeholder="Appliance name" style={{ ...inputStyle, fontSize: '0.85rem' }} />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                        {[
                          { label: 'Watts (W) *', val: customW, set: setCustomW, ph: 'e.g. 150' },
                          { label: 'Hours/day *', val: customH, set: setCustomH, ph: 'e.g. 8' },
                          { label: 'Surge ×', val: customSurge, set: setCustomSurge, ph: '1.2', step: '0.1' },
                        ].map(f => (
                          <div key={f.label}>
                            <label style={{ fontSize: '0.72rem', color: 'var(--color-muted)', display: 'block', marginBottom: '0.2rem', fontWeight: 600 }}>{f.label}</label>
                            <input type="number" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} step={f.step} style={{ ...inputStyle, fontSize: '0.85rem' }} />
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: '0.7rem', color: 'var(--color-muted)', lineHeight: 1.5 }}>Surge: motors draw 2–3× on startup. Use 1.0 for kettles/bulbs, 2.5 for fridge, 3.0 for pumps/AC.</p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={addCustom} style={{ flex: 1, background: 'var(--color-sun)', color: '#fff', border: 'none', padding: '0.55rem', borderRadius: 7, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Add</button>
                        <button onClick={() => setShowAddForm(false)} style={{ background: 'var(--color-paper)', color: 'var(--color-muted)', border: '1px solid var(--color-rule)', padding: '0.55rem 0.9rem', borderRadius: 7, fontSize: '0.85rem', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={() => setStep(2)} style={{ ...btnPrimary, marginTop: '1.4rem' }}>
                Continue to Battery Settings <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {step >= 2 && (
            <div style={{ background: '#fff', border: '1.5px solid var(--color-rule)', borderRadius: '14px', overflow: 'hidden', marginBottom: '1.5rem', animation: 'fadeUp 0.35s ease' }}>
              <div style={{ background: 'var(--color-sky)', padding: '1rem 1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Battery size={16} strokeWidth={2.5} /> Step 2 — Battery & Backup
                </h2>
              </div>
              <div style={{ padding: '1.4rem 1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.84rem', color: 'var(--color-ink)', marginBottom: '0.7rem' }}>Battery type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem', marginBottom: '1.3rem' }}>
                  {[
                    { val: 'lithium', label: 'Lithium LiFePO4', sub: 'Best life, zero maintenance', pros: '8–15 yr · 90% usable' },
                    { val: 'lead',    label: 'Lead-Acid AGM',    sub: 'Lower upfront cost',          pros: '2–5 yr · 50% usable' },
                  ].map(b => (
                    <label key={b.val} style={{ border: `2px solid ${battType === b.val ? 'var(--color-sun)' : 'var(--color-rule)'}`, borderRadius: '9px', padding: '0.9rem', cursor: 'pointer', background: battType === b.val ? '#fff8f0' : '#fff', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <input type="radio" name="batt" value={b.val} checked={battType === b.val} onChange={() => setBattType(b.val)} style={{ accentColor: 'var(--color-sun)' }} />
                        <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-ink)' }}>{b.label}</span>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: 'var(--color-muted)', paddingLeft: '1.2rem' }}>{b.sub}</span>
                      <span style={{ fontSize: '0.72rem', color: battType === b.val ? 'var(--color-sun)' : 'var(--color-muted)', paddingLeft: '1.2rem', fontWeight: 600 }}>{b.pros}</span>
                    </label>
                  ))}
                </div>

                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.84rem', color: 'var(--color-ink)', marginBottom: '0.55rem' }}>
                  Days of backup: <span style={{ color: 'var(--color-sun)', fontWeight: 800 }}>{battDays} day{battDays > 1 ? 's' : ''}</span>
                </label>
                <input type="range" min="1" max="3" step="1" value={battDays} onChange={e => setBattDays(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--color-sun)', cursor: 'pointer' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: '0.2rem', marginBottom: '0.8rem' }}>
                  <span>1 day (grid-tied)</span><span>2 days</span><span>3 days (full off-grid)</span>
                </div>

                <div style={{ background: 'var(--color-paper-2)', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '0.65rem 0.9rem', marginBottom: '1.2rem', fontSize: '0.8rem', color: 'var(--color-ink-2)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <span>Recommended: <strong style={{ color: 'var(--color-ink)' }}>{R.battLabel}</strong></span>
                  <span style={{ color: 'var(--color-sky)', fontWeight: 600 }}>{R.battSpec}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                  <button onClick={goToResults} style={{ ...btnPrimary, flex: 1 }}>
                    <Sun size={16} strokeWidth={2.5} /> Get My Solar Estimate
                  </button>
                  <button onClick={() => setStep(1)} style={btnSecondary}>
                    <RotateCcw size={14} strokeWidth={2.5} /> Back
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Results */}
        <div ref={resultsRef} style={{ position: 'sticky', top: '80px' }}>
          {step < 3 ? (
            <div style={{ background: 'var(--color-paper-2)', border: '2px dashed var(--color-rule)', borderRadius: '14px', padding: '2.5rem 2rem', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Sun size={26} strokeWidth={2} color="var(--color-sun)" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.5rem' }}>Your estimate appears here</h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-muted)', lineHeight: 1.65, marginBottom: '1.5rem' }}>Select appliances and edit wattage to match your devices.</p>
              {R.activeCount > 0 && (
                <div style={{ background: '#fff', borderRadius: 12, padding: '1.2rem', textAlign: 'left', border: '1px solid var(--color-rule)' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-muted)', marginBottom: '0.6rem' }}>Live preview</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-sun)', lineHeight: 1 }}>{(R.dailyWh/1000).toFixed(2)} kWh/day</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginTop: '0.3rem', marginBottom: '0.8rem' }}>{R.activeCount} appliances · ~{R.solarW}W solar needed</div>
                  {R.topConsumers.length > 0 && (
                    <>
                      <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--color-muted)', marginBottom: '0.4rem' }}>Top consumers</div>
                      {R.topConsumers.map((a, i) => (
                        <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '0.2rem 0', borderBottom: i < R.topConsumers.length - 1 ? '1px solid var(--color-rule)' : 'none' }}>
                          <span style={{ color: 'var(--color-ink-2)' }}>{a.name}</span>
                          <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{(a.watts * a.hours / 1000).toFixed(2)} kWh</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div style={{ animation: resultsVisible ? 'fadeUp 0.4s ease' : 'none' }}>
              <div style={{ background: 'var(--color-ink)', borderRadius: '14px', padding: '1.6rem', marginBottom: '1.2rem' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.4)', marginBottom: '0.8rem' }}>Daily Energy Profile</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  {[
                    { label: 'Daily usage',        val: `${(R.dailyWh/1000).toFixed(2)} kWh` },
                    { label: 'With losses',         val: `${(R.dailyWhAdj/1000).toFixed(2)} kWh` },
                    { label: 'Solar capacity',      val: `${R.solarW}W` },
                    { label: `${county.name} sun`, val: `${sunHours} hrs/day` },
                  ].map(item => (
                    <div key={item.label} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 8, padding: '0.8rem' }}>
                      <div style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '0.25rem' }}>{item.label}</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-sun)', fontFamily: 'var(--font-display)' }}>{item.val}</div>
                    </div>
                  ))}
                </div>
                {R.peakSurge > 500 && (
                  <div style={{ marginTop: '0.8rem', background: 'rgba(212,114,26,0.15)', borderRadius: 7, padding: '0.6rem 0.9rem', fontSize: '0.76rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={14} strokeWidth={2.5} color="var(--color-sun)" />
                    Peak surge: <strong style={{ color: 'var(--color-sun)' }}>{R.peakSurge}W</strong> — inverter sized for motor startup
                  </div>
                )}
              </div>

              <div style={{ background: 'var(--color-sun)', borderRadius: '12px', padding: '1.2rem 1.5rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.7)', marginBottom: '0.2rem' }}>Recommended System</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{R.totalKwp.toFixed(1)} kWp</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.7)', marginBottom: '0.2rem' }}>Total Estimate</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{fmt(R.total300)}</div>
                </div>
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-muted)', marginBottom: '0.7rem' }}>System Components</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <ComponentCard Icon={Sun}     title="Solar Panels"   spec={`${R.panels300} × 300W`}   price={fmt(R.panelCost300)} note={`${R.totalKwp.toFixed(1)} kWp · Mono PERC`}     color="var(--color-sun)" />
                  <ComponentCard Icon={Battery} title="Batteries"      spec={R.battLabel}                price={fmt(R.battTotalCost)} note={R.battSpec}                                     color="var(--color-sky)" />
                  <ComponentCard Icon={Zap}     title="Inverter"       spec={`${R.inverterKw}kW Hybrid`} price={fmt(R.inverterCost)} note={R.inverterLabel}                                color="#2d6a2d" />
                  <ComponentCard Icon={Wrench}  title="Installation"   spec="Full install"               price={fmt(R.extras)}       note="Mounting, cables, breakers, labour"             color="#7c3aed" />
                </div>
              </div>

              <div style={{ background: '#fff', border: '1.5px solid var(--color-rule)', borderRadius: '12px', padding: '1.3rem', marginBottom: '1.2rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-muted)', marginBottom: '0.7rem' }}>Cost Breakdown</div>
                <ResultRow label={`${R.panels300} × 300W panels`}       value={fmt(R.panelCost300)} />
                <ResultRow label={`Or: ${R.panels400} × 400W panels`}   value={fmt(R.panelCost400)} sub="Fewer panels, same output" />
                <ResultRow label={R.inverterLabel}                       value={fmt(R.inverterCost)} />
                <ResultRow label={R.battLabel}                           value={fmt(R.battTotalCost)} sub={R.battSpec} />
                <ResultRow label="Mounting, wiring & installation"       value={fmt(R.extras)} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.9rem', marginTop: '0.4rem', borderTop: '2px solid var(--color-ink)' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-ink)' }}>Total (300W panels)</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-sun)' }}>{fmt(R.total300)}</span>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: '0.5rem', fontStyle: 'italic', lineHeight: 1.5 }}>Nairobi market prices, March 2026. Get at least 3 quotes.</p>
              </div>

              {R.monthlyKplc > 0 && (
                <div style={{ background: 'linear-gradient(135deg,var(--color-sky),#0e3f57)', borderRadius: '12px', padding: '1.3rem', marginBottom: '1.2rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)', marginBottom: '0.8rem' }}>Return on Investment</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
                    {[
                      { label: 'Est. monthly KPLC bill', val: fmt(R.monthlyKplc) },
                      { label: 'Monthly savings (80%)',  val: fmt(R.monthlySaving) },
                      { label: 'Payback period',         val: R.paybackYrs ? `~${R.paybackYrs} yrs` : 'N/A' },
                      { label: '10-year net savings',    val: R.tenYrSaving > 0 ? fmt(R.tenYrSaving) : 'N/A' },
                    ].map(item => (
                      <div key={item.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 7, padding: '0.8rem' }}>
                        <div style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.3rem' }}>{item.label}</div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
                <button onClick={handleDownload} disabled={pdfLoading}
                  style={{ flex: 1, background: 'var(--color-ink)', color: '#fff', border: 'none', padding: '0.75rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: pdfLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: pdfLoading ? 0.7 : 1, transition: 'opacity 0.2s' }}>
                  <Download size={14} strokeWidth={2.5} />
                  {pdfLoading ? 'Generating PDF...' : 'Download PDF'}
                </button>
                <button onClick={copyShareLink}
                  style={{ flex: 1, background: copied ? '#2d6a2d' : 'var(--color-paper-2)', color: copied ? '#fff' : 'var(--color-ink)', border: '1px solid var(--color-rule)', padding: '0.75rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }}>
                  {copied ? <><Check size={14} strokeWidth={2.5} /> Copied!</> : <><Share2 size={14} strokeWidth={2.5} /> Share</>}
                </button>
                <button onClick={() => { setStep(1); setResultsVisible(false); setAppliances(DEFAULT_APPLIANCES) }} style={btnSecondary}>
                  <RotateCcw size={14} strokeWidth={2.5} /> Reset
                </button>
              </div>

              {/* Lead gen */}
              <div style={{ background: 'linear-gradient(135deg,#1a2e1a,#2c5f2e)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>Want installer quotes near you?</h3>
                <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.2rem', lineHeight: 1.6 }}>Leave your details and verified local installers will contact you with quotes based on this estimate.</p>
                {leadSent ? (
                  <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 9, padding: '1rem', textAlign: 'center', color: '#fff', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Check size={18} strokeWidth={2.5} color="#4ade80" /> Received. Installers will contact you within 24 hours.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    {[
                      { val: leadName,   set: setLeadName,   ph: 'Your name', type: 'text' },
                      { val: leadPhone,  set: setLeadPhone,  ph: 'Phone or WhatsApp number', type: 'tel' },
                      { val: leadCounty, set: setLeadCounty, ph: 'Your county or town', type: 'text' },
                    ].map(f => (
                      <input key={f.ph} type={f.type} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                        style={{ ...inputStyle, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }} />
                    ))}
                    <button
                      onClick={async () => {
                        if (!leadName || !leadPhone) return
                        setLeadLoading(true)
                        try {
                          await fetch(FORMSPREE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ name: leadName, phone: leadPhone, county: leadCounty, system: `${R.totalKwp.toFixed(1)}kWp — ${R.inverterLabel} — ${R.battLabel}`, cost: fmt(R.total300), _subject: `New installer lead: ${leadName} (${leadCounty || 'county not given'})` }) })
                        } catch (e) { /* show success anyway */ }
                        setLeadLoading(false); setLeadSent(true)
                      }}
                      disabled={leadLoading}
                      style={{ background: 'var(--color-sun)', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: leadLoading ? 'not-allowed' : 'pointer', opacity: leadLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      {leadLoading ? 'Sending...' : <><ChevronRight size={16} strokeWidth={2.5} /> Get Free Installer Quotes</>}
                    </button>
                    <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', textAlign: 'center' }}>Details shared only with vetted local installers.</p>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <Link to="/posts/solar-3-bedroom-house" style={{ flex: 1, background: 'var(--color-paper-2)', border: '1px solid var(--color-rule)', color: 'var(--color-ink)', padding: '0.65rem 1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.83rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <BookOpen size={14} strokeWidth={2.5} /> Solar Guide
                </Link>
                <Link to="/posts/lithium-vs-lead-acid" style={{ flex: 1, background: 'var(--color-paper-2)', border: '1px solid var(--color-rule)', color: 'var(--color-ink)', padding: '0.65rem 1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.83rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <Battery size={14} strokeWidth={2.5} /> Battery Guide
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @media (max-width: 800px) { .calc-grid { grid-template-columns: 1fr !important; } }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.5; }
      `}</style>
    </div>
  )
}
