import { Link } from 'react-router-dom'
import { Info, Lightbulb, AlertTriangle, ArrowRight, Calculator } from 'lucide-react'

function Callout({ title, text, sky }) {
  const Icon = sky ? Lightbulb : AlertTriangle
  const bg   = sky ? 'var(--color-sky)' : 'var(--color-sun)'
  return (
    <div style={{ margin:'1.8rem 0', background: sky ? '#eef6fb' : '#fff8f0', border:`1.5px solid ${sky ? '#bee0f0' : '#f5d9c0'}`, borderLeft:`4px solid ${bg}`, borderRadius:'10px', padding:'1.1rem 1.3rem' }}>
      {title && (
        <div style={{ display:'flex', alignItems:'center', gap:'0.45rem', fontWeight:700, fontSize:'0.82rem', color: bg, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:'0.5rem' }}>
          <Icon size={14} strokeWidth={2.5} color={bg} /> {title}
        </div>
      )}
      <p style={{ margin:0, fontSize:'0.93rem', color:'var(--color-ink-2)', lineHeight:1.72 }}>{text}</p>
    </div>
  )
}

function DataTable({ headers, rows }) {
  return (
    <div style={{ overflowX:'auto', margin:'1.8rem 0' }}>
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.88rem', border:'1px solid var(--color-rule)', borderRadius:'10px', overflow:'hidden' }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ background:'var(--color-ink)', color:'#fff', padding:'0.78rem 1rem', textAlign:'left', fontSize:'0.75rem', letterSpacing:'0.8px', textTransform:'uppercase', fontWeight:600 }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ padding:'0.75rem 1rem', borderBottom: ri < rows.length-1 ? '1px solid var(--color-rule)' : 'none', color:'var(--color-ink-2)', background: ri%2===1 ? 'var(--color-paper-2)' : 'transparent' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SummaryBox({ title, rows }) {
  return (
    <div className="summary-box">
      {title && <h3>{title}</h3>}
      {rows.map((row, i) => (
        <div key={i} className="summary-row">
          <span className="label">{row.label}</span>
          <span className="value">{row.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function PostContent({ content }) {
  if (!content) return null
  return (
    <div className="post-content">
      {content.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return <h2 key={i}>{block.text}</h2>
          case 'h3':
            return <h3 key={i}>{block.text}</h3>
          case 'p':
            return <p key={i}>{block.text}</p>
          case 'ul':
            return <ul key={i}>{block.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
          case 'ol':
            return <ol key={i}>{block.items.map((item, j) => <li key={j}>{item}</li>)}</ol>
          case 'blockquote':
            return <blockquote key={i}>{block.text}</blockquote>
          case 'callout':
            return <Callout key={i} title={block.title} text={block.text} sky={block.sky} />
          case 'table':
            return <DataTable key={i} headers={block.headers} rows={block.rows} />
          case 'summary':
            return <SummaryBox key={i} title={block.title} rows={block.rows} />
          case 'internalLink':
            return (
              <div key={i} style={{ margin:'1.8rem 0', padding:'1.1rem 1.3rem', background:'var(--color-paper-2)', border:'1.5px solid var(--color-rule)', borderRadius:'10px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'0.8rem' }}>
                <div>
                  <div style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', color:'var(--color-muted)', marginBottom:'0.2rem' }}>{block.label || 'Related guide'}</div>
                  <div style={{ fontWeight:700, color:'var(--color-ink)', fontSize:'0.92rem' }}>{block.text}</div>
                </div>
                <Link to={block.to} style={{ background:'var(--color-ink)', color:'#fff', padding:'0.52rem 1rem', borderRadius:'7px', fontWeight:700, fontSize:'0.83rem', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'0.35rem' }}>
                  Read <ArrowRight size={13} strokeWidth={2.5} />
                </Link>
              </div>
            )
          case 'calculatorCTA':
            return (
              <div key={i} style={{ margin:'2.5rem 0', background:'linear-gradient(135deg, #1a2e1a, #3d6b1e)', borderRadius:'12px', padding:'1.8rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:'0.8rem' }}>
                  <div style={{ width:42, height:42, borderRadius:10, background:'rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Calculator size={20} strokeWidth={2.5} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:700, color:'#fff', marginBottom:'0.25rem' }}>{block.title || 'Calculate your solar system'}</div>
                    <div style={{ fontSize:'0.84rem', color:'rgba(255,255,255,0.72)' }}>{block.text || 'Use our free calculator to get a full system recommendation with Kenyan prices.'}</div>
                  </div>
                </div>
                <Link to="/tools/solar-calculator" style={{ background:'#fff', color:'var(--color-sun)', padding:'0.65rem 1.3rem', borderRadius:'8px', fontWeight:800, fontSize:'0.88rem', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                  Open Calculator <ArrowRight size={14} strokeWidth={2.5} color="var(--color-sun)" />
                </Link>
              </div>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
