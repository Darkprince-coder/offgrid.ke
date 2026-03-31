/**
 * usePDFDownload — generates a branded PDF estimate for the solar calculator.
 * Uses jsPDF loaded from CDN (no npm install needed).
 * Call: downloadPDF(R, county, battDays, appliances)
 */

const BRAND_ORANGE = [212, 114, 26]
const BRAND_DARK   = [26, 18, 8]
const BRAND_MUTED  = [122, 110, 98]
const BRAND_RULE   = [224, 216, 204]

async function getJsPDF() {
  // Load jsPDF from CDN if not already loaded
  if (window.jspdf?.jsPDF) return window.jspdf.jsPDF
  await new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
  return window.jspdf.jsPDF
}

function fmt(n) { return 'KSh ' + Math.round(n).toLocaleString('en-KE') }

export async function downloadPDF(R, county, battDays, appliances) {
  const JsPDF = await getJsPDF()
  const doc = new JsPDF({ unit: 'mm', format: 'a4' })
  const W = 210, margin = 18
  let y = 0

  // ── Header strip ────────────────────────────────────────────────────────────
  doc.setFillColor(...BRAND_DARK)
  doc.rect(0, 0, W, 28, 'F')

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('OFFGRID', margin, 12)

  doc.setTextColor(...BRAND_ORANGE)
  doc.text('.KE', margin + 34, 12)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(180, 170, 155)
  doc.text("Kenya's Free Off-Grid Resource", margin, 19)

  doc.setFontSize(8)
  doc.setTextColor(130, 120, 110)
  const dateStr = new Date().toLocaleDateString('en-KE', { dateStyle: 'long' })
  doc.text(dateStr, W - margin, 19, { align: 'right' })
  y = 38

  // ── Title ────────────────────────────────────────────────────────────────────
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...BRAND_DARK)
  doc.text('Solar System Estimate', margin, y)
  y += 7

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...BRAND_MUTED)
  doc.text(`County: ${county.name}  ·  ${county.sunHours} sun hrs/day  ·  ${battDays} day${battDays > 1 ? 's' : ''} battery backup`, margin, y)
  y += 10

  // ── Summary box ───────────────────────────────────────────────────────────────
  doc.setFillColor(26, 18, 8)
  doc.roundedRect(margin, y, W - margin * 2, 28, 3, 3, 'F')

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(180, 170, 155)
  doc.text('RECOMMENDED SYSTEM', margin + 6, y + 8)
  doc.text('TOTAL ESTIMATE', W / 2 + 6, y + 8)

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...BRAND_ORANGE)
  doc.text(`${R.totalKwp.toFixed(1)} kWp`, margin + 6, y + 21)
  doc.text(fmt(R.total300), W / 2 + 6, y + 21)
  y += 36

  // ── Energy profile ────────────────────────────────────────────────────────────
  const sectionTitle = (title) => {
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...BRAND_ORANGE)
    doc.text(title.toUpperCase(), margin, y)
    doc.setDrawColor(...BRAND_RULE)
    doc.setLineWidth(0.3)
    doc.line(margin, y + 1.5, W - margin, y + 1.5)
    y += 7
  }

  const dataRow = (label, value, highlight = false) => {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(highlight ? BRAND_DARK[0] : BRAND_MUTED[0], highlight ? BRAND_DARK[1] : BRAND_MUTED[1], highlight ? BRAND_DARK[2] : BRAND_MUTED[2])
    doc.text(label, margin, y)
    if (highlight) doc.setFont('helvetica', 'bold')
    doc.setTextColor(...(highlight ? BRAND_ORANGE : BRAND_DARK))
    doc.text(value, W - margin, y, { align: 'right' })
    doc.setDrawColor(...BRAND_RULE)
    doc.setLineWidth(0.2)
    doc.line(margin, y + 1.5, W - margin, y + 1.5)
    y += 7
  }

  sectionTitle('Daily Energy Profile')
  dataRow('Daily usage (actual)', `${(R.dailyWh / 1000).toFixed(2)} kWh`)
  dataRow('After system losses (25%)', `${(R.dailyWhAdj / 1000).toFixed(2)} kWh`)
  dataRow('Solar capacity required', `${R.solarW}W`)
  if (R.peakSurge > 0) dataRow('Peak surge load', `${R.peakSurge}W`)
  y += 4

  // ── System components ─────────────────────────────────────────────────────────
  sectionTitle('Recommended System Components')
  dataRow('Solar panels', `${R.panels300} × 300W  (${R.totalKwp.toFixed(1)} kWp Mono PERC)`)
  dataRow('Alternatively', `${R.panels400} × 400W  (same output, fewer panels)`)
  dataRow('Hybrid inverter', `${R.inverterKw}kW — ${R.inverterLabel}`)
  dataRow('Batteries', R.battLabel)
  dataRow('Battery storage', R.battSpec)
  y += 4

  // ── Cost breakdown ────────────────────────────────────────────────────────────
  sectionTitle('Cost Breakdown')
  dataRow(`${R.panels300} × 300W solar panels`, fmt(R.panelCost300))
  dataRow(`${R.inverterKw}kW hybrid inverter`, fmt(R.inverterCost))
  dataRow(R.battLabel, fmt(R.battTotalCost))
  dataRow('Mounting, wiring & installation', fmt(R.extras))
  y += 2
  doc.setFillColor(...BRAND_DARK)
  doc.rect(margin, y, W - margin * 2, 10, 'F')
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('Total estimate (300W panels)', margin + 4, y + 6.5)
  doc.setTextColor(...BRAND_ORANGE)
  doc.text(fmt(R.total300), W - margin - 4, y + 6.5, { align: 'right' })
  y += 18

  // ── ROI ───────────────────────────────────────────────────────────────────────
  if (R.monthlyKplc > 0) {
    sectionTitle('Return on Investment')
    dataRow('Estimated monthly KPLC bill', fmt(R.monthlyKplc))
    dataRow('Monthly savings (80% reduction)', fmt(R.monthlySaving))
    dataRow('Estimated payback period', R.paybackYrs ? `~${R.paybackYrs} years` : 'N/A')
    dataRow('10-year net savings', R.tenYrSaving > 0 ? fmt(R.tenYrSaving) : 'N/A', true)
    y += 4
  }

  // ── Appliances list ───────────────────────────────────────────────────────────
  const activeAppliances = appliances.filter(a => a.active && a.watts > 0)
  if (activeAppliances.length > 0) {
    sectionTitle('Your Appliances')
    // Table header
    doc.setFillColor(242, 237, 228)
    doc.rect(margin, y - 3, W - margin * 2, 7, 'F')
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...BRAND_DARK)
    doc.text('Appliance', margin + 2, y + 1.5)
    doc.text('Watts', margin + 92, y + 1.5, { align: 'right' })
    doc.text('Hrs/day', margin + 112, y + 1.5, { align: 'right' })
    doc.text('Daily Wh', W - margin - 2, y + 1.5, { align: 'right' })
    y += 8

    activeAppliances.forEach((a, i) => {
      if (i % 2 === 1) {
        doc.setFillColor(250, 247, 242)
        doc.rect(margin, y - 3.5, W - margin * 2, 6.5, 'F')
      }
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...BRAND_DARK)
      doc.text(a.name.slice(0, 32), margin + 2, y + 1)
      doc.setTextColor(...BRAND_MUTED)
      doc.text(`${a.watts}W`, margin + 92, y + 1, { align: 'right' })
      doc.text(`${a.hours}h`, margin + 112, y + 1, { align: 'right' })
      doc.setTextColor(...BRAND_DARK)
      doc.text(`${Math.round(a.watts * a.hours)} Wh`, W - margin - 2, y + 1, { align: 'right' })
      y += 6.5
    })
    y += 4
  }

  // ── Footer ────────────────────────────────────────────────────────────────────
  // Check if we need a new page
  if (y > 250) { doc.addPage(); y = 18 }

  doc.setFillColor(242, 237, 228)
  doc.rect(margin, y, W - margin * 2, 18, 'F')
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...BRAND_DARK)
  doc.text('Important notes', margin + 4, y + 5.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...BRAND_MUTED)
  doc.text('Prices are Nairobi market estimates as of March 2026. Always get at least 3 quotes from certified installers.', margin + 4, y + 11)
  doc.text('Verify installer EPRA registration before signing anything.', margin + 4, y + 15.5)
  y += 26

  doc.setFontSize(7)
  doc.setTextColor(...BRAND_MUTED)
  doc.text('Generated by OFFGRID.KE — Kenya\'s free off-grid resource', margin, y)
  doc.setTextColor(...BRAND_ORANGE)
  doc.text('offgrid.ke/tools/solar-calculator', W - margin, y, { align: 'right' })

  // Page numbers
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(...BRAND_MUTED)
    doc.text(`Page ${i} of ${pageCount}`, W / 2, 292, { align: 'center' })
  }

  doc.save('offgrid-ke-solar-estimate.pdf')
}
