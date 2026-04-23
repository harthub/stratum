import { NextResponse } from 'next/server'
import YahooFinance from 'yahoo-finance2'

const yf = new YahooFinance()

// Yahoo Finance returns these units:
// GC=F  → $/troy oz
// SI=F  → $/troy oz (NOT cents — yahoo normalizes this)
// PA=F  → $/troy oz
// PL=F  → $/troy oz
// HG=F  → $/lb → multiply by 2204.62 to get $/metric ton
// ALI=F → $/metric ton

const COMMODITY_SYMBOLS: Record<string, { sym: string; name: string; unit: string; category: string; transform: (p: number) => number }> = {
  gold:      { sym: 'GC=F',  name: 'Gold',      unit: '/oz', category: 'precious',   transform: (p) => p },
  silver:    { sym: 'SI=F',  name: 'Silver',    unit: '/oz', category: 'precious',   transform: (p) => p },
  palladium: { sym: 'PA=F',  name: 'Palladium', unit: '/oz', category: 'precious',   transform: (p) => p },
  platinum:  { sym: 'PL=F',  name: 'Platinum',  unit: '/oz', category: 'precious',   transform: (p) => p },
  copper:    { sym: 'HG=F',  name: 'Copper',    unit: '/t',  category: 'industrial', transform: (p) => Math.round(p * 2204.62) },
  aluminum:  { sym: 'ALI=F', name: 'Aluminum',  unit: '/t',  category: 'industrial', transform: (p) => Math.round(p) },
}

const REFERENCE_INDUSTRIAL = [
  { name: 'Nickel', sym: 'NI', unit: '/t', price: 16800, chg: -4.2, category: 'industrial', note: 'Ref: LME Settlement' },
  { name: 'Tin',    sym: 'SN', unit: '/t', price: 31200, chg: 14.7, category: 'industrial', note: 'Ref: LME Settlement' },
]

const SPECIALTY_REFERENCE = [
  { name: 'Gallium',    sym: 'GA',  unit: '/kg', price: 220,   chg: 41.2,  category: 'specialty', note: 'Ref: Asian Metal / SMM' },
  { name: 'Germanium',  sym: 'GE',  unit: '/kg', price: 1400,  chg: 38.6,  category: 'specialty', note: 'Ref: Asian Metal / SMM' },
  { name: 'Neodymium',  sym: 'ND',  unit: '/kg', price: 68,    chg: 22.1,  category: 'specialty', note: 'Ref: Shanghai Metals Market' },
  { name: 'Dysprosium', sym: 'DY',  unit: '/kg', price: 280,   chg: 31.4,  category: 'specialty', note: 'Ref: Shanghai Metals Market' },
  { name: 'Cobalt',     sym: 'CO',  unit: '/t',  price: 33000, chg: -22.4, category: 'specialty', note: 'Ref: LME / Fastmarkets' },
  { name: 'Lithium',    sym: 'LI',  unit: '/t',  price: 14500, chg: -31.2, category: 'specialty', note: 'Ref: Fastmarkets / Benchmark' },
  { name: 'Tantalum',   sym: 'TA',  unit: '/kg', price: 152,   chg: 9.6,   category: 'specialty', note: 'Ref: Asian Metal' },
  { name: 'Fluorspar',  sym: 'CAF', unit: '/t',  price: 320,   chg: 18.8,  category: 'specialty', note: 'Ref: ICIS / CRU' },
]

function formatPrice(price: number, unit: string): string {
  if (unit === '/oz') return `$${price.toFixed(2)}`
  if (unit === '/t')  return `$${price.toLocaleString()}`
  if (unit === '/kg') return `$${price.toFixed(2)}`
  return `$${price}`
}

export async function GET() {
  try {
    const entries = Object.entries(COMMODITY_SYMBOLS)
    const quotes = await Promise.allSettled(
      entries.map(([, meta]) => yf.quote(meta.sym))
    )

    const live = entries.map(([key, meta], i) => {
      const result = quotes[i]
      if (result.status === 'fulfilled' && result.value) {
        const q = result.value
        const rawPrice = q.regularMarketPrice ?? 0
        const price = meta.transform(rawPrice)
        const prevPrice = meta.transform(q.regularMarketPreviousClose ?? rawPrice)
        const chgPct = prevPrice > 0 ? ((price - prevPrice) / prevPrice) * 100 : 0
        return {
          key,
          name: meta.name,
          sym: meta.sym,
          price: parseFloat(price.toFixed(meta.unit === '/oz' ? 2 : 0)),
          priceDisplay: formatPrice(price, meta.unit),
          unit: meta.unit,
          chg: parseFloat(chgPct.toFixed(2)),
          category: meta.category,
          marketState: q.marketState ?? 'CLOSED',
          live: true,
        }
      }
      return { key, name: meta.name, sym: meta.sym, price: null, unit: meta.unit, chg: null, category: meta.category, live: false }
    })

    const allIndustrial = [
      ...live.filter(m => m.category === 'industrial'),
      ...REFERENCE_INDUSTRIAL.map(m => ({ ...m, live: false, key: m.sym.toLowerCase() })),
    ]

    return NextResponse.json({
      success: true,
      timestamp: Date.now(),
      data: {
        live: [
          ...live.filter(m => m.category === 'precious'),
          ...allIndustrial,
        ],
        specialty: SPECIALTY_REFERENCE,
      }
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' }
    })

  } catch (err) {
    console.error('Metals API error:', err)
    return NextResponse.json({
      success: true,
      timestamp: Date.now(),
      data: { live: [], specialty: SPECIALTY_REFERENCE }
    })
  }
}
