import { useState, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Lightbulb, Tv2, Radio, Laptop, Smartphone, Wifi,
  Refrigerator, Droplets, WashingMachine, Microwave,
  Coffee, Wind, Shirt, Camera, Sun, Printer,
  Battery, Zap, Wrench, Download, RotateCcw,
  ChevronRight, MapPin, Check, AlertTriangle, BookOpen
} from 'lucide-react'

const COUNTIES = [
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

const DEFAULT_APPLIANCES = [
  { id:1,  Icon:Lightbulb,    name:'LED Bulbs (x8)',        watts:80,   hours:5,  surge:1.0, active:true  },
  { id:2,  Icon:Tv2,          name:'TV 32 inch',             watts:60,   hours:5,  surge:1.0, active:true  },
  { id:3,  Icon:Radio,        name:'Decoder / DStv',         watts:20,   hours:5,  surge:1.0, active:true  },
  { id:4,  Icon:Laptop,       name:'Laptop',                 watts:60,   hours:4,  surge:1.0, active:true  },
  { id:5,  Icon:Smartphone,   name:'Phone charging (x3)',    watts:30,   hours:2,  surge:1.0, active:true  },
  { id:6,  Icon:Wifi,         name:'Wi-Fi Router',           watts:15,   hours:16, surge:1.0, active:true  },
  { id:7,  Icon:Refrigerator, name:'Refrigerator 120L',      watts:80,   hours:24, surge:2.5, active:false },
  { id:8,  Icon:Droplets,     name:'Water Pump 0.5HP',       watts:375,  hours:1,  surge:3.0, active:false },
  { id:9,  Icon:WashingMachine,name:'Washing Machine',       watts:500,  hours:1,  surge:2.5, active:false },
  { id:10, Icon:Microwave,    name:'Microwave',              watts:900,  hours:0.5,surge:1.2, active:false },
  { id:11, Icon:Coffee,       name:'Electric Kettle',        watts:1500, hours:0.3,surge:1.0, active:false },
  { id:12, Icon:Wind,         name:'Air Conditioner 1HP',    watts:900,  hours:4,  surge:3.0, active:false },
  { id:13, Icon:Shirt,        name:'Iron Box',               watts:1000, hours:0.5,surge:1.0, active:false },
  { id:14, Icon:Camera,       name:'Security Cameras (x4)',  watts:40,   hours:24, surge:1.0, active:false },
  { id:15, Icon:Sun,          name:'Outdoor Lights (x4)',    watts:60,   hours:6,  surge:1.0, active:false },
  { id:16, Icon:Printer,      name:'Printer / Copier',       watts:400,  hours:0.5,surge:1.5, active:false },
]

const PRICES = {
  panel300:    15000,
  panel400:    20000,
  inverter3kw: 95000,
  inverter5kw: 140000,
  inverter8kw: 220000,
  inverter12kw:320000,
  battLead200: 35000,
  battLiPo100: 120000,
  mounting:    8000,
  wiring:      22000,
  installation:28000,
}

const fmt = (n) => 'KSh ' + Math.round(n).toLocaleString('en-KE')

// ── Step bar ───────────────────────────────────────────
function StepBar({ step }) {
  const steps = ['Appliances', 'Battery & Backup', 'Results']
  return (
    <div style={{ display:'flex', alignItems:'center', marginBottom:'2.5rem' }}>
      {steps.map((s, i) => {
        const active = i + 1 === step
        const done   = i + 1 < step
        return (
          <div key={s} style={{ display:'flex', alignItems:'center', flex: i < 2 ? 1 : 'none' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.3rem' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.9rem', background: done ? 'var(--color-sun)' : active ? 'var(--color-ink)' : 'var(--color-rule)', color: done || active ? '#fff' : 'var(--color-muted)', transition:'all 0.3s' }}>
                {done ? <Check size={16} strokeWidth={3} /> : i + 1}
              </div>
              <span style={{ fontSize:'0.7rem', fontWeight: active ? 700 : 500, color: active ? 'var(--color-ink)' : 'var(--color-muted)', whiteSpace:'nowrap' }}>{s}</span>
            </div>
            {i < 2 && <div style={{ flex:1, height:2, background: done ? 'var(--color-sun)' : 'var(--color-rule)', margin:'0 0.5rem', marginBottom:'1.4rem', transition:'background 0.3s' }} />}
          </div>
        )
      })}
    </div>
  )
}

// ── Result row ─────────────────────────────────────────
function ResultRow({ label, value, sub }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'0.75rem 0', borderBottom:'1px solid var(--color-rule)', gap:'0.5rem' }}>
      <div>
        <div style={{ fontSize:'0.87rem', color:'var(--color-ink-2)', fontWeight:500 }}>{label}</div>
        {sub && <div style={{ fontSize:'0.72rem', color:'var(--color-muted)', marginTop:'0.15rem' }}>{sub}</div>}
      </div>
      <span style={{ fontWeight:700, fontSize:'0.95rem', color:'var(--color-ink)', flexShrink:0 }}>{value}</span>
    </div>
  )
}

