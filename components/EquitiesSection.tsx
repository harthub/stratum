'use client'

import { useEquities } from '@/lib/hooks'
import { useState } from 'react'
import { formatStockPrice, formatChg, isPositive } from '@/lib/types'

type Tab = 'stocks' | 'etfs' | 'juniors'

const JUNIORS = [
  { name: 'Osisko Metals', ticker: 'OM.V', minerals: 'Copper, Zinc', stage: 'Advanced Exploration', region: 'Canada', thesis: 'Gaspé Copper — one of largest undeveloped copper systems in eastern North America. Secured C$32.5M from Hudbay, Agnico Eagle & Franco-Nevada in 2025.', color: '#b87333' },
  { name: 'Arizona Sonoran', ticker: 'ASCU.V', minerals: 'Copper', stage: 'Pre-Feasibility', region: 'Arizona, USA', thesis: 'ARIS copper project in Arizona. Domestic US copper story. Brownfield site with faster permitting. Direct CHIPS Act beneficiary.', color: '#b87333' },
  { name: 'NiCo Resources', ticker: 'NICO', minerals: 'Ni, Co, Cu, Au', stage: 'Feasibility', region: 'Northwest Territories, CA', thesis: 'Rare domestic cobalt/nickel deposit in stable jurisdiction. Strategic for US battery supply chain independence from DRC/China.', color: '#4cc9b8' },
  { name: 'American Rare Earths', ticker: 'ARR.AX', minerals: 'Nd, Dy, Pr', stage: 'Resource Definition', region: 'Wyoming, USA', thesis: 'La Paz project — significant US rare earth deposit. Neodymium/dysprosium for data center cooling magnets. DoD critical minerals policy alignment.', color: '#c060a0' },
]

