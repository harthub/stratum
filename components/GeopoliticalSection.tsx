'use client'

import { useState } from 'react'

const CHINA_MATRIX = [
  { mineral: 'Gallium',    sym: 'Ga', mine: 98,  refine: 98,  level: 'total',    color: '#c94c8e', note: 'Export restrictions enacted 2023. ~98% global primary production.' },
  { mineral: 'Dysprosium', sym: 'Dy', mine: 99,  refine: 99,  level: 'total',    color: '#a060c0', note: 'Near-total monopoly on heavy rare earth mining AND processing. No substitutes.' },
  { mineral: 'Fluorspar',  sym: 'F',  mine: 62,  refine: 78,  level: 'total',    color: '#c0c060', note: 'Dominates both mine output and HF acid production. 100% US import reliance.' },
  { mineral: 'Germanium',  sym: 'Ge', mine: 60,  refine: 95,  level: 'total',    color: '#c9844c', note: 'Export controls July 2023. Refining dominance far exceeds mining share.' },
  { mineral: 'Neodymium',  sym: 'Nd', mine: 85,  refine: 92,  level: 'total',    color: '#c060a0', note: 'Dominates full rare earth supply chain from mine to magnet manufacturing.' },
  { mineral: 'Arsenic',    sym: 'As', mine: 72,  refine: 80,  level: 'total',    color: '#c07060', note: '100% US import dependent. GaAs chip supply entirely China-origin.' },
  { mineral: 'Indium',     sym: 'In', mine: 58,  refine: 75,  level: 'choke',    color: '#70a080', note: 'Byproduct of zinc; refining concentrated in China even when zinc mined elsewhere.' },
  { mineral: 'Tin',        sym: 'Sn', mine: 31,  refine: 68,  level: 'choke',    color: '#a09070', note: 'Smelting/refining dominance creates chokepoint despite diverse mine production.' },
  { mineral: 'Cobalt',     sym: 'Co', mine: 2,   refine: 72,  level: 'choke',    color: '#4cc9b8', note: 'DRC mines 70%+ but China refines 72% of global cobalt. Classic choke pattern.' },
  { mineral: 'Lithium',    sym: 'Li', mine: 24,  refine: 65,  level: 'choke',    color: '#a8c44c', note: 'Australia & Chile mine it; China processes most into battery-grade material.' },
  { mineral: 'Silicon',    sym: 'Si', mine: 68,  refine: 68,  level: 'elevated', color: '#4c8ec9', note: 'Dominant in metallurgical silicon. Semiconductor-grade production more diversified.' },
  { mineral: 'Aluminum',   sym: 'Al', mine: 55,  refine: 57,  level: 'elevated', color: '#909098', note: 'Largest global producer but meaningful capacity in Russia, Canada, Australia.' },
  { mineral: 'Copper',     sym: 'Cu', mine: 8,   refine: 42,  level: 'elevated', color: '#b87333', note: 'Mining diversified (Chile dominant). Refining elevated but not monopoly.' },
  { mineral: 'Silver',     sym: 'Ag', mine: 14,  refine: 18,  level: 'low',      color: '#a8a8b0', note: 'Mexico & Peru lead mining. Refining relatively diversified globally.' },
  { mineral: 'Gold',       sym: 'Au', mine: 11,  refine: 8,   level: 'low',      color: '#c9a84c', note: 'Most geopolitically diversified. Multiple major allied producers.' },
  { mineral: 'Palladium',  sym: 'Pd', mine: 4,   refine: 5,   level: 'other',    color: '#b8a0d0', note: 'Russia (40%) and South Africa (38%) dominate. Different geopolitical risk vector.' },
]

