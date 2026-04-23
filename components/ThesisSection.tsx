const SUPPLY_RISK = [
  { mineral:'Dysprosium',  level:'critical' },
  { mineral:'Fluorspar',   level:'critical' },
  { mineral:'Arsenic (GaAs)',level:'critical' },
  { mineral:'Gallium',     level:'critical' },
  { mineral:'Germanium',   level:'critical' },
  { mineral:'Neodymium',   level:'critical' },
  { mineral:'Palladium',   level:'critical' },
  { mineral:'Tantalum',    level:'high' },
  { mineral:'Cobalt',      level:'high' },
  { mineral:'Copper',      level:'high' },
  { mineral:'Silver',      level:'high' },
  { mineral:'Indium',      level:'high' },
  { mineral:'Gadolinium',  level:'high' },
  { mineral:'Lanthanum',   level:'high' },
  { mineral:'Lithium',     level:'medium' },
  { mineral:'Gold',        level:'medium' },
  { mineral:'Manganese',   level:'medium' },
  { mineral:'Silicon',     level:'medium' },
]

const COPPER_DEMAND = [
  { year:'2023', val:800,  max:2500, color:'#b87333' },
  { year:'2025', val:1100, max:2500, color:'#b87333' },
  { year:'2027', val:1500, max:2500, color:'#c9a84c' },
  { year:'2030', val:2100, max:2500, color:'#c9a84c' },
  { year:'2040', val:2500, max:2500, color:'#c94c4c' },
]

const LEVEL_STYLES: Record<string, { color: string; label: string }> = {
  critical: { color:'var(--red)',   label:'Critical' },
  high:     { color:'#c98c4c',      label:'High' },
  medium:   { color:'var(--gold)',  label:'Medium' },
}

export default function ThesisSection() {
  return (
    <section id="thesis" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="section-header">
        <span className="section-num">11</span>
        <h2 className="section-title">THE <span>THESIS</span></h2>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Main text */}
        <div style={{ padding: '48px', borderRight: '1px solid var(--border)' }}>
          <p className="text-[13px] font-sans font-light leading-[1.9] mb-5" style={{ color: 'var(--text-dim)' }}>
            <strong style={{ color: 'var(--text)' }}>The AI infrastructure boom is not primarily a software story.</strong> Beneath every training run, every inference call, and every data center expansion lies a physical supply chain anchored in minerals extracted from mines in Chile, South Africa, the Democratic Republic of Congo, and Australia. The market has priced the software layer aggressively. The mineral layer remains structurally underpriced relative to demand trajectory.
          </p>

          <div className="pull-quote">
            <p className="font-display text-[22px] tracking-[0.03em] leading-[1.2]">
              "The primary constraint on data center expansion by 2026 is physical mineral supply chain bottlenecks — not financing, not energy."
            </p>
            <cite className="block text-[8px] tracking-[0.2em] uppercase mt-2" style={{ color: 'var(--text-muted)' }}>— Enki Research, Feb 2026</cite>
          </div>

          <p className="text-[13px] font-sans font-light leading-[1.9] mb-5" style={{ color: 'var(--text-dim)' }}>
            Consider copper. <strong style={{ color: 'var(--text)' }}>Each megawatt of data center capacity embeds 60–75 tonnes of minerals</strong>, with copper dominating wiring, cooling, and power distribution. Microsoft's 80 MW Chicago facility alone required approximately 2,100 tonnes of copper. Scale that across the projected 100 GW of new capacity by 2030, and the demand signal is structural, not cyclical.
          </p>

          <p className="text-[13px] font-sans font-light leading-[1.9] mb-5" style={{ color: 'var(--text-dim)' }}>
            The precious metals layer is subtler but equally real. <strong style={{ color: 'var(--text)' }}>Gold's role in connector plating</strong>, silver's presence in PCBs and thermal interfaces, and palladium's ubiquity in MLCCs — the capacitors inside every motherboard, GPU, and RAM module — create a demand baseline that technology scaling can only increase. Palladium in particular carries concentrated geopolitical risk: Russia and South Africa account for roughly 80% of global supply.
          </p>

          <p className="text-[13px] font-sans font-light leading-[1.9] mb-5" style={{ color: 'var(--text-dim)' }}>
            The <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>commodity forex transmission mechanism</span> completes the cross-asset chain. When copper prices rise on AI demand, AUD/USD strengthens as Australia's mining revenue improves. USD/CLP reflects Chilean copper output directly. USD/ZAR captures South African PGM and gold dynamics. These are not theoretical correlations — they are structural linkages embedded in how commodity-exporting nations fund their current accounts.
          </p>

          <p className="text-[13px] font-sans font-light leading-[1.9] mb-5" style={{ color: 'var(--text-dim)' }}>
            The urban mining overlay adds a critical counterbalance. Recycling will not eliminate the supply gap — but it creates a parallel investable theme in e-waste processors and closed-loop material recovery. The companies building that infrastructure today are positioning for a market that scales alongside AI hardware obsolescence cycles.
          </p>

          <p className="text-[13px] font-sans font-light leading-[1.9]" style={{ color: 'var(--text-dim)' }}>
            The mining equity opportunity is concentrated in companies with <strong style={{ color: 'var(--text)' }}>permitted assets in late-stage development</strong> — those that can bypass the 17-year average mine-to-production timeline. Junior miners with copper, gallium, or germanium exposure at advanced project stages are receiving valuation premiums that reflect the structural supply gap rather than near-term production. The IPO pipeline in this space is the most active since the rare earth cycle of 2010–2012.
          </p>
        </div>

        {/* Sidebar */}
        <div style={{ padding: '48px 32px' }}>
          {/* Supply risk list */}
          <div className="mb-8">
            <div className="text-[9px] tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              — Supply Risk by Mineral
            </div>
            <ul style={{ listStyle: 'none' }}>
              {SUPPLY_RISK.map(r => {
                const style = LEVEL_STYLES[r.level]
                return (
                  <li key={r.mineral} className="flex justify-between items-center py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className="text-[10px] font-sans" style={{ color: 'var(--text-dim)' }}>{r.mineral}</span>
                    <span className="text-[8px] tracking-[0.1em] px-2 py-[2px]" style={{ color: style.color, border: `1px solid ${style.color}` }}>
                      {style.label}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Copper demand buildup */}
          <div>
            <div className="text-[9px] tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              — Copper Demand Buildup (Data Centers)
            </div>
            <div className="flex flex-col gap-3">
              {COPPER_DEMAND.map(b => (
                <div key={b.year} className="flex items-center gap-3">
                  <span className="text-[9px] uppercase w-10" style={{ color: 'var(--text-dim)' }}>{b.year}</span>
                  <div className="flex-1 h-[4px] relative" style={{ background: 'var(--border)' }}>
                    <div className="absolute left-0 top-0 h-full" style={{ width: `${(b.val / b.max) * 100}%`, background: b.color }} />
                  </div>
                  <span className="font-mono text-[9px] w-12 text-right" style={{ color: 'var(--text-muted)' }}>{(b.val / 1000).toFixed(1)}M t</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-[8px] font-sans" style={{ color: 'var(--text-muted)' }}>Source: S&P Global Commodity Insights 2026</div>
          </div>
        </div>
      </div>
    </section>
  )
}
