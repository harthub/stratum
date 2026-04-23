'use client'

import { useState } from 'react'

const MINERALS_DB: Record<string, { name: string; color: string; price: string; risk: string; use: string; region: string }> = {
  cu: { name: 'Copper',     color: '#b87333', price: 'Live ↑', risk: 'HIGH',     use: 'Primary conductor in PCBs, wiring, cooling. Each MW embeds 60–75t of minerals with copper dominant.', region: 'Chile, Peru, DRC, Australia' },
  au: { name: 'Gold',       color: '#c9a84c', price: 'Live ↑', risk: 'MEDIUM',   use: 'Connector plating, chip bonding wires. Every PCIe slot and RAM connector is gold-plated.', region: 'Australia, Russia, Canada, S. Africa' },
  ag: { name: 'Silver',     color: '#a8a8b0', price: 'Live ↑', risk: 'HIGH',     use: 'Best conductor of any element. PCB solder, capacitors, thermal interfaces.', region: 'Mexico, Peru, China, Russia' },
  pd: { name: 'Palladium',  color: '#b8a0d0', price: 'Live',   risk: 'CRITICAL', use: 'MLCCs — hundreds per GPU/MOBO. Russia + S. Africa control ~80% of supply.', region: 'Russia, South Africa, Canada' },
  si: { name: 'Silicon',    color: '#4c8ec9', price: 'Ref',    risk: 'MEDIUM',   use: 'The semiconductor substrate. Every AI chip is built on a silicon wafer.', region: 'China, Russia, Norway, USA' },
  ga: { name: 'Gallium',    color: '#c94c8e', price: 'Ref',    risk: 'CRITICAL', use: 'GaAs/GaN compound semiconductors in AI chips. China controls 98%. Export controls 2023.', region: 'China (98%+)' },
  ge: { name: 'Germanium',  color: '#c9844c', price: 'Ref',    risk: 'CRITICAL', use: 'Fiber optic cables (GeO2) for AI inter-node networking. China restricted exports 2023.', region: 'China (60%+), Russia, Canada' },
  nd: { name: 'Neodymium',  color: '#c060a0', price: 'Ref',    risk: 'CRITICAL', use: 'NdFeB magnets in every cooling fan/pump motor across the data center. 90% China-processed.', region: 'China (90%), Australia, Myanmar' },
  dy: { name: 'Dysprosium', color: '#a060c0', price: 'Ref',    risk: 'CRITICAL', use: 'High-temp magnet performance. China controls essentially all refining. No substitute.', region: 'China (99%+)' },
  co: { name: 'Cobalt',     color: '#4cc9b8', price: 'Ref',    risk: 'HIGH',     use: 'Hard drives, UPS battery backup systems. DRC mines 73%, China refines 72%.', region: 'DRC, Russia, Australia' },
  li: { name: 'Lithium',    color: '#a8c44c', price: 'Ref',    risk: 'MEDIUM',   use: 'Battery backup systems (UPS). AI facilities moving to on-site Li battery storage.', region: 'Australia, Chile, China, Argentina' },
  ta: { name: 'Tantalum',   color: '#8e4cc9', price: 'Ref',    risk: 'HIGH',     use: 'Tantalum capacitors for high-power voltage regulation in GPUs and server power.', region: 'DRC, Rwanda, Brazil, Australia' },
  al: { name: 'Aluminum',   color: '#909098', price: 'Live',   risk: 'LOW',      use: 'Heat sinks, chassis, cooling assemblies. Dominant structural metal in data centers.', region: 'China, India, Russia, Canada' },
  ni: { name: 'Nickel',     color: '#7a9090', price: 'Live',   risk: 'MEDIUM',   use: 'NiPdAu connector plating standard. NMC battery cathodes for UPS systems.', region: 'Indonesia, Philippines, Russia, Canada' },
  sn: { name: 'Tin',        color: '#a09070', price: 'Live',   risk: 'MEDIUM',   use: 'SnAgCu lead-free solder. Every PCB joint — GPU, RAM, MOBO — is tin-based.', region: 'China, Indonesia, Myanmar, Peru' },
  mn: { name: 'Manganese',  color: '#9080a0', price: 'Ref',    risk: 'MEDIUM',   use: 'NMC battery cathode chemistry for data center UPS systems.', region: 'South Africa, Australia, Gabon, Ukraine' },
}

