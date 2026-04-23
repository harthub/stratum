'use client'

import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { href: '#hardware',     num: '01', label: 'Hardware Map' },
  { href: '#prices',       num: '02', label: 'Commodity Prices' },
  { href: '#forex',        num: '03', label: 'Forex Pairs' },
  { href: '#equities',     num: '04', label: 'Mining Equities' },
  { href: '#geopolitical', num: '05', label: 'Geopolitical Risk' },
  { href: '#news',         num: '06', label: 'Recent Developments' },
  { href: '#recycling',    num: '07', label: 'Recycling & Urban Mining' },
  { href: '#timeline',     num: '08', label: 'Key Events Timeline' },
  { href: '#hyperscalers', num: '09', label: 'Hyperscaler Capex' },
  { href: '#sources',      num: '10', label: 'Sources & Methodology' },
  { href: '#thesis',       num: '11', label: 'The Thesis' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const close = () => setOpen(false)
  const toggle = () => setOpen(o => !o)

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 32,
    left: 0,
    right: 0,
    zIndex: 500,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    background: 'rgba(10,10,10,0.98)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
  }

  const logoStyle: React.CSSProperties = {
    fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
    fontSize: 22,
    letterSpacing: '0.1em',
    color: 'var(--text)',
    textDecoration: 'none',
    cursor: 'crosshair',
  }

  const tagStyle: React.CSSProperties = {
    fontSize: 9,
    letterSpacing: '0.15em',
    color: 'var(--text-muted)',
    border: '1px solid var(--border)',
    padding: '3px 8px',
  }

  const hamBtnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 5,
    width: 36,
    height: 36,
    padding: '8px',
    background: 'transparent',
    border: `1px solid ${open ? 'var(--gold)' : 'var(--border)'}`,
    cursor: 'crosshair',
    flexShrink: 0,
  }

  const line1: React.CSSProperties = {
    display: 'block',
    width: '100%',
    height: 1,
    background: open ? 'var(--gold)' : 'var(--text-dim)',
    transform: open ? 'translateY(6px) rotate(45deg)' : 'none',
    transition: 'all 0.25s',
    transformOrigin: 'center',
  }
  const line2: React.CSSProperties = {
    display: 'block',
    width: '100%',
    height: 1,
    background: open ? 'var(--gold)' : 'var(--text-dim)',
    opacity: open ? 0 : 1,
    transition: 'all 0.25s',
  }
  const line3: React.CSSProperties = {
    display: 'block',
    width: '100%',
    height: 1,
    background: open ? 'var(--gold)' : 'var(--text-dim)',
    transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none',
    transition: 'all 0.25s',
    transformOrigin: 'center',
  }

  const dropdownStyle: React.CSSProperties = {
    position: 'fixed',
    top: 80,
    right: 32,
    width: 240,
    background: 'var(--bg)',
    border: '1px solid var(--border-bright)',
    boxShadow: '0 16px 48px rgba(0,0,0,0.8)',
    zIndex: 600,
    display: open ? 'flex' : 'none',
    flexDirection: 'column',
  }

  return (
    <>
      {/* Click-away overlay */}
      {open && (
        <div
          onClick={close}
          style={{ position: 'fixed', inset: 0, zIndex: 599 }}
        />
      )}

      {/* Nav bar */}
      <nav style={navStyle}>
        <a href="#" style={logoStyle} onClick={close}>
          STRA<span style={{ color: 'var(--gold)' }}>T</span>UM
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={tagStyle}>V1 · RESEARCH TOOL</div>
          <button onClick={toggle} style={hamBtnStyle} aria-label="Menu">
            <span style={line1} />
            <span style={line2} />
            <span style={line3} />
          </button>
        </div>
      </nav>

      {/* Dropdown */}
      <div style={dropdownStyle}>
        <div style={{
          padding: '10px 16px',
          fontSize: 7,
          letterSpacing: '0.25em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg2)',
        }}>
          — Navigate
        </div>
        {NAV_LINKS.map(link => (
          <a
            key={link.href}
            href={link.href}
            onClick={close}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '11px 16px',
              fontSize: 10,
              letterSpacing: '0.12em',
              color: 'var(--text-dim)',
              textDecoration: 'none',
              textTransform: 'uppercase',
              borderBottom: '1px solid var(--border)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.color = 'var(--gold)'
              el.style.paddingLeft = '20px'
              el.style.background = 'rgba(201,168,76,0.04)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.color = 'var(--text-dim)'
              el.style.paddingLeft = '16px'
              el.style.background = 'transparent'
            }}
          >
            <span style={{ fontSize: 8, color: 'var(--text-muted)', minWidth: 20, letterSpacing: '0.1em' }}>
              {link.num}
            </span>
            {link.label}
          </a>
        ))}
      </div>
    </>
  )
}