export default function EquitiesSection() {
  const [tab, setTab] = useState<Tab>('stocks')
  const { data, loading, lastUpdated } = useEquities()

  return (
    <section id="equities" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="section-header">
        <span className="section-num">04</span>
        <h2 className="section-title">MINING <span>EQUITIES</span></h2>
        {lastUpdated && (
          <span className="live-badge ml-4"><span className="live-dot" />Live via Yahoo Finance · {lastUpdated.toLocaleTimeString()}</span>
        )}
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 48px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <div className="flex pt-4">
          {(['stocks','etfs','juniors'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`chart-tab ${tab === t ? 'active' : ''}`}
              style={{ marginLeft: t === 'stocks' ? 0 : undefined }}
            >
              {t === 'stocks' ? 'Individual Stocks' : t === 'etfs' ? 'ETFs / Funds' : 'Junior Miners'}
            </button>
          ))}
        </div>
      </div>

      {/* Stocks */}
      {tab === 'stocks' && (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: 900 }}>
            <thead>
              <tr>
                {['Company','Price','1D Chg','Mkt Cap','52W Range','Minerals','AI Relevance','Risk'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(10).fill(null).map((_,i) => <SkeletonRow key={i} cols={8} />)
                : (data?.stocks ?? []).map((s: any) => (
                  <tr key={s.ticker}>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="w-[6px] h-[6px] rounded-full" style={{ background: s.dot }} />
                        <span className="font-medium text-[12px]" style={{ color: 'var(--text)' }}>{s.name}</span>
                        <span className="text-[9px] tracking-[0.08em]" style={{ color: 'var(--gold)' }}>{s.ticker}</span>
                      </div>
                    </td>
                    <td className="font-mono text-[12px]">{formatStockPrice(s.price)}</td>
                    <td className="font-mono text-[11px]" style={{ color: isPositive(s.chg) ? 'var(--green)' : 'var(--red)' }}>
                      {formatChg(s.chg)}
                    </td>
                    <td className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{s.mktCap ?? '—'}</td>
                    <td className="text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>
                      {s.fiftyTwoWeekLow && s.fiftyTwoWeekHigh
                        ? `$${s.fiftyTwoWeekLow.toFixed(0)} – $${s.fiftyTwoWeekHigh.toFixed(0)}`
                        : '—'
                      }
                    </td>
                    <td className="text-[9px] font-sans" style={{ color: 'var(--text-dim)' }}>{s.minerals}</td>
                    <td className="text-[9px] font-sans" style={{ color: 'var(--text-muted)', maxWidth: 180 }}>{s.relevance}</td>
                    <td>
                      <span className="text-[8px] tracking-[0.08em]" style={{
                        color: s.risk === 'Very High' ? 'var(--red)' : s.risk === 'High' ? '#c98c4c' : s.risk === 'Medium' ? 'var(--gold)' : 'var(--green)'
                      }}>
                        {s.risk}
                      </span>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )}

      {/* ETFs */}
      {tab === 'etfs' && (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', background: 'var(--border)', gap: 1 }}>
          {loading
            ? Array(6).fill(null).map((_,i) => <EtfSkeleton key={i} />)
            : (data?.etfs ?? []).map((e: any) => (
              <div key={e.ticker} className="relative overflow-hidden" style={{ background: 'var(--bg)', padding: '28px 28px' }}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-display text-[26px] tracking-[0.05em]" style={{ color: e.dot }}>{e.ticker}</span>
                  <span className="font-mono text-[14px]" style={{ color: isPositive(e.chg) ? 'var(--green)' : 'var(--red)' }}>
                    {formatChg(e.chg)}
                  </span>
                </div>
                <div className="text-[9px] tracking-[0.1em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>{e.name}</div>
                <div className="flex gap-5 mb-4">
                  <div>
                    <div className="text-[8px] tracking-[0.15em] uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Price</div>
                    <div className="font-mono text-[14px]">{formatStockPrice(e.price)}</div>
                  </div>
                  <div>
                    <div className="text-[8px] tracking-[0.15em] uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Exp Ratio</div>
                    <div className="font-mono text-[14px]">{e.exp}</div>
                  </div>
                </div>
                <p className="text-[10px] font-sans leading-[1.7] mb-3" style={{ color: 'var(--text-muted)' }}>{e.desc}</p>
                <div className="text-[8px] tracking-[0.1em] uppercase" style={{ color: 'var(--text-muted)' }}>
                  TOP HOLDINGS: <span style={{ color: 'var(--text-dim)' }}>{e.holdings}</span>
                </div>
                <div className="absolute font-display pointer-events-none select-none" style={{ bottom: -8, right: 4, fontSize: 72, color: 'rgba(255,255,255,0.02)', lineHeight: 1 }}>
                  {e.ticker}
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* Juniors */}
      {tab === 'juniors' && (
        <div style={{ padding: '32px 48px' }}>
          <p className="text-[11px] font-sans leading-[1.8] font-light mb-6 max-w-[700px]" style={{ color: 'var(--text-dim)' }}>
            Junior miners are early-stage exploration and development companies. The AI mineral supply crunch is compressing the <strong style={{ color: 'var(--text)' }}>17-year average mine-to-production timeline</strong> into a competitive premium — companies with <em>permitted, advanced-stage assets</em> are attracting strategic capital and direct tech-company offtake agreements.
          </p>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', background: 'var(--border)', gap: 1 }}>
            {JUNIORS.map(j => (
              <div key={j.ticker} style={{ background: 'var(--bg)', padding: '28px 32px', borderLeft: `3px solid ${j.color}` }}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-display text-[20px] tracking-[0.05em]">{j.name}</span>
                  <span className="font-mono text-[10px] tracking-[0.1em]" style={{ color: 'var(--gold)' }}>{j.ticker}</span>
                </div>
                <div className="flex gap-3 flex-wrap mb-4">
                  <span className="text-[8px] tracking-[0.12em] uppercase" style={{ color: 'var(--text-muted)' }}>
                    MINERALS: <span style={{ color: 'var(--text-dim)' }}>{j.minerals}</span>
                  </span>
                  <span className="text-[8px] tracking-[0.12em] uppercase" style={{ color: 'var(--text-muted)' }}>
                    STAGE: <span style={{ color: j.color }}>{j.stage}</span>
                  </span>
                  <span className="text-[8px] tracking-[0.12em] uppercase" style={{ color: 'var(--text-muted)' }}>
                    REGION: <span style={{ color: 'var(--text-dim)' }}>{j.region}</span>
                  </span>
                </div>
                <p className="text-[10px] font-sans font-light leading-[1.8]" style={{ color: 'var(--text-dim)' }}>{j.thesis}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ padding: '16px 48px', borderTop: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <p className="text-[9px] font-sans" style={{ color: 'var(--text-muted)' }}>
          * Live prices via Yahoo Finance. Market caps and 52W ranges from Yahoo Finance. Junior miner data is reference only. Not financial advice.
        </p>
      </div>
    </section>
  )
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array(cols).fill(null).map((_,i) => (
        <td key={i} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
          <span className="skeleton inline-block h-3 w-20" />
        </td>
      ))}
    </tr>
  )
}

function EtfSkeleton() {
  return (
    <div style={{ background: 'var(--bg)', padding: '28px 28px' }}>
      <div className="skeleton h-7 w-20 mb-2" />
      <div className="skeleton h-3 w-40 mb-4" />
      <div className="skeleton h-4 w-24 mb-4" />
      <div className="skeleton h-3 w-full mb-2" />
      <div className="skeleton h-3 w-4/5" />
    </div>
  )
}
