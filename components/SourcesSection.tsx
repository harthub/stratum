const PRIMARY = [
  { name:'IEA Critical Minerals Outlook 2024',           desc:'Supply/demand projections, mine coverage gaps, 2035 scenarios. Primary source for 70% copper coverage figure.' },
  { name:'USGS Mineral Commodity Summaries 2025',        desc:'US import dependency figures, production data, critical minerals list. Source for all 100% import dependency claims.' },
  { name:'WEF "Minerals to Megawatts" Report 2025',      desc:'Material intensity per MW, data center mineral backbone analysis. Source for 60–75t/MW and Microsoft Chicago facility figures.' },
  { name:'S&P Global Copper Systemic Risk Report 2026',  desc:'10Mt deficit projection, data center copper demand to 2040. Source for 2.5M metric ton 2040 demand figure.' },
  { name:'Wood Mackenzie Copper Market Outlook',          desc:'304,000t 2025 deficit forecast, mine disruption analysis. Source for near-term supply gap data.' },
  { name:'FP Analytics: AI & Critical Minerals 2025',    desc:'Gallium +85%, germanium +37% demand by 2033. China dominance % figures. Source for geopolitical risk assessments.' },
]

const MARKET = [
  { name:'Yahoo Finance (yahoo-finance2)',          desc:'Live equity prices for mining stocks, ETFs, and hyperscalers. No API key required — server-side only.' },
  { name:'ExchangeRate-API',                        desc:'Live forex pair rates. AUD/USD, USD/CLP, USD/ZAR, USD/PEN. Refreshed every 5 minutes.' },
  { name:'LME (London Metal Exchange)',             desc:'Copper, aluminum, nickel, tin futures reference prices via Yahoo Finance futures symbols.' },
  { name:'COMEX / CME Group',                       desc:'Gold, silver, palladium, platinum futures data via Yahoo Finance.' },
  { name:'Asian Metal / Shanghai Metals Market',    desc:'Reference prices for specialty OTC metals: gallium, germanium, neodymium, dysprosium, tantalum.' },
  { name:'Fastmarkets / Benchmark Mineral Intelligence', desc:'Cobalt and lithium price references. CIF China and battery-grade spot market.' },
]

const METHODS = [
  { label:'Mineral intensity estimates', text:'Per-MW mineral consumption figures sourced from WEF (2025) and USGS, cross-referenced with Microsoft Chicago facility disclosure (2,100t Cu / 80 MW). AI-optimized multipliers applied per facility type based on WEF tier classifications.' },
  { label:'China control %', text:'Mining and refining figures from IEA, USGS, and FP Analytics (2025). Refining figures represent processed/refined output capacity, not raw mine output. Sources occasionally diverge; figures represent consensus midpoint.' },
  { label:'Live price data', text:'Precious and industrial metals via Yahoo Finance futures symbols (GC=F, SI=F, HG=F etc.). Equity prices via yahoo-finance2 npm package running server-side in Next.js API routes. Specialty metals are OTC reference prices updated manually.' },
  { label:'Equity & ETF data', text:'Market caps, prices, and 1-day changes are live from Yahoo Finance. 52-week ranges sourced from same. Junior miner data is reference only — these trade OTC or on TSX Venture and may have limited Yahoo Finance coverage.' },
  { label:'Forex rates', text:'Live rates from ExchangeRate-API free tier. Rates refreshed every 5 minutes. USD base rates used to calculate all four pairs (AUD/USD, USD/CLP, USD/ZAR, USD/PEN).' },
]

export default function SourcesSection() {
  return (
    <section id="sources" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="section-header">
        <span className="section-num">10</span>
        <h2 className="section-title">SOURCES & <span>METHODOLOGY</span></h2>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid var(--border)' }}>
        {/* Primary Sources */}
        <div style={{ padding: '36px 40px', borderRight: '1px solid var(--border)' }}>
          <div className="text-[9px] tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--gold)' }}>— Primary Sources</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PRIMARY.map(s => (
              <li key={s.name} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                <div className="text-[10px] font-sans font-medium mb-1" style={{ color: 'var(--text)' }}>{s.name}</div>
                <div className="text-[9px] font-sans leading-[1.5]" style={{ color: 'var(--text-muted)' }}>{s.desc}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Market Data */}
        <div style={{ padding: '36px 40px', borderRight: '1px solid var(--border)' }}>
          <div className="text-[9px] tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--gold)' }}>— Market Data Sources</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MARKET.map(s => (
              <li key={s.name} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                <div className="text-[10px] font-sans font-medium mb-1" style={{ color: 'var(--text)' }}>{s.name}</div>
                <div className="text-[9px] font-sans leading-[1.5]" style={{ color: 'var(--text-muted)' }}>{s.desc}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Methodology */}
        <div style={{ padding: '36px 40px' }}>
          <div className="text-[9px] tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--gold)' }}>— Methodology Notes</div>
          <div className="flex flex-col gap-3">
            {METHODS.map(m => (
              <div key={m.label} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                <div className="text-[8px] tracking-[0.15em] uppercase mb-1" style={{ color: 'var(--gold)' }}>{m.label}</div>
                <p className="text-[9px] font-sans leading-[1.6]" style={{ color: 'var(--text-muted)' }}>{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 48px', background: 'var(--bg2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="text-[9px] font-sans tracking-[0.06em]" style={{ color: 'var(--text-muted)' }}>
          Built for educational and research purposes · DePaul University Finance · 2026
        </div>
        <div className="text-[9px] tracking-[0.1em] px-3 py-[6px]" style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          NOT FINANCIAL ADVICE
        </div>
      </div>
    </section>
  )
}
