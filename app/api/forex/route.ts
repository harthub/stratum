import { NextResponse } from 'next/server'

// Fallback rates if API fails (recent approximate values)
const FALLBACK: Record<string, number> = {
  'AUD/USD': 0.7153,
  'USD/CLP': 893.0,
  'USD/ZAR': 16.47,
  'USD/PEN': 3.72,
}

const FX_PAIRS = [
  { pair: 'AUD/USD', from: 'AUD', to: 'USD', commodity: 'Copper · Gold', country: 'Australia', bg: 'AUD', desc: "Australia is the world's 2nd largest copper exporter and top gold producer. AUD strengthens when copper and gold prices rise on AI demand." },
  { pair: 'USD/CLP', from: 'USD', to: 'CLP', commodity: 'Copper', country: 'Chile', bg: 'CLP', desc: "Chile produces ~27% of global copper. USD/CLP falls (CLP strengthens) as copper prices rise with AI data center demand." },
  { pair: 'USD/ZAR', from: 'USD', to: 'ZAR', commodity: 'Gold · Palladium · Platinum', country: 'South Africa', bg: 'ZAR', desc: "South Africa dominates PGM supply (40% of palladium, ~70% of platinum) and is a top gold producer. ZAR sensitive to all three." },
  { pair: 'USD/PEN', from: 'USD', to: 'PEN', commodity: 'Copper · Silver · Zinc', country: 'Peru', bg: 'PEN', desc: "Peru is the world's 2nd largest silver producer and 3rd in copper. PEN correlates with both as AI demand hits silver and copper simultaneously." },
]

async function fetchRate(from: string, to: string): Promise<number | null> {
  // Try Frankfurter first (ECB-backed, reliable for major currencies)
  try {
    const res = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`, { signal: AbortSignal.timeout(4000) })
    if (res.ok) {
      const data = await res.json()
      const rate = data.rates?.[to]
      if (rate) return rate
    }
  } catch {}

  // Fallback: try open.er-api.com (free, no key, covers emerging markets)
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`, { signal: AbortSignal.timeout(4000) })
    if (res.ok) {
      const data = await res.json()
      const rate = data.rates?.[to]
      if (rate) return rate
    }
  } catch {}

  return null
}

export async function GET() {
  try {
    const results = await Promise.allSettled(
      FX_PAIRS.map(fx => fetchRate(fx.from, fx.to))
    )

    const pairs = FX_PAIRS.map((fx, i) => {
      const result = results[i]
      const rate = result.status === 'fulfilled' && result.value
        ? result.value
        : FALLBACK[fx.pair] ?? null

      const live = result.status === 'fulfilled' && !!result.value

      const formatted = rate === null ? '—'
        : rate < 10 ? rate.toFixed(4)
        : rate < 1000 ? rate.toFixed(2)
        : rate.toFixed(0)

      return { ...fx, rate: rate ? parseFloat(formatted) : null, rateDisplay: formatted, chg: 0, live }
    })

    return NextResponse.json({ success: true, timestamp: Date.now(), data: pairs }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }
    })

  } catch (err) {
    console.error('Forex API error:', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
