'use client'

import { useMetals, useForex, useEquities } from '@/lib/hooks'

interface Item { label: string; value: string; chg: number | null }

function TickerItem({ label, value, chg }: Item) {
  const up = chg !== null && chg >= 0
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '0 20px',
      fontSize: 10,
      letterSpacing: '0.04em',
      color: 'var(--text-dim)',
      whiteSpace: 'nowrap',
      borderRight: '1px solid var(--border)',
    }}>
      <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{value}</span>
      {chg !== null && (
        <span style={{ color: up ? 'var(--green)' : 'var(--red)', fontSize: 9 }}>
          {up ? '+' : ''}{chg.toFixed(2)}%
        </span>
      )}
    </div>
  )
}

export default function Ticker() {
  const metals   = useMetals()
  const forex    = useForex()
  const equities = useEquities()

  const items: Item[] = []

  if (metals.data) {
    metals.data.live.forEach((m: any) => {
      if (m.price) {
        const p = m.unit === '/oz'
          ? `$${parseFloat(m.price).toFixed(2)}`
          : `$${Math.round(m.price).toLocaleString()}`
        items.push({ label: m.name.toUpperCase(), value: p + m.unit, chg: m.chg })
      }
    })
  }

  if (forex.data) {
    forex.data.forEach((f: any) => {
      items.push({ label: f.pair, value: f.rateDisplay, chg: null })
    })
  }

  if (equities.data) {
    const KEY = ['FCX','MP','COPX','REMX','WPM','NVDA','MSFT','AMZN']
    const all = [...(equities.data.stocks||[]), ...(equities.data.etfs||[]), ...(equities.data.hyperscalers||[])]
    all.filter((e: any) => KEY.includes(e.ticker) && e.price).forEach((e: any) => {
      items.push({ label: e.ticker, value: `$${parseFloat(e.price).toFixed(2)}`, chg: e.chg })
    })
  }

  // Fallback placeholders while loading
  const display = items.length > 0 ? [...items, ...items] : Array(16).fill({ label: '···', value: '···', chg: null })

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 501,
      height: 32,
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
    }}>
      {/* Label */}
      <div style={{
        padding: '0 14px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        fontSize: 9,
        letterSpacing: '0.2em',
        color: items.length > 0 ? 'var(--green)' : 'var(--text-muted)',
        background: 'var(--bg2)',
        borderRight: '1px solid var(--border)',
        flexShrink: 0,
        gap: 5,
        whiteSpace: 'nowrap',
      }}>
        {items.length > 0 && <span className="live-dot" />}
        {items.length > 0 ? 'LIVE' : 'LOADING'}
      </div>

      {/* Scrolling track */}
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div className="ticker-track">
          {display.map((item, i) => (
            <TickerItem key={i} {...item} />
          ))}
        </div>
      </div>
    </div>
  )
}
