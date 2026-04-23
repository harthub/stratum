const RECYCLING_RATES = [
  { mineral:'Gold',      rate:95, color:'#c9a84c', note:'Most recovered precious metal. Jewelry, electronics, dental.' },
  { mineral:'Palladium', rate:88, color:'#b8a0d0', note:'Auto catalyst recovery mature. MLCC recovery emerging.' },
  { mineral:'Silver',    rate:70, color:'#a8a8b0', note:'Photography recovery declined; electronics recovery growing.' },
  { mineral:'Copper',    rate:65, color:'#b87333', note:'95%+ from e-waste when collected. Collection gap is the issue.' },
  { mineral:'Cobalt',    rate:55, color:'#4cc9b8', note:'Battery recycling scaling. Li-Cycle, Redwood leading.' },
  { mineral:'Nickel',    rate:50, color:'#7a9090', note:'Recovered primarily from stainless steel scrap streams.' },
  { mineral:'Germanium', rate:30, color:'#c9844c', note:'Partial recovery from fiber optic scrap.' },
  { mineral:'Lithium',   rate:25, color:'#a8c44c', note:'Currently low but scaling rapidly with battery recycling.' },
  { mineral:'Neodymium', rate:10, color:'#c060a0', note:'Magnet recovery nascent. Significant urban mining opportunity.' },
  { mineral:'Gallium',   rate:5,  color:'#c94c8e', note:'Almost no secondary recovery. Critical gap in supply chain.' },
]

const URBAN_MINING_PLAYS = [
  { name:'Umicore', ticker:'UMI.BR', desc:'Global leader in precious metal refining from e-waste. Palladium, gold, silver recovery at scale across MLCC and circuit board streams.' },
  { name:'Li-Cycle Holdings', ticker:'LICY', desc:'Lithium-ion battery recycler. Recovers Li, Co, Ni, Mn — all AI UPS battery minerals. Hub-and-spoke model scaling US capacity.' },
  { name:'Redwood Materials', ticker:'Private', desc:"JB Straubel's battery recycling company targeting closed-loop Li, Co, Cu recovery. Negotiating direct supply agreements with data center operators." },
  { name:'Boliden', ticker:'BOL.ST', desc:'European smelter processing e-waste for Cu, Au, Ag, Pd, Sn — the full PCB mineral suite. Processes circuit boards from hyperscaler hardware refresh cycles.' },
]

export default function RecyclingSection() {
  return (
    <section id="recycling" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="section-header">
        <span className="section-num">07</span>
        <h2 className="section-title">RECYCLING & <span>URBAN MINING</span></h2>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', borderBottom: '1px solid var(--border)' }}>
        {/* Main content */}
        <div style={{ padding: '40px 48px', borderRight: '1px solid var(--border)' }}>
          <p className="text-[12px] font-sans font-light leading-[1.9] mb-5" style={{ color: 'var(--text-dim)' }}>
            The IEA estimates that scaling recycling could reduce growth in new mining supply for critical minerals by{' '}
            <strong style={{ color: 'var(--text)' }}>25–40% by 2050</strong>. Urban mining — recovering minerals from discarded electronics, industrial waste, and end-of-life hardware — is emerging as a parallel supply chain that partially offsets the 17-year mine development lag.
          </p>
          <p className="text-[12px] font-sans font-light leading-[1.9] mb-5" style={{ color: 'var(--text-dim)' }}>
            The economics are increasingly viable. A tonne of circuit boards contains{' '}
            <strong style={{ color: 'var(--text)' }}>~200g of gold</strong> — roughly 50× the concentration of a typical gold ore body. Copper recovery from e-waste runs at 95%+ efficiency in modern smelters. Palladium recovery from automotive catalysts and MLCCs is already a mature industry in Japan and South Korea.
          </p>
          <p className="text-[12px] font-sans font-light leading-[1.9]" style={{ color: 'var(--text-dim)' }}>
            The bear case counterargument: if recycling scales fast enough, the supply gap narrows without new primary mining. The{' '}
            <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>realistic scenario</span> is that recycling offsets a meaningful portion — but AI hardware's rapid refresh cycles mean e-waste volumes are growing too, creating a feedback loop that benefits urban mining operators regardless.
          </p>

          {/* Stats */}
          <div className="grid mt-8" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: 'var(--border)' }}>
            {[
              { val:'25-40%', label:'Mining demand offset by 2050 (IEA)', color:'var(--green)' },
              { val:'200g',   label:'Gold per tonne of circuit boards',    color:'var(--gold)' },
              { val:'95%+',   label:'Copper recovery rate from e-waste',   color:'var(--copper)' },
            ].map(s => (
              <div key={s.val} style={{ background: 'var(--bg2)', padding: 20, textAlign: 'center' }}>
                <div className="font-display text-[36px] tracking-[0.02em] mb-1" style={{ color: s.color }}>{s.val}</div>
                <div className="text-[8px] tracking-[0.15em] uppercase" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ padding: '40px 32px' }}>
          <div className="text-[9px] tracking-[0.2em] uppercase mb-5" style={{ color: 'var(--text-muted)' }}>— Recoverability by Mineral</div>
          <div className="flex flex-col gap-[14px] mb-8">
            {RECYCLING_RATES.map(r => {
              const barColor = r.rate > 60 ? 'var(--green)' : r.rate > 30 ? 'var(--gold)' : 'var(--red)'
              return (
                <div key={r.mineral}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[9px]" style={{ color: 'var(--text-dim)' }}>{r.mineral}</span>
                    <span className="font-mono text-[9px]" style={{ color: barColor }}>{r.rate}%</span>
                  </div>
                  <div className="h-[3px] relative mb-1" style={{ background: 'var(--border)' }}>
                    <div className="absolute left-0 top-0 h-full" style={{ width: `${r.rate}%`, background: r.color }} />
                  </div>
                  <div className="text-[8px] font-sans" style={{ color: 'var(--text-muted)' }}>{r.note}</div>
                </div>
              )
            })}
          </div>

          <div className="text-[9px] tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>— Urban Mining Equity Plays</div>
          <div className="flex flex-col">
            {URBAN_MINING_PLAYS.map(p => (
              <div key={p.ticker} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[10px]" style={{ color: 'var(--text)' }}>{p.name}</span>
                  <span className="text-[8px] tracking-[0.08em]" style={{ color: 'var(--text-muted)' }}>{p.ticker}</span>
                </div>
                <p className="text-[9px] font-sans leading-[1.6]" style={{ color: 'var(--text-muted)' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
