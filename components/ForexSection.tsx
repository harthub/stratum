'use client'

import { useForex } from '@/lib/hooks'

export default function ForexSection() {
  const { data, loading, lastUpdated } = useForex()

  return (
    <section id="forex" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="section-header">
        <span className="section-num">03</span>
        <h2 className="section-title">COMMODITY <span>FOREX</span> PAIRS</h2>
        {lastUpdated && (
          <span className="live-badge ml-4">
            <span className="live-dot" />
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', background: 'var(--border)', gap: 1 }}>
        {loading
          ? Array(4).fill(null).map((_, i) => <FxSkeleton key={i} />)
          : (data ?? []).map((f: any) => <FxCard key={f.pair} pair={f} />)
        }
      </div>

      <div style={{ padding: '24px 48px', borderTop: '1px solid var(--border)' }}>
        <p className="text-[10px] font-sans leading-[1.8] max-w-[700px]" style={{ color: 'var(--text-muted)' }}>
          Commodity-exporting nations' currencies correlate structurally with their primary mineral exports.
          As AI-driven demand pushes critical mineral prices higher, producer-nation currencies face appreciation
          pressure — creating a cross-asset opportunity connecting hardware supply chains directly to FX markets.
          Rates via ExchangeRate-API · Refreshed every 5 minutes.
        </p>
      </div>
    </section>
  )
}

function FxCard({ pair }: { pair: any }) {
  const up = pair.rateDisplay && pair.pair === 'AUD/USD'
    ? true
    : pair.pair !== 'AUD/USD'

  return (
    <div className="relative overflow-hidden" style={{ background: 'var(--bg)', padding: '28px 24px' }}>
      <div className="font-display text-[22px] tracking-[0.05em] mb-1">{pair.pair}</div>
      <div className="text-[8px] tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
        {pair.country} · {pair.commodity}
      </div>

      <div className="font-display text-[32px] tracking-[0.02em] mb-1" style={{ color: 'var(--text)' }}>
        {pair.live ? pair.rateDisplay : '—'}
      </div>

      {pair.live && (
        <div className="flex items-center gap-2 mb-3">
          <span className="live-badge"><span className="live-dot" />LIVE</span>
          <span className="text-[8px] tracking-[0.08em]" style={{ color: 'var(--text-muted)' }}>
            ExchangeRate-API
          </span>
        </div>
      )}

      <p className="text-[9px] leading-[1.6] font-sans mt-3" style={{ color: 'var(--text-muted)' }}>
        {pair.desc}
      </p>

      {/* Background text */}
      <div
        className="absolute font-display pointer-events-none select-none"
        style={{ bottom: -10, right: 4, fontSize: 80, color: 'rgba(255,255,255,0.02)', lineHeight: 1 }}
      >
        {pair.bg}
      </div>
    </div>
  )
}

function FxSkeleton() {
  return (
    <div style={{ background: 'var(--bg)', padding: '28px 24px' }}>
      <div className="skeleton h-6 w-24 mb-2" />
      <div className="skeleton h-3 w-32 mb-4" />
      <div className="skeleton h-8 w-28 mb-2" />
      <div className="skeleton h-3 w-full mt-4" />
      <div className="skeleton h-3 w-4/5 mt-2" />
    </div>
  )
}
