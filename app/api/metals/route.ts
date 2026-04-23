import { NextResponse } from 'next/server'
import YahooFinance from 'yahoo-finance2'

const yf = new YahooFinance()

// All Yahoo Finance futures return price per unit as listed on their exchange
// GC=F  → $/troy oz  (multiply by 1)
// SI=F  → cents/troy oz on COMEX (divide by 100 to get $/oz)  ← key fix
// PA=F  → $/troy oz
// PL=F  → $/troy oz
// HG=F  → cents/lb on COMEX → multiply by 22.0462 to get $/t
// ALI=F → $/metric ton (directly, no conversion)
// NI=F  → $/metric ton on LME (no conversion needed if available)
// TIN=F → doesn't exist on Yahoo, use reference

const COMMODITY_SYMBOLS = {
  gold:      { sym: 'GC=F', name: 'Gold',      unit: '/oz', category: 'precious',   transform: (p: number) => p },
  silver:    { sym: 'SI=F', name: 'Silver',    unit: '/oz', category: 'precious',   transform: (p: number) => p / 100 }, // COMEX SI is cents/oz
  palladium: { sym: 'PA=F', name: 'Palladium', unit: '/oz', category: 'precious',   transform: (p: number) => p },
  platinum:  { sym: 'PL=F', name: 'Platinum',  unit: '/oz', category: 'precious',   transform: (p: number) => p },
  copper:    { sym: 'HG=F', name: 'Copper',    unit: '/t',  category: 'industrial', transform: (p: number) => Math.round(p * 22.0462) }, // cents/lb → $/t
  aluminum:  { sym: 'ALI=F',name: 'Aluminum',  unit: '/t',  category: 'industrial', transform: (p: number) => Math.round(p) }, // already $/t
}

// These don't have reliable Yahoo Finance futures — use LME reference prices
const REFERENCE_INDUSTRIAL = [
  { name: 'Nickel', sym: 'NI', unit: '/t',  price: 16800, chg: -4.2,  category: 'industrial', note: 'Ref: LME Settlement' },
  { name: 'Tin',    sym: 'SN', unit: '/t',  price: 31200, chg: 14.7,  category: 'industrial', note: 'Ref: LME Settlement' },
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
      return {
        key, name: meta.name, sym: meta.sym,
        price: null, unit: meta.unit, chg: null,
        category: meta.category, live: false,
      }
    })

    // Merge live + reference industrial
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
      success: true, // still return 200 with reference data so UI doesn't break
      timestamp: Date.now(),
      data: { live: [], specialty: SPECIALTY_REFERENCE }
    })
  }
}