const PRODUCERS = [
  { mineral: 'Copper',    color: '#b87333', countries: [{ name:'Chile',flag:'🇨🇱',pct:27},{name:'Peru',flag:'🇵🇪',pct:12},{name:'DRC',flag:'🇨🇩',pct:11},{name:'China',flag:'🇨🇳',pct:8},{name:'USA',flag:'🇺🇸',pct:6},{name:'Australia',flag:'🇦🇺',pct:5},{name:'Zambia',flag:'🇿🇲',pct:4}] },
  { mineral: 'Gold',      color: '#c9a84c', countries: [{ name:'China',flag:'🇨🇳',pct:11},{name:'Australia',flag:'🇦🇺',pct:10},{name:'Russia',flag:'🇷🇺',pct:9},{name:'Canada',flag:'🇨🇦',pct:7},{name:'USA',flag:'🇺🇸',pct:6},{name:'Ghana',flag:'🇬🇭',pct:5},{name:'S. Africa',flag:'🇿🇦',pct:4}] },
  { mineral: 'Silver',    color: '#a8a8b0', countries: [{ name:'Mexico',flag:'🇲🇽',pct:23},{name:'China',flag:'🇨🇳',pct:14},{name:'Peru',flag:'🇵🇪',pct:13},{name:'Chile',flag:'🇨🇱',pct:6},{name:'Russia',flag:'🇷🇺',pct:6},{name:'Australia',flag:'🇦🇺',pct:5}] },
  { mineral: 'Palladium', color: '#b8a0d0', countries: [{ name:'Russia',flag:'🇷🇺',pct:40},{name:'S. Africa',flag:'🇿🇦',pct:38},{name:'Canada',flag:'🇨🇦',pct:10},{name:'Zimbabwe',flag:'🇿🇼',pct:5},{name:'USA',flag:'🇺🇸',pct:4}] },
  { mineral: 'Lithium',   color: '#a8c44c', countries: [{ name:'Australia',flag:'🇦🇺',pct:47},{name:'Chile',flag:'🇨🇱',pct:26},{name:'China',flag:'🇨🇳',pct:14},{name:'Argentina',flag:'🇦🇷',pct:8},{name:'Brazil',flag:'🇧🇷',pct:3}] },
  { mineral: 'Cobalt',    color: '#4cc9b8', countries: [{ name:'DRC',flag:'🇨🇩',pct:73},{name:'Russia',flag:'🇷🇺',pct:4},{name:'Australia',flag:'🇦🇺',pct:4},{name:'Philippines',flag:'🇵🇭',pct:3}] },
  { mineral: 'Gallium',   color: '#c94c8e', countries: [{ name:'China',flag:'🇨🇳',pct:98},{name:'Russia',flag:'🇷🇺',pct:1},{name:'S. Korea',flag:'🇰🇷',pct:1}] },
  { mineral: 'Germanium', color: '#c9844c', countries: [{ name:'China',flag:'🇨🇳',pct:60},{name:'Russia',flag:'🇷🇺',pct:8},{name:'Canada',flag:'🇨🇦',pct:6},{name:'USA',flag:'🇺🇸',pct:5},{name:'Belgium',flag:'🇧🇪',pct:5}] },
  { mineral: 'Neodymium', color: '#c060a0', countries: [{ name:'China',flag:'🇨🇳',pct:85},{name:'Australia',flag:'🇦🇺',pct:8},{name:'Myanmar',flag:'🇲🇲',pct:4},{name:'USA',flag:'🇺🇸',pct:2}] },
  { mineral: 'Tantalum',  color: '#8e4cc9', countries: [{ name:'DRC',flag:'🇨🇩',pct:40},{name:'Rwanda',flag:'🇷🇼',pct:20},{name:'Brazil',flag:'🇧🇷',pct:12},{name:'Nigeria',flag:'🇳🇬',pct:8},{name:'Australia',flag:'🇦🇺',pct:7}] },
]

const IMPORT_DEPENDENCY = [
  { mineral:'Gallium',   pct:100, color:'#c94c8e' },
  { mineral:'Arsenic',   pct:100, color:'#c07060' },
  { mineral:'Fluorspar', pct:100, color:'#c0c060' },
  { mineral:'Germanium', pct:100, color:'#c9844c' },
  { mineral:'Indium',    pct:100, color:'#70a080' },
  { mineral:'Tantalum',  pct:100, color:'#8e4cc9' },
  { mineral:'Cobalt',    pct:72,  color:'#4cc9b8' },
  { mineral:'Tin',       pct:73,  color:'#a09070' },
  { mineral:'Neodymium', pct:80,  color:'#c060a0' },
  { mineral:'Silver',    pct:64,  color:'#a8a8b0' },
  { mineral:'Copper',    pct:45,  color:'#b87333' },
  { mineral:'Aluminum',  pct:47,  color:'#909098' },
  { mineral:'Lithium',   pct:50,  color:'#a8c44c' },
  { mineral:'Palladium', pct:36,  color:'#b8a0d0' },
  { mineral:'Gold',      pct:0,   color:'#c9a84c' },
]

