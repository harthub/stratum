'use client'

import { useEquities } from '@/lib/hooks'
import { formatStockPrice, formatChg, isPositive } from '@/lib/types'

const HYPERSCALER_META = [
  { ticker:'MSFT', capex:'$80B',  copper:'~5.2M t', mw:'~8,000 MW', moves:"Direct copper offtake discussions; invested in Helion nuclear for data center power; ARIS copper project supplier conversations underway.", risk:'Power procurement timeline', color:'#4c8ec9' },
  { ticker:'AMZN', capex:'$105B', copper:'~6.8M t', mw:'~10,500 MW',moves:"Nuclear PPAs (Talen Energy); rare earth magnet supplier audits; copper supplier diversification program underway across AWS regions.", risk:'Permitting delays for nuclear', color:'#c9a84c' },
  { ticker:'GOOGL',capex:'$75B',  copper:'~4.9M t', mw:'~7,500 MW', moves:"24/7 carbon-free energy targets; geothermal investment; known to audit Tier 1 copper and rare earth suppliers for ESG compliance.", risk:'Sustainability vs. speed tradeoff', color:'#4caf78' },
  { ticker:'META', capex:'$65B',  copper:'~4.2M t', mw:'~6,500 MW', moves:"Llama infrastructure buildout driving GPU rack density. Nuclear feasibility studies underway. Less public on mineral sourcing vs. peers.", risk:'Concentration in GPU supply', color:'#4c8ec9' },
  { ticker:'NVDA', capex:'N/A',   copper:'Enabler', mw:'N/A',        moves:"EML laser supply cornering for optical networking; CoWoS advanced packaging demand driving In/Sn pressure; H100/B200 requires Ga, Si, Cu, Au at scale.", risk:'MLCC and optical component lead times', color:'#c94c8e' },
]

const STATS = [
  { val:'$400B+', label:'Combined 2025–26 Capex' },
  { val:'~33GW',  label:'Est. New Capacity Added' },
  { val:'2.1Mt',  label:'Est. Copper Requirement' },
  { val:'17yr',   label:'Mine Production Lag vs. Now' },
]

export default function HyperscalersSection() {
  const { data, loading, lastUpdated } = useEquities()

  const hyperscalerMap: Record<string, any> = {}
  data?.hyperscalers?.forEach((h: any) => { hyperscalerMap[h.ticker] = h })

  const rows = HYPERSCALER_META.map(m => ({
    ...m,
    ...(hyperscalerMap[m.ticker] ?? {}),
  }))

  return (
    <section id="hyperscalers" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="section-header">
        <span className="section-num">09</span>
        <h2 className="section-title">HYPERSCALER <span>CAPEX</span></h2>
        {lastUpdated && (
          <span className="live-badge ml-4"><span className="live-dot" />Live stock prices · {lastUpdated.toLocaleTimeString()}</span>
        )}
      </div>

      <div style={{ padding: '24px 48px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <p className="text-[11px] font-sans font-light leading-[1.8] max-w-[780px]" style={{ color: 'var(--text-dim)' }}>
          The five largest hyperscalers are collectively committing over{' '}
          <strong style={{ color: 'var(--text)' }}>$400B in data center capex through 2026</strong>.
          Each dollar translates directly into mineral demand. The table below maps announced capex to estimated mineral consumption and known supply chain moves — this is where the AI demand thesis becomes concrete and quantifiable.
        </p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table" style={{ minWidth: 960 }}>
          <thead>
            <tr>
              {['Company','Stock Price','1D Chg','2025-26 Capex','Est. Copper','Est. MW Added','Known Mineral Moves','Key Risk'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.ticker}>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="w-[6px] h-[6px] rounded-full" style={{ background: r.color }} />
                    <span className="font-medium text-[12px]" style={{ color: 'var(--text)' }}>{r.name ?? r.ticker}</span>
                    <span className="text-[9px] tracking-[0.08em]" style={{ color: 'var(--gold)' }}>{r.ticker}</span>
                  </div>
                </td>
                <td className="font-mono text-[12px]">
                  {loading
                    ? <span className="skeleton inline-block h-3 w-16" />
                    : formatStockPrice(r.price)
                  }
                </td>
                <td className="font-mono text-[11px]" style={{ color: isPositive(r.chg) ? 'var(--green)' : 'var(--red)' }}>
                  {loading
                    ? <span className="skeleton inline-block h-3 w-12" />
                    : r.chg !== null ? formatChg(r.chg) : '—'
                  }
                </td>
                <td className="font-mono text-[12px]" style={{ color: 'var(--gold)' }}>{r.capex}</td>
                <td className="font-mono text-[10px]" style={{ color: 'var(--copper)' }}>{r.copper}</td>
                <td className="font-mono text-[10px]" style={{ color: 'var(--text-dim)' }}>{r.mw}</td>
                <td className="text-[9px] font-sans leading-[1.5]" style={{ color: 'var(--text-muted)', maxWidth: 240 }}>{r.moves}</td>
                <td className="text-[9px] font-sans" style={{ color: '#c98c4c' }}>{r.risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats strip */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', background: 'var(--border)', gap: 1, borderTop: '1px solid var(--border)' }}>
        {STATS.map(s => (
          <div key={s.val} style={{ background: 'var(--bg)', padding: '24px 28px', textAlign: 'center' }}>
            <div className="font-display text-[32px] tracking-[0.02em] mb-1" style={{ color: 'var(--gold)' }}>{s.val}</div>
            <div className="text-[8px] tracking-[0.15em] uppercase" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bull / Bear / Watch */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', background: 'var(--border)', gap: 1, borderTop: '1px solid var(--border)' }}>
        {[
          { label:'The Bull Case', color:'var(--gold)', text:"Structural demand from AI, EVs, and grid buildout is converging on the same minerals simultaneously. Supply response is measured in decades. Companies with permitted copper, gallium, or rare earth assets are sitting on assets that are strategically scarce. Tech companies are beginning to bypass commodity markets with direct offtake deals, effectively putting a floor under certain mining equity valuations." },
          { label:'The Bear Case', color:'var(--red)',  text:"Commodity cycles are notoriously volatile. A slowdown in AI capex spending, a breakthrough in material substitution (e.g. GaN replacing GaAs, sodium-ion batteries reducing lithium demand), or a geopolitical resolution enabling Chinese rare earth exports could rapidly deflate the supply premium. Junior miners in particular carry execution, permitting, and financing risk." },
          { label:'Key Metrics to Watch', color:'var(--silver)', isList: true, items:['Copper LME spot vs. 3-month futures spread','China gallium/germanium export volumes (monthly)','Hyperscaler capex guidance (MSFT, AMZN, GOOG, META)','US critical minerals list updates (USGS)','Mining IPO pipeline & offtake announcements','AUD/USD as leading copper demand indicator','CHIPS Act funding disbursements'] },
        ].map(card => (
          <div key={card.label} style={{ background: 'var(--bg2)', padding: '32px 36px' }}>
            <div className="text-[9px] tracking-[0.2em] uppercase mb-3" style={{ color: card.color }}>{card.label}</div>
            {(card as any).isList ? (
              <ul style={{ listStyle: 'none' }}>
                {(card as any).items.map((item: string) => (
                  <li key={item} className="text-[10px] font-sans leading-[2.2]" style={{ color: 'var(--text-dim)' }}>→ {item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-[11px] font-sans font-light leading-[1.8]" style={{ color: 'var(--text-dim)' }}>{(card as any).text}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
