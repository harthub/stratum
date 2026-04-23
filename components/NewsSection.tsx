const NEWS = [
  { date:'Apr 2026', tag:'SUPPLY',       tagColor:'#c94c4c', headline:'Copper hits fresh record above $11,700/t on LME as AI capex surge absorbs available supply', body:'Hyperscaler construction activity across the US, Europe, and Southeast Asia is consuming copper at a pace that has overwhelmed the 2025 procurement pipeline. Analysts at JPMorgan now target $12,500/t by Q2 2026.', source:'LME / JPMorgan Research' },
  { date:'Mar 2026', tag:'GEOPOLITICS',  tagColor:'#c98c4c', headline:'China expands rare earth export controls to include processed neodymium compounds', body:"Beijing broadened its 2023 gallium/germanium playbook to cover processed NdFeB precursors, targeting the magnet supply chain used in EV motors and data center cooling fans. MP Materials shares surged 18% on the news.", source:'Reuters / S&P Global' },
  { date:'Mar 2026', tag:'MINING IPO',   tagColor:'#4caf78', headline:'Arizona Sonoran secures $240M financing for ARIS copper project pre-feasibility', body:"The domestic US copper developer closed a strategic financing round backed by a consortium including a major semiconductor manufacturer seeking direct copper offtake — signaling tech's move to bypass commodity markets.", source:'Mining Journal / Company Filing' },
  { date:'Feb 2026', tag:'POLICY',       tagColor:'#4c8ec9', headline:'USGS adds copper to critical minerals list; triggers expedited permitting under CHIPS Act', body:'The formal designation unlocks federal support for domestic mining projects, potentially compressing the 17-year average development timeline for advanced-stage US copper assets.', source:'USGS Mineral Commodity Summaries 2025' },
  { date:'Jan 2026', tag:'SUPPLY RISK',  tagColor:'#c94c4c', headline:'S&P Global warns of "systemic risk" as copper shortfall could hit 10M tonnes by 2040', body:'A landmark S&P Global study projects data center copper demand rising from 1.1M to 2.5M metric tons by 2040, with AI training facilities accounting for 58% of total data center copper consumption by 2030.', source:'S&P Global Commodity Insights' },
  { date:'Dec 2025', tag:'MARKETS',      tagColor:'#c9a84c', headline:'Gold, silver, and copper reach simultaneous all-time highs for first time in 45 years', body:"The convergence of AI hardware demand, safe-haven flows, and solar energy buildout created a rare trifecta. Analysts note that AI's dual impact on both industrial and financial commodity demand is structurally new.", source:'US Funds / Bloomberg' },
  { date:'Dec 2025', tag:'INFRASTRUCTURE',tagColor:'#4c8ec9', headline:'WEF: Each MW of AI-optimized data center now embeds 85+ tonnes of minerals vs 65t for standard', body:'The World Economic Forum\'s "Minerals to Megawatts" report documents rising material intensity as AI facilities demand denser rack configurations, heavier cooling, and more robust electrical infrastructure.', source:'World Economic Forum' },
  { date:'Oct 2025', tag:'GEOPOLITICS',  tagColor:'#c98c4c', headline:'US-China rare earth standoff intensifies; DoD invests $800M in domestic processing capacity', body:"The Pentagon's critical minerals program expanded direct investment in rare earth separation and processing facilities, targeting gallium, germanium, and heavy rare earth independence from Chinese supply chains.", source:'FP Analytics / DoD Press Release' },
  { date:'Jul 2025', tag:'SUPPLY',       tagColor:'#c94c4c', headline:'Gallium demand projected +85% by 2033 on AI chip scaling; China controls 98% of supply', body:'FP Analytics research documents that AI-specific mineral needs are projected to increase germanium demand by 37% and gallium demand by 85% by 2033, against a supply base almost entirely controlled by China.', source:'FP Analytics / IEA Critical Minerals Outlook' },
]

export default function NewsSection() {
  return (
    <section id="news" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="section-header">
        <span className="section-num">06</span>
        <h2 className="section-title">RECENT <span>DEVELOPMENTS</span></h2>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', background: 'var(--border)', gap: 1 }}>
        {NEWS.map((n, i) => (
          <div key={i} className="relative overflow-hidden" style={{ background: 'var(--bg)', padding: '28px 28px' }}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[7px] tracking-[0.15em] px-[7px] py-[3px] uppercase" style={{ border: `1px solid ${n.tagColor}`, color: n.tagColor }}>
                {n.tag}
              </span>
              <span className="text-[8px] tracking-[0.08em]" style={{ color: 'var(--text-muted)' }}>{n.date}</span>
            </div>
            <div className="text-[11px] font-sans font-medium leading-[1.5] mb-3" style={{ color: 'var(--text)' }}>
              {n.headline}
            </div>
            <div className="text-[9px] font-sans leading-[1.7] mb-3" style={{ color: 'var(--text-muted)' }}>
              {n.body}
            </div>
            <div className="text-[8px] tracking-[0.08em] pt-2" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
              SRC: {n.source}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px 48px', borderTop: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <p className="text-[9px] font-sans" style={{ color: 'var(--text-muted)' }}>
          Sources: Reuters, Financial Times, S&P Global, Wood Mackenzie, USGS, FP Analytics · Curated Q1–Q2 2026
        </p>
      </div>
    </section>
  )
}