const NATIONS = [
  { name:'China',      flag:'🇨🇳', minerals:['Ga','Ge','Si','Al','Nd','Dy','In','Fl','As','Sn'], role:"Dominant refiner across virtually all critical mineral supply chains. Export controls on Ga, Ge enacted 2023.", color:'#c94c4c' },
  { name:'Chile',      flag:'🇨🇱', minerals:['Cu','Li','Ag','Mo'], role:"World's largest copper producer (~27%). Atacama lithium triangle. CLP = commodity FX play.", color:'#b87333' },
  { name:'Australia',  flag:'🇦🇺', minerals:['Li','Au','Cu','Ni','Co','Al','Nd'], role:"Top lithium exporter. Major gold and copper producer. Stable jurisdiction. AUD is primary commodity FX indicator.", color:'#c9a84c' },
  { name:'DRC',        flag:'🇨🇩', minerals:['Co','Cu','Ta','Ge'], role:"70%+ of global cobalt. Major copper producer. Critical for UPS battery and PCB supply chains. High governance risk.", color:'#4cc9b8' },
  { name:'Russia',     flag:'🇷🇺', minerals:['Pd','Ni','Co','Au','Ge','Al'], role:"40% of global palladium. Major nickel and cobalt. Sanctions significantly disrupted Western access post-2022.", color:'#b8a0d0' },
  { name:'S. Africa',  flag:'🇿🇦', minerals:['Pd','Pt','Au','Mn','Cr'], role:"38% of palladium, ~70% of platinum. Major gold producer. ZAR is the PGM forex proxy.", color:'#d0c8b8' },
  { name:'Peru',       flag:'🇵🇪', minerals:['Cu','Ag','Zn','Au','In'], role:"2nd largest silver producer, 3rd copper. PEN is dual commodity FX play. Political instability creates supply risk.", color:'#a8a8b0' },
  { name:'USA',        flag:'🇺🇸', minerals:['Au','Cu','Li','Mo','Be'], role:"Net importer of most critical minerals. CHIPS Act + DoD targeting domestic supply chain buildout.", color:'#4c8ec9' },
  { name:'Canada',     flag:'🇨🇦', minerals:['Ni','Co','Au','Cu','Ge','Pd'], role:"Stable allied jurisdiction. Cobalt, nickel, and palladium from Sudbury basin. Strategic US supply chain partner.", color:'#4caf78' },
  { name:'Indonesia',  flag:'🇮🇩', minerals:['Ni','Co','Sn','Cu'], role:"World's largest nickel producer (50%+). Key for NMC battery cathode supply for data center UPS systems.", color:'#c98c4c' },
]

const LEVEL_CONFIG = {
  total:    { color: '#c94c4c', label: 'TOTAL LOCK' },
  choke:    { color: '#c98c4c', label: 'REFINING CHOKE' },
  elevated: { color: '#c9a84c', label: 'ELEVATED' },
  low:      { color: '#4a4642', label: 'LOW' },
  other:    { color: '#4a4642', label: 'OTHER RISK' },
}

