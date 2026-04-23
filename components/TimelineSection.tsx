const TIMELINE = [
  { year:'2020',     tag:'Supply Shock',   color:'#c94c4c', label:'COVID disrupts global mining and semiconductor supply chains simultaneously. Mine closures collide with demand spike.' },
  { year:'2021',     tag:'Tech Demand',    color:'#4c8ec9', label:'Chip shortage peaks. TSMC, Intel announce massive fab investment. Semiconductor mineral demand spikes globally.' },
  { year:'2022',     tag:'Geopolitics',    color:'#c98c4c', label:'Russia invades Ukraine. Palladium, nickel supplies disrupted. Western sanctions reshape critical commodity flows permanently.' },
  { year:'Jun 2023', tag:'Export Controls',color:'#c94c4c', label:"China announces export controls on gallium and germanium — first shot in the critical minerals trade war with the West." },
  { year:'Aug 2023', tag:'Policy',         color:'#4caf78', label:'CHIPS and Science Act funding disbursements begin. $52B for US semiconductor and mineral supply chains unlocked.' },
  { year:'Jan 2024', tag:'Supply Warning', color:'#c98c4c', label:'IEA Critical Minerals Outlook warns existing mines meet only 70% of 2035 copper demand. AI buildout accelerating the gap.' },
  { year:'Mid 2024', tag:'Export Controls',color:'#c94c4c', label:'China expands controls to antimony, graphite, tungsten. Broader critical mineral strategy emerges targeting Western AI supply chains.' },
  { year:'Jan 2025', tag:'Market Research',color:'#c9a84c', label:"S&P Global publishes landmark copper systemic risk report. 10M tonne shortfall by 2040 projected. 'Systemic risk' language used." },
  { year:'Feb 2025', tag:'Policy',         color:'#4caf78', label:'USGS formally adds copper to critical minerals list. Expedited permitting pathways open for domestic copper projects.' },
  { year:'Q3 2025',  tag:'Price Record',   color:'#c9a84c', label:'Copper breaks $11,000/t on LME. Gold, silver, copper hit simultaneous all-time highs for first time in 45 years.' },
  { year:'Dec 2025', tag:'AI Demand',      color:'#4c8ec9', label:"WEF Minerals to Megawatts report: AI facilities now 25% of data center capacity, rising to 60%+ by 2035. Material intensity rising." },
  { year:'Mar 2026', tag:'Export Controls',color:'#c94c4c', label:'China expands rare earth controls to NdFeB precursors. Neodymium supply chain at risk for Western data center cooling systems.' },
]

export default function TimelineSection() {
  return (
    <section id="timeline" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="section-header">
        <span className="section-num">08</span>
        <h2 className="section-title">KEY EVENTS <span>TIMELINE</span></h2>
      </div>

      <div style={{ padding: '48px 48px', overflowX: 'auto' }}>
        <div style={{ position: 'relative', minWidth: 1100 }}>
          {/* Spine */}
          <div style={{ position: 'absolute', top: 28, left: 0, right: 0, height: 1, background: 'var(--border)' }} />

          {/* Events */}
          <div className="flex" style={{ gap: 0 }}>
            {TIMELINE.map((t, i) => (
              <div key={i} style={{ flex: 1, minWidth: 140, position: 'relative', paddingTop: 52 }}>
                {/* Node */}
                <div style={{
                  position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)',
                  width: 12, height: 12, borderRadius: '50%',
                  background: t.color, border: '2px solid var(--bg)', zIndex: 1,
                }} />
                {/* Content */}
                <div style={{ textAlign: 'center', padding: '0 6px' }}>
                  <div className="font-display text-[13px] tracking-[0.04em] mb-1" style={{ color: t.color }}>{t.year}</div>
                  <div className="inline-block text-[7px] tracking-[0.1em] px-[5px] py-[2px] mb-2 uppercase" style={{ border: `1px solid ${t.color}`, color: t.color }}>
                    {t.tag}
                  </div>
                  <p className="text-[9px] font-sans leading-[1.5]" style={{ color: 'var(--text-muted)' }}>{t.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 48px 24px' }}>
        <p className="text-[9px] font-sans" style={{ color: 'var(--text-muted)' }}>
          * Timeline covers key mineral policy, supply disruption, and AI infrastructure demand events from 2020–2026. Sources: Reuters, IEA, USGS, FP Analytics, WEF.
        </p>
      </div>
    </section>
  )
}
