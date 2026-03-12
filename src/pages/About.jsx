import { Link } from 'react-router-dom'
import { BookOpen, MapPin, ShieldCheck, BarChart2, ChevronRight, ArrowRight } from 'lucide-react'

const VALUES = [
  { Icon: BookOpen,    color: 'var(--color-sun)', title: 'Free forever',      body: 'Every guide is free. No paywall, no sign-up required. Good information should be accessible to every Kenyan.' },
  { Icon: MapPin,      color: 'var(--color-sky)', title: 'Kenya-specific',    body: 'We quote KSh, not USD. We mention brands available in Nairobi hardware stores. We cite Kenyan sun hours and rainy seasons.' },
  { Icon: ShieldCheck, color: '#2d6a2d',          title: 'No paid placements',body: 'No advertiser has ever paid to appear on this site. We will add a clear sponsored label if that ever changes.' },
  { Icon: BarChart2,   color: '#7c3aed',          title: 'Cited sources',     body: 'We link to Kenya Power tariff schedules, Kenya Meteorological Dept data, and local price surveys wherever possible.' },
]

export default function About() {
  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '4rem 5% 6rem' }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.76rem', marginBottom: '2rem', color: 'var(--color-muted)' }}>
        <Link to="/" style={{ color: 'var(--color-sky)', fontWeight: 600 }}>Home</Link>
        <span>/</span>
        <span>About</span>
      </div>

      {/* Header */}
      <div style={{ borderBottom: '2px solid var(--color-ink)', paddingBottom: '2rem', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.67rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-sun)', display: 'block', marginBottom: '0.6rem' }}>About Offgrid.ke</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--color-ink)', marginBottom: '1rem', lineHeight: 1.1 }}>
          A practical guide for Kenyans building independent homes.
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--color-ink-2)', lineHeight: 1.78, maxWidth: '640px' }}>
          OFFGRID.KE helps Kenyan homeowners, farmers, and small business owners plan and build solar, water, food, and security systems using local data, real prices, and honest advice.
        </p>
      </div>

      {/* Mission */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '1rem' }}>Why we built this</h2>
        <p style={{ color: 'var(--color-ink-2)', lineHeight: 1.82, marginBottom: '1rem' }}>
          When we started looking into solar and rainwater systems in Kenya, we found two kinds of information: vague international guides that quoted prices in USD with no reference to local suppliers, or installer quotes that were impossible to verify without context.
        </p>
        <p style={{ color: 'var(--color-ink-2)', lineHeight: 1.82, marginBottom: '1rem' }}>
          OFFGRID.KE exists to fill that gap. Every guide on this site uses real market prices from Nairobi, Mombasa, Nakuru, Eldoret, and other Kenyan towns. Every recommendation has been researched using locally available products and installers.
        </p>
        <p style={{ color: 'var(--color-ink-2)', lineHeight: 1.82 }}>
          We do not accept payment to recommend specific brands or installers. Recommendations are based entirely on research, community feedback, and our own assessments of quality and value.
        </p>
      </section>

      {/* Values */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '1.5rem' }}>What we stand for</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'1.2rem' }}>
          {VALUES.map(v => (
            <div key={v.title} style={{ background:'var(--color-paper-2)', border:'1px solid var(--color-rule)', borderRadius:'12px', padding:'1.4rem' }}>
              <div style={{ width:40, height:40, borderRadius:10, background: v.color + '18', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'0.8rem' }}>
                <v.Icon size={20} strokeWidth={2.5} color={v.color} />
              </div>
              <h3 style={{ fontWeight:700, fontSize:'0.95rem', color:'var(--color-ink)', marginBottom:'0.4rem' }}>{v.title}</h3>
              <p style={{ fontSize:'0.84rem', color:'var(--color-muted)', lineHeight:1.65 }}>{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Data sources */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '1rem' }}>Data sources</h2>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.2rem' }}>Our guides and tools draw on the following sources. Prices are reviewed and updated periodically based on Nairobi market surveys.</p>
        <div style={{ border: '1.5px solid var(--color-rule)', borderRadius: '12px', overflow: 'hidden' }}>
          {[
            { source: 'Kenya Power & Lighting (KPLC)',        use: 'Electricity tariff rates, levy schedules' },
            { source: 'Kenya Meteorological Department',      use: 'Solar irradiance data, rainfall maps, sun hour averages by county' },
            { source: 'Solar industry loss factors',          use: 'IEC 61724 standard — system efficiency assumptions' },
            { source: 'Nairobi market price surveys',         use: 'Equipment prices — panels, inverters, batteries, tanks (updated 2024–2026)' },
            { source: 'Kenya Bureau of Standards (KEBS)',     use: 'Product certification status for locally sold equipment' },
            { source: 'Water Resources Authority (WRA)',      use: 'Rainwater harvesting regulations, Water Act 2016' },
            { source: 'Kenya Energy and Petroleum Regulatory Authority (EPRA)', use: 'Solar industry guidelines' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1.2rem', borderBottom: i < 6 ? '1px solid var(--color-rule)' : 'none', flexWrap: 'wrap', gap: '0.5rem', background: i % 2 === 1 ? 'var(--color-paper-2)' : '#fff' }}>
              <span style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--color-ink)' }}>{row.source}</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-muted)' }}>{row.use}</span>
            </div>
          ))}
        </div>
      </section>

      {/* What's covered */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '1.2rem' }}>What OFFGRID.KE covers</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem' }}>
          {[
            { cat: '☀️ Solar',    items: ['Solar system sizing', 'Panel comparisons', 'Battery guides', 'Inverter selection', 'Solar prices in Kenya'] },
            { cat: '💧 Water',    items: ['Water tank buying guide', 'Rainwater harvesting', 'Borehole information', 'Water pump systems', 'Tank size calculator'] },
            { cat: '🌿 Food',     items: ['Backyard farming', 'Greenhouse setup', 'Chicken farming', 'Food storage & preservation'] },
            { cat: '🔒 Security', items: ['Solar security cameras', 'Backup power', 'Emergency preparedness', 'Blackout planning'] },
          ].map(c => (
            <div key={c.cat} style={{ background: '#fff', border: '1px solid var(--color-rule)', borderRadius: '10px', padding: '1.2rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-ink)', marginBottom: '0.7rem' }}>{c.cat}</div>
              {c.items.map(item => <div key={item} style={{ fontSize: '0.8rem', color: 'var(--color-muted)', padding: '0.22rem 0', borderBottom: '1px solid var(--color-rule)' }}>{item}</div>)}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div style={{ background: 'var(--color-ink)', borderRadius: '14px', padding: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#fff', marginBottom: '0.4rem' }}>Questions or corrections?</h3>
          <p style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.65)', margin: 0 }}>If you spot an error or have a question we haven't answered, we want to know.</p>
        </div>
        <Link to="/contact" style={{ background: 'var(--color-sun)', color: '#fff', padding: '0.75rem 1.6rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
          Contact Us →
        </Link>
      </div>
    </div>
  )
}
