import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Mail, Send, ChevronRight } from 'lucide-react'

const WHATSAPP_NUMBER = '254717813478'

export default function Contact() {
  const [topic, setTopic]     = useState('')
  const [name,  setName]      = useState('')
  const [message, setMessage] = useState('')

  const buildWhatsAppLink = () => {
    const subject = topic ? `[${topic}] ` : ''
    const text    = `Hello Offgrid.ke,\n\n${subject}${name ? `My name is ${name}.\n\n` : ''}${message}`
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
  }

  const topics = [
    'Question about a guide',
    'Price correction or update',
    'Suggest a new topic',
    'Solar calculator feedback',
    'Installer partnership inquiry',
    'General inquiry',
  ]

  return (
    <div style={{ maxWidth:'800px', margin:'0 auto', padding:'4rem 5% 6rem' }}>

      <div style={{ display:'flex', gap:'0.5rem', fontSize:'0.76rem', marginBottom:'2rem', color:'var(--color-muted)' }}>
        <Link to="/" style={{ color:'var(--color-sky)', fontWeight:600 }}>Home</Link>
        <span>/</span>
        <span>Contact</span>
      </div>

      <span style={{ fontSize:'0.67rem', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'var(--color-sun)', display:'block', marginBottom:'0.6rem' }}>Get in Touch</span>
      <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.9rem,4vw,2.8rem)', fontWeight:800, letterSpacing:'-1px', color:'var(--color-ink)', marginBottom:'0.8rem', lineHeight:1.1 }}>
        Contact OFFGRID.KE
      </h1>
      <p style={{ color:'var(--color-muted)', fontSize:'0.98rem', lineHeight:1.72, marginBottom:'3rem', maxWidth:'540px' }}>
        Have a question about a guide? Spotted a pricing error? Want to suggest a topic? We reply to every message.
      </p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:'3rem', alignItems:'start' }} className="contact-grid">

        {/* Direct contact */}
        <div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, color:'var(--color-ink)', marginBottom:'1.4rem' }}>Reach us directly</h2>

          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
            style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'1.1rem 1.2rem', background:'#f0fbf4', border:'2px solid #a8d5b8', borderRadius:'12px', textDecoration:'none', color:'inherit', marginBottom:'1rem', transition:'border-color 0.2s' }}>
            <div style={{ width:48, height:48, borderRadius:'10px', background:'#25D366', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><MessageCircle size={22} strokeWidth={2.5} color="#fff" /></div>
            <div>
              <div style={{ fontWeight:700, fontSize:'0.9rem', color:'var(--color-ink)', marginBottom:'0.2rem' }}>WhatsApp</div>
              <div style={{ fontSize:'0.83rem', color:'#128C7E', fontWeight:600 }}>+254 717 813 478</div>
              <div style={{ fontSize:'0.73rem', color:'var(--color-muted)', marginTop:'0.1rem' }}>Tap to open a chat</div>
            </div>
          </a>

          <a href="mailto:kenyaoffgrid@gmail.com"
            style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'1.1rem 1.2rem', background:'#fff', border:'1.5px solid var(--color-rule)', borderRadius:'12px', textDecoration:'none', color:'inherit', marginBottom:'2rem' }}>
            <div style={{ width:48, height:48, borderRadius:'10px', background:'var(--color-paper-2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Mail size={20} strokeWidth={2.5} color="var(--color-sky)" /></div>
            <div>
              <div style={{ fontWeight:700, fontSize:'0.9rem', color:'var(--color-ink)', marginBottom:'0.2rem' }}>Email</div>
              <div style={{ fontSize:'0.83rem', color:'var(--color-sky)', fontWeight:600 }}>kenyaoffgrid@gmail.com</div>
            </div>
          </a>

          <div style={{ background:'var(--color-paper-2)', borderRadius:'10px', padding:'1.1rem', fontSize:'0.81rem', color:'var(--color-muted)', lineHeight:1.7 }}>
            <strong style={{ color:'var(--color-ink-2)', display:'block', marginBottom:'0.3rem' }}>Response times</strong>
            We typically reply within 24 to 48 hours on weekdays. For urgent solar or water questions, WhatsApp is faster.
          </div>
        </div>

        {/* WhatsApp message builder */}
        <div style={{ background:'#fff', border:'1.5px solid var(--color-rule)', borderRadius:'14px', padding:'1.8rem' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:700, color:'var(--color-ink)', marginBottom:'0.4rem' }}>Send us a message</h2>
          <p style={{ fontSize:'0.8rem', color:'var(--color-muted)', marginBottom:'1.4rem' }}>Fill this in and we will open WhatsApp with your message ready to send.</p>

          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div>
              <label style={{ display:'block', fontWeight:600, fontSize:'0.83rem', color:'var(--color-ink)', marginBottom:'0.4rem' }}>Your name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. James Kamau"
                style={{ width:'100%', padding:'0.65rem 0.85rem', borderRadius:'7px', border:'1.5px solid var(--color-rule)', fontSize:'0.9rem', background:'var(--color-paper)', color:'var(--color-ink)', outline:'none', boxSizing:'border-box' }} />
            </div>

            <div>
              <label style={{ display:'block', fontWeight:600, fontSize:'0.83rem', color:'var(--color-ink)', marginBottom:'0.4rem' }}>Topic</label>
              <select value={topic} onChange={e => setTopic(e.target.value)}
                style={{ width:'100%', padding:'0.65rem 0.85rem', borderRadius:'7px', border:'1.5px solid var(--color-rule)', fontSize:'0.9rem', background:'var(--color-paper)', color:'var(--color-ink)', outline:'none', boxSizing:'border-box' }}>
                <option value="">Select a topic...</option>
                {topics.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display:'block', fontWeight:600, fontSize:'0.83rem', color:'var(--color-ink)', marginBottom:'0.4rem' }}>Message</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
                placeholder="Tell us what you need help with..."
                style={{ width:'100%', padding:'0.65rem 0.85rem', borderRadius:'7px', border:'1.5px solid var(--color-rule)', fontSize:'0.9rem', background:'var(--color-paper)', color:'var(--color-ink)', outline:'none', resize:'vertical', lineHeight:1.6, fontFamily:'var(--font-body)', boxSizing:'border-box' }} />
            </div>

            <a href={buildWhatsAppLink()} target="_blank" rel="noopener noreferrer"
              style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', background:'#25D366', color:'#fff', padding:'0.85rem', borderRadius:'9px', fontWeight:700, fontSize:'0.95rem', textDecoration:'none' }}>
              <Send size={16} strokeWidth={2.5} /> Open in WhatsApp
            </a>
            <p style={{ fontSize:'0.71rem', color:'var(--color-muted)', textAlign:'center', margin:0 }}>This opens WhatsApp with your message pre-filled. You send it from your own number.</p>
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 700px) { .contact-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