const HW_COMPONENTS = [
  { id: 'ai-chip',  name: 'AI Accelerator', sub: 'H100 / B200 / TPU',      color: '#c94c8e', minerals: ['si','cu','au','ga','ge','co','nd','la','fl'] },
  { id: 'gpu',      name: 'GPU',            sub: 'Graphics / Compute',       color: '#b87333', minerals: ['cu','au','ag','ga','si','pd','ta','gd'] },
  { id: 'ram',      name: 'RAM / HBM',      sub: 'Memory Stack',             color: '#a8a8b0', minerals: ['si','au','ag','pd','ni','sn','in'] },
  { id: 'mobo',     name: 'Motherboard',    sub: 'Server Board / PCB',       color: '#4c8ec9', minerals: ['cu','au','ag','pd','ta','ni','sn'] },
  { id: 'storage',  name: 'Storage',        sub: 'SSD / NVMe / HDD',         color: '#7a58c9', minerals: ['si','co','nd','dy','au','ta'] },
  { id: 'cooling',  name: 'Cooling',        sub: 'Heat Sinks / Liquid',      color: '#4cc9b8', minerals: ['al','cu','nd','ni','dy'] },
  { id: 'power',    name: 'Power Infra',    sub: 'PSU / Busbars / UPS',      color: '#c9a84c', minerals: ['cu','ta','al','pd','ag'] },
  { id: 'optical',  name: 'Optical Network',sub: 'Fiber / Transceivers',     color: '#c98c4c', minerals: ['ge','in','ga','as','ag'] },
  { id: 'ups',      name: 'Battery Backup', sub: 'UPS / Grid Storage',       color: '#4caf78', minerals: ['li','co','ni','mn','cu'] },
]

const TAG_COLORS: Record<string, string> = {
  cu:'#b87333', au:'#c9a84c', ag:'#a8a8b0', pd:'#b8a0d0', si:'#4c8ec9', co:'#4cc9b8',
  li:'#a8c44c', ga:'#c94c8e', ge:'#c9844c', ta:'#8e4cc9', ni:'#7a9090', al:'#909098',
  sn:'#a09070', in:'#70a080', nd:'#c060a0', dy:'#a060c0', la:'#60a0c0', gd:'#80c060',
  fl:'#c0c060', as:'#c07060', mn:'#9080a0',
}

export default function HardwareMap() {
  const [selected, setSelected] = useState<string | null>(null)
  const [mineral, setMineral] = useState<string | null>(null)

  const mineralData = mineral ? MINERALS_DB[mineral] : null

  return (
    <div style={{ width: '100%', maxWidth: 500 }}>
      <div className="text-[9px] tracking-[0.25em] uppercase text-center mb-6" style={{ color: 'var(--text-muted)' }}>
        — Mineral Map by Component —
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        {HW_COMPONENTS.map(hw => (
          <div
            key={hw.id}
            onClick={() => setSelected(hw.id === selected ? null : hw.id)}
            className="cursor-crosshair transition-all"
            style={{
              background: 'var(--bg2)',
              border: `1px solid ${selected === hw.id ? hw.color : 'var(--border)'}`,
              padding: 14,
              borderLeft: `3px solid ${selected === hw.id ? hw.color : 'var(--border)'}`,
            }}
          >
            <div className="text-[10px] tracking-[0.08em] font-medium uppercase mb-1">{hw.name}</div>
            <div className="text-[8px] tracking-[0.06em] uppercase mb-2" style={{ color: 'var(--text-muted)' }}>{hw.sub}</div>
            <div className="flex flex-wrap gap-1">
              {hw.minerals.map(m => (
                <button
                  key={m}
                  onClick={e => { e.stopPropagation(); setMineral(m === mineral ? null : m) }}
                  className="text-[7px] tracking-[0.06em] px-1 py-[1px] uppercase transition-opacity hover:opacity-70"
                  style={{
                    color: TAG_COLORS[m] ?? '#888',
                    border: `1px solid ${TAG_COLORS[m] ?? '#888'}`,
                    background: 'transparent',
                    cursor: 'crosshair',
                  }}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Mineral detail panel */}
      <div style={{ marginTop: 16, background: 'var(--bg2)', border: '1px solid var(--border)', padding: 20, minHeight: 100 }}>
        {mineralData ? (
          <>
            <div className="font-display text-[28px] tracking-[0.05em] mb-2" style={{ color: mineralData.color }}>
              {mineralData.name}
            </div>
            <div className="flex gap-4 flex-wrap mb-3">
              <span className="text-[9px] tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>
                PRICE <span style={{ color: 'var(--text-dim)' }}>{mineralData.price}</span>
              </span>
              <span className="text-[9px] tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>
                RISK{' '}
                <span style={{ color: mineralData.risk === 'CRITICAL' ? 'var(--red)' : mineralData.risk === 'HIGH' ? '#c98c4c' : 'var(--gold)' }}>
                  {mineralData.risk}
                </span>
              </span>
            </div>
            <p className="text-[11px] font-sans leading-[1.7] mb-2" style={{ color: 'var(--text-dim)' }}>{mineralData.use}</p>
            <div className="text-[9px] tracking-[0.1em] uppercase" style={{ color: 'var(--text-muted)' }}>
              KEY PRODUCERS: <span style={{ color: 'var(--text-dim)' }}>{mineralData.region}</span>
            </div>
          </>
        ) : (
          <div className="text-[10px] tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>
            ↑ TAP A COMPONENT OR ELEMENT TAG TO EXPLORE
          </div>
        )}
      </div>
    </div>
  )
}