export default function GeopoliticalSection() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null)

  const toggleAccordion = (i: number) => {
    setOpenAccordion(openAccordion === i ? null : i)
  }

  return (
    <section id="geopolitical" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="section-header">
        <span className="section-num">05</span>
        <h2 className="section-title">GEOPOLITICAL <span>RISK</span></h2>
      </div>

      {/* Intro */}
      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', borderBottom: '1px solid var(--border)' }}>
        <div style={{ padding: '32px 48px', borderRight: '1px solid var(--border)' }}>
          <p className="text-[12px] font-sans font-light leading-[1.9] max-w-[680px]" style={{ color: 'var(--text-dim)' }}>
            The AI hardware supply chain has a single point of failure: <strong style={{ color: 'var(--text)' }}>China controls the refining chokepoint for most critical minerals, regardless of where they're mined.</strong> Mining % and refining % are two completely different numbers — and refining is where the real leverage sits. The matrix below shows both side by side. The gap between them is where geopolitical risk lives.
          </p>
        </div>
        <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(['total','choke','elevated'] as const).map(level => {
            const cfg = LEVEL_CONFIG[level]
            return (
              <div key={level} style={{ padding: 14, background: `${cfg.color}10`, border: `1px solid ${cfg.color}30` }}>
                <div className="text-[8px] tracking-[0.2em] uppercase mb-1" style={{ color: cfg.color }}>{cfg.label}</div>
                <div className="text-[10px] font-sans leading-[1.6]" style={{ color: 'var(--text-dim)' }}>
                  {level === 'total' && 'China controls mining AND refining. No viable alternative supply chain exists.'}
                  {level === 'choke' && 'Mined elsewhere but refined in China. West can mine it; can\'t process it without China.'}
                  {level === 'elevated' && 'Significant China presence but meaningful alternative supply exists.'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* China Control Matrix */}
      <div style={{ padding: '0 48px', borderBottom: '1px solid var(--border)' }}>
        <div className="flex justify-between items-center py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)' }}>— China Control Matrix: Mining % vs. Refining %</span>
          <span className="text-[8px]" style={{ color: 'var(--text-muted)' }}>Source: USGS, IEA, FP Analytics 2025</span>
        </div>
        <div className="flex flex-col gap-2 pb-8 pt-2">
          {CHINA_MATRIX.map(m => {
            const cfg = LEVEL_CONFIG[m.level as keyof typeof LEVEL_CONFIG]
            return (
              <div key={m.mineral} className="grid items-center gap-3" style={{ gridTemplateColumns: '120px 1fr 1fr 110px 1fr' }}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: m.color }} />
                  <span className="text-[10px]">{m.mineral}</span>
                  <span className="text-[8px]" style={{ color: 'var(--text-muted)' }}>{m.sym}</span>
                </div>
                {/* Mining bar */}
                <div>
                  <div className="text-[7px] tracking-[0.15em] uppercase mb-1" style={{ color: 'var(--text-muted)' }}>MINING</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-[3px] relative" style={{ background: 'var(--border)' }}>
                      <div className="absolute left-0 top-0 h-full" style={{ width: `${m.mine}%`, background: m.color, opacity: 0.7 }} />
                    </div>
                    <span className="font-mono text-[10px] w-8 text-right" style={{ color: m.color }}>{m.mine}%</span>
                  </div>
                </div>
                {/* Refining bar */}
                <div>
                  <div className="text-[7px] tracking-[0.15em] uppercase mb-1" style={{ color: 'var(--text-muted)' }}>REFINING</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-[3px] relative" style={{ background: 'var(--border)' }}>
                      <div className="absolute left-0 top-0 h-full" style={{ width: `${m.refine}%`, background: cfg.color }} />
                    </div>
                    <span className="font-mono text-[10px] w-8 text-right" style={{ color: cfg.color }}>{m.refine}%</span>
                  </div>
                </div>
                {/* Level badge */}
                <div className="text-center">
                  <span className="text-[7px] tracking-[0.08em] px-2 py-[3px]" style={{ border: `1px solid ${cfg.color}`, color: cfg.color }}>
                    {cfg.label}
                  </span>
                </div>
                {/* Note */}
                <div className="text-[9px] font-sans leading-[1.5]" style={{ color: 'var(--text-muted)' }}>{m.note}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Producer breakdown + Import dependency */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border)' }}>
        {/* Accordion */}
        <div style={{ borderRight: '1px solid var(--border)' }}>
          <div className="px-9 py-5 text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
            — Top Producer Nations by Mineral <span className="ml-2 text-[8px] normal-case" style={{ color: 'var(--text-muted)' }}>(click to expand)</span>
          </div>
          <div style={{ padding: '0 36px' }}>
            {PRODUCERS.map((p, i) => (
              <div key={p.mineral} style={{ borderBottom: '1px solid var(--border)' }}>
                <div
                  onClick={() => toggleAccordion(i)}
                  className="flex justify-between items-center py-3 cursor-crosshair"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-[6px] h-[6px] rounded-full" style={{ background: p.color }} />
                    <span className="text-[10px]">{p.mineral}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px]" style={{ color: 'var(--text-muted)' }}>{p.countries.length} producers</span>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{openAccordion === i ? '−' : '+'}</span>
                  </div>
                </div>
                {openAccordion === i && (
                  <div style={{ paddingBottom: 12 }}>
                    {p.countries.map(c => (
                      <div key={c.name} className="flex items-center gap-2 mb-[6px]">
                        <span style={{ fontSize: 14 }}>{c.flag}</span>
                        <span className="text-[9px] w-20" style={{ color: 'var(--text-dim)' }}>{c.name}</span>
                        <div className="flex-1 h-[3px] relative" style={{ background: 'var(--border)' }}>
                          <div className="absolute left-0 top-0 h-full" style={{ width: `${Math.min(c.pct, 100)}%`, background: p.color, opacity: c.name === 'China' ? 1 : 0.5 }} />
                        </div>
                        <span className="font-mono text-[9px] w-8 text-right" style={{ color: c.name === 'China' ? p.color : 'var(--text-muted)' }}>{c.pct}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Import Dependency */}
        <div>
          <div className="px-9 py-5 text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
            — U.S. Import Dependency (USGS 2025)
          </div>
          <div style={{ padding: '24px 36px' }}>
            <p className="text-[10px] font-sans leading-[1.8] mb-5" style={{ color: 'var(--text-muted)' }}>
              % of U.S. consumption that must be imported. 100% = zero domestic production.
            </p>
            <div className="flex flex-col gap-[10px] mb-5">
              {[...IMPORT_DEPENDENCY].sort((a,b) => b.pct - a.pct).map(m => {
                const barColor = m.pct === 100 ? 'var(--red)' : m.pct > 60 ? '#c98c4c' : m.pct > 30 ? 'var(--gold)' : 'var(--green)'
                return (
                  <div key={m.mineral} className="flex items-center gap-3">
                    <span className="text-[9px] w-20" style={{ color: 'var(--text-dim)' }}>{m.mineral}</span>
                    <div className="flex-1 h-[3px] relative" style={{ background: 'var(--border)' }}>
                      <div className="absolute left-0 top-0 h-full transition-all" style={{ width: `${m.pct}%`, background: barColor }} />
                    </div>
                    <span className="font-mono text-[9px] w-8 text-right" style={{ color: barColor }}>{m.pct}%</span>
                  </div>
                )
              })}
            </div>
            <div style={{ padding: 14, background: 'rgba(201,76,76,0.06)', border: '1px solid rgba(201,76,76,0.15)' }}>
              <div className="text-[8px] tracking-[0.15em] uppercase mb-1" style={{ color: 'var(--red)' }}>100% IMPORT DEPENDENT</div>
              <div className="text-[10px] font-sans leading-[1.7]" style={{ color: 'var(--text-dim)' }}>
                Arsenic · Fluorspar · Gallium · Germanium · Indium · Tantalum · Rare Earth Metals (heavy)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nation Scorecard */}
      <div>
        <div className="px-12 py-5 text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
          — Nation Supply Chain Scorecard: Top 10 Producer Countries
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(5,1fr)', background: 'var(--border)', gap: 1 }}>
          {NATIONS.map(n => (
            <div key={n.name} className="relative overflow-hidden" style={{ background: 'var(--bg)', padding: '22px 20px' }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{n.flag}</div>
              <div className="font-display text-[18px] tracking-[0.04em] mb-2">{n.name}</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {n.minerals.map(min => (
                  <span key={min} className="text-[7px] tracking-[0.1em] px-[5px] py-[2px]" style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>{min}</span>
                ))}
              </div>
              <p className="text-[9px] font-sans leading-[1.6]" style={{ color: 'var(--text-muted)' }}>{n.role}</p>
              <div className="absolute pointer-events-none select-none font-display" style={{ bottom: -4, right: 4, fontSize: 52, color: 'rgba(255,255,255,0.015)', lineHeight: 1 }}>{n.flag}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
