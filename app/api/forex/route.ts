import { NextResponse } from 'next/server'

// Frankfurter uses EUR as base — we fetch each pair individually
const FX_PAIRS = [
  {
    pair: 'AUD/USD', from: 'AUD', to: 'USD',
    commodity: 'Copper · Gold', country: 'Australia', bg: 'AUD',
    desc: "Australia is the world's 2nd largest copper exporter and top gold producer. AUD strengthens when copper and gold prices rise on AI demand.",
  },
  {
    pair: 'USD/CLP', from: 'USD', to: 'CLP',
    commodity: 'Copper', country: 'Chile', bg: 'CLP',
    desc: "Chile produces ~27% of global copper. USD/CLP falls (CLP strengthens) as copper prices rise with AI data center demand.",
  },
  {
    pair: 'USD/ZAR', from: 'USD', to: 'ZAR',
    commodity: 'Gold · Palladium · Platinum', country: 'South Africa', bg: 'ZAR',
    desc: "South Africa dominates PGM supply (40% of palladium, ~70% of platinum) and is a top gold producer. ZAR sensitive to all three.",
  },
  {
    pair: 'USD/PEN', from: 'USD', to: 'PEN',
    commodity: 'Copper · Silver · Zinc', country: 'Peru', bg: 'PEN',
    desc: "Peru is the world's 2nd largest silver producer and 3rd in copper. PEN correlates with both as AI demand hits silver and copper simultaneously.",
  },
]

async function fetchRate(from: string, to: string): Promise<number> {
  const res = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`)
  if (!res.ok) throw new Error(`Frankfurter ${from}/${to} failed: ${res.status}`)
  const data = await res.json()
  const rate = data.rates?.[to]
  if (!rate) throw new Error(`No rate found for ${from}/${to}`)
  return rate
}

export async function GET() {
  try {
    const results = await Promise.allSettled(
      FX_PAIRS.map(fx => fetchRate(fx.from, fx.to))
    )

    const pairs = FX_PAIRS.map((fx, i) => {
      const result = results[i]
      if (result.status === 'fulfilled') {
        const rate = result.value
        const formatted = rate < 10
          ? rate.toFixed(4)
          : rate < 1000
            ? rate.toFixed(2)
            : rate.toFixed(0)
        return { ...fx, rate: parseFloat(formatted), rateDisplay: formatted, chg: 0, live: true }
      }
      return { ...fx, rate: null, rateDisplay: '—', chg: 0, live: false }
    })

    return NextResponse.json({
      success: true,
      timestamp: Date.now(),
      data: pairs,
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }
    })

  } catch (err) {
    console.error('Forex API error:', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