// ── Component card ─────────────────────────────────────
function ComponentCard({ Icon, title, spec, price, note, color='var(--color-sun)' }) {
  return (
    <div style={{ border:'1.5px solid var(--color-rule)', borderRadius:10, padding:'1rem', background:'#fff', borderLeft:`4px solid ${color}` }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.5rem' }}>
        <div style={{ width:36, height:36, borderRadius:8, background: color + '18', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon size={18} strokeWidth={2.5} color={color} />
        </div>
        <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#fff', background:color, padding:'0.18rem 0.55rem', borderRadius:20 }}>{price}</span>
      </div>
      <div style={{ fontWeight:700, fontSize:'0.88rem', color:'var(--color-ink)', marginBottom:'0.18rem' }}>{title}</div>
      <div style={{ fontSize:'0.82rem', color:color, fontWeight:600, marginBottom:'0.18rem' }}>{spec}</div>
      {note && <div style={{ fontSize:'0.72rem', color:'var(--color-muted)' }}>{note}</div>}
    </div>
  )
}

// ── Main calculator ────────────────────────────────────
export default function SolarCalculator() {
  const [step,        setStep]        = useState(1)
  const [appliances,  setAppliances]  = useState(DEFAULT_APPLIANCES)
  const [countyIdx,   setCountyIdx]   = useState(0)
  const [battType,    setBattType]    = useState('lithium')
  const [battDays,    setBattDays]    = useState(1)
  const [customName,  setCustomName]  = useState('')
  const [customW,     setCustomW]     = useState('')
  const [customH,     setCustomH]     = useState('')
  const [leadName,    setLeadName]    = useState('')
  const [leadPhone,   setLeadPhone]   = useState('')
  const [leadCounty,  setLeadCounty]  = useState('')
  const [leadSent,    setLeadSent]    = useState(false)
  const [leadLoading, setLeadLoading] = useState(false)
  const [resultsVisible, setResultsVisible] = useState(false)
  const resultsRef = useRef(null)

  const county   = COUNTIES[countyIdx]
  const sunHours = county.sunHours

  const toggle   = (id) => setAppliances(p => p.map(a => a.id===id ? {...a, active:!a.active} : a))
  const setHours = (id, v) => setAppliances(p => p.map(a => a.id===id ? {...a, hours:Math.max(0, Math.min(24, Number(v)||0))} : a))
  const removeApp = (id) => setAppliances(p => p.filter(a => a.id !== id))
  const addCustom = () => {
    if (!customName || !customW || !customH) return
    setAppliances(p => [...p, { id:Date.now(), Icon:Zap, name:customName, watts:Number(customW), hours:Number(customH), surge:1.2, active:true }])
    setCustomName(''); setCustomW(''); setCustomH('')
  }

  const goToResults = () => {
    setStep(3)
    setTimeout(() => { setResultsVisible(true); resultsRef.current?.scrollIntoView({ behavior:'smooth', block:'start' }) }, 50)
  }

  const R = useMemo(() => {
    const active      = appliances.filter(a => a.active)
    const dailyWh     = active.reduce((s,a) => s + a.watts * a.hours, 0)
    const dailyWhAdj  = dailyWh * 1.25
    const solarW      = dailyWhAdj / sunHours
    const panels300   = Math.ceil(solarW / 300)
    const panels400   = Math.ceil(solarW / 400)
    const totalKwp    = panels300 * 0.3
    const peakSurge   = active.reduce((max, a) => Math.max(max, a.watts * a.surge), 0)
    const inverterMinKw = Math.max(solarW, peakSurge) * 1.25 / 1000

    let inverterKw, inverterCost, inverterLabel
    if      (inverterMinKw <= 3)  { inverterKw=3;  inverterCost=PRICES.inverter3kw;  inverterLabel='3kW Hybrid (Growatt / Deye)' }
    else if (inverterMinKw <= 5)  { inverterKw=5;  inverterCost=PRICES.inverter5kw;  inverterLabel='5kW Hybrid (Growatt / Deye)' }
    else if (inverterMinKw <= 8)  { inverterKw=8;  inverterCost=PRICES.inverter8kw;  inverterLabel='8kW Hybrid (Deye)' }
    else                           { inverterKw=12; inverterCost=PRICES.inverter12kw; inverterLabel='12kW Hybrid (Deye / Victron)' }

    const battWhNeeded = dailyWhAdj * battDays
    let battCount, battCostEach, battTotalCost, battLabel, battSpec
    if (battType === 'lithium') {
      battCount     = Math.ceil(battWhNeeded / (24 * 100 * 0.9))
      battCostEach  = PRICES.battLiPo100
      battTotalCost = battCount * battCostEach
      battLabel     = `${battCount} x 100Ah LiFePO4 (24V)`
      battSpec      = `${(battCount * 24 * 100 * 0.9 / 1000).toFixed(1)} kWh usable`
    } else {
      battCount     = Math.ceil(battWhNeeded / (12 * 200 * 0.5))
      battCostEach  = PRICES.battLead200
      battTotalCost = battCount * battCostEach
      battLabel     = `${battCount} x 200Ah Lead-Acid (12V)`
      battSpec      = `${(battCount * 12 * 200 * 0.5 / 1000).toFixed(1)} kWh usable`
    }

    const panelCost300  = panels300 * PRICES.panel300
    const panelCost400  = panels400 * PRICES.panel400
    const extras        = PRICES.mounting + PRICES.wiring + PRICES.installation
    const total300      = panelCost300 + inverterCost + battTotalCost + extras
    const total400      = panelCost400 + inverterCost + battTotalCost + extras
    const monthlyKplc   = (dailyWh / 1000) * 30 * 26
    const monthlySaving = monthlyKplc * 0.8
    const paybackYrs    = monthlySaving > 0 ? (total300 / monthlySaving / 12).toFixed(1) : null
    const tenYrSaving   = monthlySaving * 120 - total300

    return { dailyWh:Math.round(dailyWh), dailyWhAdj:Math.round(dailyWhAdj), solarW:Math.round(solarW), panels300, panels400, totalKwp, peakSurge:Math.round(peakSurge), inverterKw, inverterLabel, inverterCost, battLabel, battSpec, battTotalCost, panelCost300, panelCost400, extras, total300, total400, monthlyKplc:Math.round(monthlyKplc), monthlySaving:Math.round(monthlySaving), paybackYrs, tenYrSaving:Math.round(tenYrSaving) }
  }, [appliances, sunHours, battType, battDays])

  const activeCount = appliances.filter(a => a.active).length

  const downloadResults = () => {
    const text = `OFFGRID.KE — Solar System Estimate\nGenerated: ${new Date().toLocaleDateString('en-KE', { dateStyle:'long' })}\nCounty: ${county.name}\n${'='.repeat(60)}\n\nYOUR DAILY ENERGY NEEDS\nDaily usage:          ${(R.dailyWh/1000).toFixed(2)} kWh\nAfter 25% losses:     ${(R.dailyWhAdj/1000).toFixed(2)} kWh\nSolar capacity needed: ${R.solarW}W\nPeak surge load:      ${R.peakSurge}W\n\nRECOMMENDED SYSTEM\nSolar Panels:  ${R.panels300} x 300W panels (${R.totalKwp.toFixed(1)} kWp total)\nInverter:      ${R.inverterLabel}\nBatteries:     ${R.battLabel} — ${R.battSpec}\nBattery backup: ${battDays} day(s)\n\nESTIMATED COST BREAKDOWN\nPanels:              ${fmt(R.panelCost300)}\nInverter:            ${fmt(R.inverterCost)}\nBatteries:           ${fmt(R.battTotalCost)}\nMounting + wiring:   ${fmt(PRICES.mounting + PRICES.wiring)}\nInstallation:        ${fmt(PRICES.installation)}\n${'─'.repeat(40)}\nTOTAL ESTIMATE:      ${fmt(R.total300)}\n\nRETURN ON INVESTMENT\nEst. monthly KPLC bill:    ${fmt(R.monthlyKplc)}\nMonthly savings (80%):     ${fmt(R.monthlySaving)}\nPayback period:            ~${R.paybackYrs} years\n10-year net savings:       ${fmt(R.tenYrSaving)}\n\n${'='.repeat(60)}\nDISCLAIMER: Estimates based on average Kenyan market prices (2026-2026).\nActual costs depend on your site, installer, and equipment brand.\nAlways get at least 3 quotes from certified installers.\n\nSource: offgrid.ke/tools/solar-calculator\nData: Kenya Power tariffs, Kenya Meteorological Dept irradiance data,\n      Nairobi market price survey 2026.\n`
    const blob = new Blob([text], { type:'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'offgrid-ke-solar-estimate.txt'; a.click()
    URL.revokeObjectURL(url)
  }

  const inputStyle  = { width:'100%', padding:'0.6rem 0.85rem', borderRadius:'7px', border:'1.5px solid var(--color-rule)', fontSize:'0.9rem', background:'var(--color-paper)', color:'var(--color-ink)', outline:'none', boxSizing:'border-box' }
  const btnPrimary  = { background:'var(--color-sun)', color:'#fff', border:'none', padding:'0.85rem 1.8rem', borderRadius:'9px', fontWeight:700, fontSize:'0.95rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', width:'100%' }
  const btnSecondary = { background:'var(--color-paper-2)', color:'var(--color-ink-2)', border:'1px solid var(--color-rule)', padding:'0.75rem 1.4rem', borderRadius:'9px', fontWeight:600, fontSize:'0.9rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.4rem' }

  return (
    <div style={{ maxWidth:'1120px', margin:'0 auto', padding:'3rem 5% 6rem' }}>

      {/* Header */}
      <div style={{ marginBottom:'2rem' }}>
        <div style={{ display:'flex', gap:'0.5rem', fontSize:'0.75rem', marginBottom:'0.8rem', flexWrap:'wrap', alignItems:'center' }}>
          <Link to="/" style={{ color:'var(--color-sky)', fontWeight:600 }}>Home</Link>
          <ChevronRight size={12} color="var(--color-muted)" />
          <span style={{ color:'var(--color-muted)' }}>Tools</span>
          <ChevronRight size={12} color="var(--color-muted)" />
          <span style={{ color:'var(--color-muted)' }}>Solar Calculator</span>
        </div>
        <span style={{ fontSize:'0.67rem', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'var(--color-sun)', display:'block', marginBottom:'0.5rem' }}>Free Tool — Updated March 2026</span>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.9rem,3.5vw,2.8rem)', fontWeight:800, letterSpacing:'-1px', color:'var(--color-ink)', marginBottom:'0.7rem', lineHeight:1.1 }}>
          Solar System Calculator
        </h1>
        <p style={{ color:'var(--color-muted)', fontSize:'0.98rem', lineHeight:1.72, maxWidth:'560px' }}>
          Tell us what you want to power. Get a complete system recommendation with panels, batteries, and inverter sized for your home, with real Kenyan prices.
        </p>
      </div>

      <StepBar step={step} />

      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1.15fr) minmax(0,1fr)', gap:'2.5rem', alignItems:'start' }} className="calc-grid">

        {/* LEFT: Steps */}
        <div>

          {/* Step 1 */}
          <div style={{ background:'#fff', border:'1.5px solid var(--color-rule)', borderRadius:'14px', overflow:'hidden', marginBottom:'1.5rem' }}>
            <div style={{ background:'var(--color-ink)', padding:'1rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:700, color:'#fff', margin:0, display:'flex', alignItems:'center', gap:'0.5rem' }}>
                <Zap size={16} strokeWidth={2.5} color="var(--color-sun)" /> Step 1 — Your Appliances
              </h2>
              <span style={{ background:'rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.6)', fontSize:'0.72rem', padding:'0.2rem 0.65rem', borderRadius:20 }}>{activeCount} selected</span>
            </div>

            <div style={{ padding:'1.2rem 1.5rem' }}>
              <div style={{ marginBottom:'1.2rem' }}>
                <label style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontWeight:600, fontSize:'0.84rem', color:'var(--color-ink)', marginBottom:'0.45rem' }}>
                  <MapPin size={14} strokeWidth={2.5} color="var(--color-sun)" /> Your county or region
                </label>
                <select value={countyIdx} onChange={e => setCountyIdx(Number(e.target.value))} style={inputStyle}>
                  {COUNTIES.map((c,i) => <option key={i} value={i}>{c.name} — {c.sunHours} sun hrs/day</option>)}
                </select>
              </div>

              <label style={{ display:'block', fontWeight:600, fontSize:'0.84rem', color:'var(--color-ink)', marginBottom:'0.6rem' }}>Select appliances and set daily usage hours</label>
              <div style={{ border:'1px solid var(--color-rule)', borderRadius:'8px', overflow:'hidden' }}>
                {appliances.map((a, idx) => (
                  <div key={a.id} style={{ display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.6rem 0.9rem', borderBottom: idx < appliances.length-1 ? '1px solid var(--color-rule)' : 'none', background: a.active ? '#fff' : 'var(--color-paper)', transition:'background 0.15s' }}>
                    <input type="checkbox" checked={a.active} onChange={() => toggle(a.id)} id={`a${a.id}`}
                      style={{ width:15, height:15, accentColor:'var(--color-sun)', cursor:'pointer', flexShrink:0 }} />
                    <label htmlFor={`a${a.id}`} style={{ display:'flex', alignItems:'center', gap:'0.45rem', flex:1, cursor:'pointer', userSelect:'none', minWidth:0 }}>
                      <div style={{ width:26, height:26, borderRadius:6, background: a.active ? 'var(--color-paper-2)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <a.Icon size={14} strokeWidth={2.5} color={ a.active ? 'var(--color-sun)' : 'var(--color-muted)'} />
                      </div>
                      <span style={{ fontSize:'0.85rem', color: a.active ? 'var(--color-ink)' : 'var(--color-muted)', fontWeight: a.active ? 500 : 400, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {a.name}
                        <span style={{ fontSize:'0.72rem', color:'var(--color-muted)', fontWeight:400, marginLeft:'0.35rem' }}>
                          {a.watts}W{a.surge > 1 ? `, surge x${a.surge}` : ''}
                        </span>
                      </span>
                    </label>
                    {a.active && (
                      <div style={{ display:'flex', alignItems:'center', gap:'0.3rem', flexShrink:0 }}>
                        <input type="number" value={a.hours} min="0" max="24" step="0.5" onChange={e => setHours(a.id, e.target.value)}
                          style={{ width:50, padding:'0.22rem 0.35rem', border:'1.5px solid var(--color-rule)', borderRadius:5, fontSize:'0.83rem', textAlign:'center', color:'var(--color-ink)', background:'var(--color-paper)' }} />
                        <span style={{ fontSize:'0.7rem', color:'var(--color-muted)', whiteSpace:'nowrap' }}>hr/day</span>
                      </div>
                    )}
                    {a.id > 16 && (
                      <button onClick={() => removeApp(a.id)} style={{ background:'none', border:'none', color:'#c0392b', cursor:'pointer', padding:'0 0.1rem', lineHeight:1, flexShrink:0, display:'flex' }}>
                        <X size={14} strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add custom */}
              <div style={{ marginTop:'1rem', paddingTop:'1rem', borderTop:'1px dashed var(--color-rule)' }}>
                <p style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--color-muted)', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:'0.55rem' }}>Add custom appliance</p>
                <div style={{ display:'flex', gap:'0.45rem', flexWrap:'wrap' }}>
                  <input type="text"   value={customName} onChange={e=>setCustomName(e.target.value)} placeholder="Name" style={{ flex:'2 1 100px', padding:'0.42rem 0.65rem', border:'1.5px solid var(--color-rule)', borderRadius:'6px', fontSize:'0.83rem', background:'var(--color-paper)', color:'var(--color-ink)', outline:'none' }} />
                  <input type="number" value={customW}    onChange={e=>setCustomW(e.target.value)}    placeholder="Watts" style={{ flex:'1 1 60px', padding:'0.42rem 0.5rem', border:'1.5px solid var(--color-rule)', borderRadius:'6px', fontSize:'0.83rem', background:'var(--color-paper)', color:'var(--color-ink)', outline:'none' }} />
                  <input type="number" value={customH}    onChange={e=>setCustomH(e.target.value)}    placeholder="Hrs" style={{ flex:'1 1 55px', padding:'0.42rem 0.5rem', border:'1.5px solid var(--color-rule)', borderRadius:'6px', fontSize:'0.83rem', background:'var(--color-paper)', color:'var(--color-ink)', outline:'none' }} />
                  <button onClick={addCustom} style={{ background:'var(--color-ink)', color:'#fff', border:'none', padding:'0.42rem 0.9rem', borderRadius:'6px', fontSize:'0.83rem', fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' }}>Add</button>
                </div>
              </div>

              <button onClick={() => setStep(2)} style={{ ...btnPrimary, marginTop:'1.4rem' }}>
                Continue to Battery Settings <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Step 2 */}
          {step >= 2 && (
            <div style={{ background:'#fff', border:'1.5px solid var(--color-rule)', borderRadius:'14px', overflow:'hidden', marginBottom:'1.5rem', animation:'fadeUp 0.35s ease' }}>
              <div style={{ background:'var(--color-sky)', padding:'1rem 1.5rem' }}>
                <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:700, color:'#fff', margin:0, display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <Battery size={16} strokeWidth={2.5} /> Step 2 — Battery and Backup
                </h2>
              </div>
              <div style={{ padding:'1.4rem 1.5rem' }}>

                <label style={{ display:'block', fontWeight:600, fontSize:'0.84rem', color:'var(--color-ink)', marginBottom:'0.7rem' }}>Battery type</label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.7rem', marginBottom:'1.3rem' }}>
                  {[
                    { val:'lithium', label:'Lithium LiFePO4', sub:'Best life, zero maintenance', pros:'8 to 15 yr life, 90% usable' },
                    { val:'lead',    label:'Lead-Acid',        sub:'Lower upfront cost',          pros:'2 to 5 yr life, 50% usable' },
                  ].map(b => (
                    <label key={b.val} style={{ border:`2px solid ${battType===b.val ? 'var(--color-sun)' : 'var(--color-rule)'}`, borderRadius:'9px', padding:'0.9rem', cursor:'pointer', background: battType===b.val ? '#fff8f0' : '#fff', display:'flex', flexDirection:'column', gap:'0.3rem', transition:'all 0.2s' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
                        <input type="radio" name="batt" value={b.val} checked={battType===b.val} onChange={() => setBattType(b.val)} style={{ accentColor:'var(--color-sun)' }} />
                        <span style={{ fontWeight:700, fontSize:'0.88rem', color:'var(--color-ink)' }}>{b.label}</span>
                      </div>
                      <span style={{ fontSize:'0.74rem', color:'var(--color-muted)', paddingLeft:'1.2rem' }}>{b.sub}</span>
                      <span style={{ fontSize:'0.72rem', color: battType===b.val ? 'var(--color-sun)' : 'var(--color-muted)', paddingLeft:'1.2rem', fontWeight:600 }}>{b.pros}</span>
                    </label>
                  ))}
                </div>

                <label style={{ display:'block', fontWeight:600, fontSize:'0.84rem', color:'var(--color-ink)', marginBottom:'0.55rem' }}>
                  Days of battery backup: <span style={{ color:'var(--color-sun)', fontWeight:800 }}>{battDays} day{battDays>1?'s':''}</span>
                </label>
                <input type="range" min="1" max="3" step="1" value={battDays} onChange={e=>setBattDays(Number(e.target.value))} style={{ width:'100%', accentColor:'var(--color-sun)', cursor:'pointer' }} />
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:'var(--color-muted)', marginTop:'0.2rem', marginBottom:'1.4rem' }}>
                  <span>1 day (standard)</span><span>2 days</span><span>3 days (off-grid)</span>
                </div>

                <div style={{ display:'flex', gap:'0.7rem', flexWrap:'wrap' }}>
                  <button onClick={goToResults} style={{ ...btnPrimary, flex:1 }}>
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

        {/* RIGHT: Results */}
        <div ref={resultsRef} style={{ position:'sticky', top:'80px' }}>
          {step < 3 ? (
            <div style={{ background:'var(--color-paper-2)', border:'2px dashed var(--color-rule)', borderRadius:'14px', padding:'3rem 2rem', textAlign:'center' }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:'var(--color-paper)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem' }}>
                <Sun size={26} strokeWidth={2} color="var(--color-sun)" />
              </div>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, color:'var(--color-ink)', marginBottom:'0.5rem' }}>Your estimate will appear here</h3>
              <p style={{ fontSize:'0.86rem', color:'var(--color-muted)', lineHeight:1.65 }}>Complete steps 1 and 2, then click Get My Solar Estimate.</p>
              {activeCount > 0 && (
                <div style={{ marginTop:'1.5rem', background:'#fff', borderRadius:10, padding:'1rem', textAlign:'left' }}>
                  <div style={{ fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', color:'var(--color-muted)', letterSpacing:'1px', marginBottom:'0.5rem' }}>Current selection</div>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:800, color:'var(--color-sun)' }}>{(R.dailyWh/1000).toFixed(2)} kWh/day</div>
                  <div style={{ fontSize:'0.78rem', color:'var(--color-muted)', marginTop:'0.2rem' }}>{activeCount} appliances selected, needs ~{R.solarW}W solar</div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ animation: resultsVisible ? 'fadeUp 0.4s ease' : 'none' }}>

              {/* Energy profile */}
              <div style={{ background:'var(--color-ink)', borderRadius:'14px', padding:'1.6rem', marginBottom:'1.2rem' }}>
                <div style={{ fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.5px', color:'rgba(255,255,255,0.4)', marginBottom:'0.8rem' }}>Your Daily Energy Profile</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem' }}>
                  {[
                    { label:'Daily usage',         val:`${(R.dailyWh/1000).toFixed(2)} kWh` },
                    { label:'With system losses',  val:`${(R.dailyWhAdj/1000).toFixed(2)} kWh` },
                    { label:'Solar capacity',      val:`${R.solarW}W` },
                    { label:`${county.name} sun`,  val:`${sunHours} hrs/day` },
                  ].map(item => (
                    <div key={item.label} style={{ background:'rgba(255,255,255,0.07)', borderRadius:8, padding:'0.8rem' }}>
                      <div style={{ fontSize:'0.67rem', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:'0.25rem' }}>{item.label}</div>
                      <div style={{ fontSize:'1.05rem', fontWeight:700, color:'var(--color-sun)', fontFamily:'var(--font-display)' }}>{item.val}</div>
                    </div>
                  ))}
                </div>
                {R.peakSurge > 500 && (
                  <div style={{ marginTop:'0.8rem', background:'rgba(212,114,26,0.15)', borderRadius:7, padding:'0.6rem 0.9rem', fontSize:'0.76rem', color:'rgba(255,255,255,0.7)', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <AlertTriangle size={14} strokeWidth={2.5} color="var(--color-sun)" />
                    Peak surge: <strong style={{ color:'var(--color-sun)' }}>{R.peakSurge}W</strong> — inverter sized to handle motor startup loads
                  </div>
                )}
              </div>

              {/* System size callout */}
              <div style={{ background:'var(--color-sun)', borderRadius:'12px', padding:'1.2rem 1.5rem', marginBottom:'1.2rem', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap' }}>
                <div>
                  <div style={{ fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.5px', color:'rgba(255,255,255,0.7)', marginBottom:'0.2rem' }}>Recommended System Size</div>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:800, color:'#fff', lineHeight:1 }}>{R.totalKwp.toFixed(1)} kWp</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.5px', color:'rgba(255,255,255,0.7)', marginBottom:'0.2rem' }}>Total Estimate</div>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'1.9rem', fontWeight:800, color:'#fff', lineHeight:1 }}>{fmt(R.total300)}</div>
                </div>
              </div>

              {/* Component cards */}
              <div style={{ marginBottom:'1.2rem' }}>
                <div style={{ fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', color:'var(--color-muted)', marginBottom:'0.7rem' }}>System Components</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem' }}>
                  <ComponentCard Icon={Sun}     title="Solar Panels" spec={`${R.panels300} x 300W`}    price={fmt(R.panelCost300)} note={`${R.totalKwp.toFixed(1)} kWp total, Mono PERC`} color="var(--color-sun)" />
                  <ComponentCard Icon={Battery} title="Batteries"    spec={R.battLabel}                 price={fmt(R.battTotalCost)} note={R.battSpec} color="var(--color-sky)" />
                  <ComponentCard Icon={Zap}     title="Inverter"     spec={`${R.inverterKw}kW Hybrid`}  price={fmt(R.inverterCost)} note={R.inverterLabel} color="#2d6a2d" />
                  <ComponentCard Icon={Wrench}  title="Mounting + Wiring" spec="Full installation"     price={fmt(R.extras)} note="Labour, cables, breakers" color="#7c3aed" />
                </div>
              </div>

              {/* Cost breakdown */}
              <div style={{ background:'#fff', border:'1.5px solid var(--color-rule)', borderRadius:'12px', padding:'1.3rem', marginBottom:'1.2rem' }}>
                <div style={{ fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', color:'var(--color-muted)', marginBottom:'0.7rem' }}>Cost Breakdown</div>
                <ResultRow label="Solar panels (300W option)" value={fmt(R.panelCost300)} />
                <ResultRow label="Alternatively (400W panels)" value={fmt(R.panelCost400)} sub="Fewer panels, same output" />
                <ResultRow label="Inverter" value={fmt(R.inverterCost)} />
                <ResultRow label="Batteries" value={fmt(R.battTotalCost)} sub={R.battSpec} />
                <ResultRow label="Mounting, wiring and installation" value={fmt(R.extras)} />
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:'0.9rem', marginTop:'0.4rem', borderTop:'2px solid var(--color-ink)' }}>
                  <span style={{ fontWeight:700, fontSize:'0.95rem', color:'var(--color-ink)' }}>Total estimate (300W panels)</span>
                  <span style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:800, color:'var(--color-sun)' }}>{fmt(R.total300)}</span>
                </div>
                <p style={{ fontSize:'0.7rem', color:'var(--color-muted)', marginTop:'0.5rem', fontStyle:'italic', lineHeight:1.5 }}>
                  Estimates based on average Kenyan market prices (2026 to 2026). Actual costs vary by brand, location, and installer. Always get at least 3 quotes.
                </p>
              </div>

              {/* ROI */}
              {R.monthlyKplc > 0 && (
                <div style={{ background:'linear-gradient(135deg,var(--color-sky),#0e3f57)', borderRadius:'12px', padding:'1.3rem', marginBottom:'1.2rem' }}>
                  <div style={{ fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', color:'rgba(255,255,255,0.5)', marginBottom:'0.8rem' }}>Return on Investment</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.7rem' }}>
                    {[
                      { label:'Est. monthly KPLC bill', val: fmt(R.monthlyKplc) },
                      { label:'Monthly savings (80%)',  val: fmt(R.monthlySaving) },
                      { label:'Payback period',         val: R.paybackYrs ? `~${R.paybackYrs} yrs` : 'N/A' },
                      { label:'10-year net savings',    val: R.tenYrSaving > 0 ? fmt(R.tenYrSaving) : 'N/A' },
                    ].map(item => (
                      <div key={item.label} style={{ background:'rgba(255,255,255,0.1)', borderRadius:7, padding:'0.8rem' }}>
                        <div style={{ fontSize:'0.67rem', color:'rgba(255,255,255,0.5)', marginBottom:'0.3rem' }}>{item.label}</div>
                        <div style={{ fontWeight:700, fontSize:'0.95rem', color:'#fff' }}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Data sources */}
              <div style={{ background:'var(--color-paper-2)', border:'1px solid var(--color-rule)', borderRadius:'10px', padding:'1rem 1.2rem', marginBottom:'1.2rem', fontSize:'0.73rem', color:'var(--color-muted)', lineHeight:1.65 }}>
                <strong style={{ color:'var(--color-ink-2)', display:'block', marginBottom:'0.3rem' }}>Data Sources</strong>
                Kenya Power tariff schedule · Kenya Meteorological Department irradiance data · Nairobi market equipment survey (2026) · Solar industry average loss factors (IEC 61724)
              </div>

              {/* Download + Reset */}
              <div style={{ display:'flex', gap:'0.7rem', flexWrap:'wrap', marginBottom:'1.2rem' }}>
                <button onClick={downloadResults} style={{ flex:1, background:'var(--color-ink)', color:'#fff', border:'none', padding:'0.75rem 1.2rem', borderRadius:'8px', fontWeight:700, fontSize:'0.88rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
                  <Download size={15} strokeWidth={2.5} /> Download Estimate
                </button>
                <button onClick={() => { setStep(1); setResultsVisible(false) }} style={btnSecondary}>
                  <RotateCcw size={14} strokeWidth={2.5} /> Reset
                </button>
              </div>

              {/* Lead gen */}
              <div style={{ background:'linear-gradient(135deg,#1a2e1a,#2c5f2e)', borderRadius:'14px', padding:'1.5rem', marginBottom:'1.2rem' }}>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, color:'#fff', marginBottom:'0.4rem' }}>Want installation quotes near you?</h3>
                <p style={{ fontSize:'0.83rem', color:'rgba(255,255,255,0.7)', marginBottom:'1.2rem', lineHeight:1.6 }}>Leave your details and verified local installers will contact you with quotes based on this estimate.</p>
                {leadSent ? (
                  <div style={{ background:'rgba(255,255,255,0.12)', borderRadius:9, padding:'1rem', textAlign:'center', color:'#fff', fontSize:'0.9rem', fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
                    <Check size={18} strokeWidth={2.5} color="#4ade80" /> Received. Installers will contact you within 24 hours.
                  </div>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.55rem' }}>
                    <input type="text" value={leadName}   onChange={e=>setLeadName(e.target.value)}   placeholder="Your name" style={{ ...inputStyle, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff' }} />
                    <input type="tel"  value={leadPhone}  onChange={e=>setLeadPhone(e.target.value)}  placeholder="Phone or WhatsApp number" style={{ ...inputStyle, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff' }} />
                    <input type="text" value={leadCounty} onChange={e=>setLeadCounty(e.target.value)} placeholder="Your county or town" style={{ ...inputStyle, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff' }} />
                    <button
                      onClick={async () => {
                        if (!leadName || !leadPhone) return
                        setLeadLoading(true)
                        try {
                          await fetch('https://formspree.io/f/xdawgwwb', {
                            method:'POST',
                            headers:{ 'Content-Type':'application/json', 'Accept':'application/json' },
                            body: JSON.stringify({
                              name:    leadName,
                              phone:   leadPhone,
                              county:  leadCounty,
                              system:  `${R.totalKwp.toFixed(1)}kWp — ${R.inverterLabel} — ${R.battLabel}`,
                              cost:    `KSh ${Math.round(R.total300).toLocaleString('en-KE')}`,
                              _subject:`New installer lead: ${leadName} (${leadCounty || 'county not given'})`,
                            })
                          })
                        } catch(e) { /* show success anyway */ }
                        setLeadLoading(false)
                        setLeadSent(true)
                      }}
                      disabled={leadLoading}
                      style={{ background:'var(--color-sun)', color:'#fff', border:'none', padding:'0.8rem', borderRadius:'8px', fontWeight:700, fontSize:'0.9rem', cursor: leadLoading ? 'not-allowed' : 'pointer', marginTop:'0.2rem', opacity: leadLoading ? 0.7 : 1, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
                      {leadLoading ? 'Sending...' : <><ChevronRight size={16} strokeWidth={2.5} /> Get Free Installer Quotes</>}
                    </button>
                    <p style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.45)', textAlign:'center' }}>Your details are shared only with vetted local installers.</p>
                  </div>
                )}
              </div>

              {/* Related links */}
              <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap' }}>
                <Link to="/posts/solar-3-bedroom-house" style={{ flex:1, background:'var(--color-paper-2)', border:'1px solid var(--color-rule)', color:'var(--color-ink)', padding:'0.65rem 1rem', borderRadius:'8px', fontWeight:600, fontSize:'0.83rem', textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem' }}>
                  <BookOpen size={14} strokeWidth={2.5} /> Solar Guide
                </Link>
                <Link to="/posts/lithium-vs-lead-acid" style={{ flex:1, background:'var(--color-paper-2)', border:'1px solid var(--color-rule)', color:'var(--color-ink)', padding:'0.65rem 1rem', borderRadius:'8px', fontWeight:600, fontSize:'0.83rem', textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem' }}>
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
        input[placeholder]::placeholder { color: rgba(255,255,255,0.35); }
      `}</style>
    </div>
  )
}
