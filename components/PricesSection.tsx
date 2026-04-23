'use client'

import { useMetals, useCharts } from '@/lib/hooks'
import { useEffect, useRef, useState } from 'react'
import { formatPrice, formatChg, isPositive } from '@/lib/types'

function PriceRow({ item }: { item: any }) {
  const up = isPositive(item.chg)
  return (
    <tr>
      <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 14, paddingBottom: 14, borderBottom: '1px solid var(--border)', verticalAlign: 'middle' }}>
        <div className="flex items-center gap-2">
          <span className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: item.dot ?? '#666' }} />
          <span className="text-[12px] font-medium" style={{ color: 'var(--text)' }}>{item.name}</span>
          <span className="text-[9px] tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>{item.sym}</span>
          {item.live ? (
            <span className="live-badge ml-1"><span className="live-dot" />LIVE</span>
          ) : (
            <span className="ref-badge">REF</span>
          )}
        </div>
      </td>
      <td className="font-mono text-[11px]" style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', color: 'var(--text-dim)' }}>
        {item.price
          ? formatPrice(item.price, item.unit)
          : <span className="skeleton inline-block w-16 h-3" />
        }
        <span className="text-[9px] ml-1" style={{ color: 'var(--text-muted)' }}>{item.unit}</span>
      </td>
      <td className="font-mono text-[11px]" style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', color: up ? 'var(--green)' : 'var(--red)' }}>
        {item.chg !== null && item.chg !== undefined
          ? formatChg(item.chg)
          : <span className="skeleton inline-block w-12 h-3" />
        }
      </td>
      <td className="text-[9px] font-sans" style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
        {item.driver ?? item.note ?? '—'}
      </td>
    </tr>
  )
}

const AI_DRIVERS: Record<string, string> = {
  gold:      'Connector plating, wire bonding',
  silver:    'PCBs, solder, MLCC capacitors',
  palladium: 'MLCCs — 100s per GPU/MOBO',
  platinum:  'Sensors, storage components',
  copper:    'Wiring, cooling, power infra',
  aluminum:  'Chassis, heat sinks, cooling',
  nickel:    'Connector plating, batteries',
  tin:       'Lead-free solder (all PCBs)',
}

const DOTS: Record<string, string> = {
  gold: '#c9a84c', silver: '#a8a8b0', palladium: '#b8a0d0', platinum: '#d0c8b8',
  copper: '#b87333', aluminum: '#909098', nickel: '#7a9090', tin: '#a09070',
}

const SPECIALTY_DOTS: Record<string, string> = {
  GA: '#c94c8e', GE: '#c9844c', ND: '#c060a0', DY: '#a060c0',
  CAF: '#c0c060', CO: '#4cc9b8', LI: '#a8c44c', TA: '#8e4cc9',
}

export default function PricesSection() {
  const { data, loading } = useMetals()

  const precious   = data?.live.filter((m: any) => m.category === 'precious') ?? []
  const industrial = data?.live.filter((m: any) => m.category === 'industrial') ?? []
  const specialty  = data?.specialty ?? []

  const enrich = (items: any[]) =>
    items.map((m: any) => ({
      ...m,
      driver: AI_DRIVERS[m.key] ?? m.note,
      dot: DOTS[m.key] ?? SPECIALTY_DOTS[m.sym] ?? '#666',
    }))

  const specialtyEnriched = specialty.map((m: any) => ({
    ...m,
    dot: SPECIALTY_DOTS[m.sym] ?? '#666',
    live: false,
  }))

  return (
    <section id="prices" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="section-header">
        <span className="section-num">02</span>
        <h2 className="section-title">COMMODITY <span>PRICES</span></h2>
        {!loading && data && (
          <span className="live-badge ml-4"><span className="live-dot" />Live via Yahoo Finance</span>
        )}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        {/* Precious */}
        <div style={{ borderRight: '1px solid var(--border)', padding: '40px 40px' }}>
          <div className="text-[9px] tracking-[0.25em] uppercase mb-5" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
            — Precious Metals
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Metal','Price','1D Chg','AI Use'].map(h => (
                  <th key={h} className="text-left text-[8px] tracking-[0.2em] uppercase font-normal px-4 py-2" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(4).fill(null).map((_, i) => <SkeletonRow key={i} />)
                : enrich(precious).map((m: any) => <PriceRow key={m.key} item={m} />)
              }
            </tbody>
          </table>
        </div>

        {/* Industrial */}
        <div style={{ borderRight: '1px solid var(--border)', padding: '40px 40px' }}>
          <div className="text-[9px] tracking-[0.25em] uppercase mb-5" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
            — Industrial Metals
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Metal','Price','1D Chg','AI Use'].map(h => (
                  <th key={h} className="text-left text-[8px] tracking-[0.2em] uppercase font-normal px-4 py-2" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(4).fill(null).map((_, i) => <SkeletonRow key={i} />)
                : enrich(industrial).map((m: any) => <PriceRow key={m.key} item={m} />)
              }
            </tbody>
          </table>
        </div>

        {/* Specialty */}
        <div style={{ padding: '40px 40px' }}>
          <div className="text-[9px] tracking-[0.25em] uppercase mb-5" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
            — Critical / Specialty <span className="ml-2 text-[7px] normal-case tracking-normal">(Reference prices — no exchange listing)</span>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Metal','Price','1Y Chg','Source'].map(h => (
                  <th key={h} className="text-left text-[8px] tracking-[0.2em] uppercase font-normal px-4 py-2" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specialtyEnriched.map((m: any) => <PriceRow key={m.sym} item={m} />)}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function SkeletonRow() {
  return (
    <tr>
      {[1,2,3,4].map(i => (
        <td key={i} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
          <span className="skeleton inline-block h-3 w-20" />
        </td>
      ))}
    </tr>
  )
}
