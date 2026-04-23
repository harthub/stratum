import { NextResponse } from 'next/server'

const API_KEY = process.env.EXCHANGE_RATE_API_KEY
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`

const FX_PAIRS = [
  {
    pair: 'AUD/USD',
    base: 'AUD',
    quote: 'USD',
    commodity: 'Copper · Gold',
    country: 'Australia',
    desc: "Australia is the world's 2nd largest copper exporter and top gold producer. AUD strengthens when copper and gold prices rise on AI demand.",
    bg: 'AUD',
  },
  {
    pair: 'USD/CLP',
    base: 'USD',
    quote: 'CLP',
    commodity: 'Copper',
    country: 'Chile',
    desc: "Chile produces ~27% of global copper. USD/CLP falls (CLP strengthens) as copper prices rise with AI data center demand.",
    bg: 'CLP',
  },
  {
    pair: 'USD/ZAR',
    base: 'USD',
    quote: 'ZAR',
    commodity: 'Gold · Palladium · Platinum',
    country: 'South Africa',
    desc: "South Africa dominates PGM supply (40% of palladium, ~70% of platinum) and is a top gold producer. ZAR sensitive to all three.",
    bg: 'ZAR',
  },
  {
    pair: 'USD/PEN',
    base: 'USD',
    quote: 'PEN',
    commodity: 'Copper · Silver · Zinc',
    country: 'Peru',
    desc: "Peru is the world's 2nd largest silver producer and 3rd in copper. PEN correlates with both as AI demand hits silver and copper simultaneously.",
    bg: 'PEN',
  },
]

export async function GET() {
  try {
    // Fetch USD base rates (covers all our pairs)
    const res = await fetch(`${BASE_URL}/latest/USD`, {
      next: { revalidate: 300 }, // cache 5 min
    })

    if (!res.ok) throw new Error(`ExchangeRate-API error: ${res.status}`)
    const data = await res.json()

    if (data.result !== 'success') throw new Error('ExchangeRate-API returned failure')

    const rates = data.conversion_rates

    const pairs = FX_PAIRS.map(fx => {
      let rate: number

      if (fx.base === 'USD') {
        // USD/XXX — rate is direct
        rate = rates[fx.quote]
      } else {
        // XXX/USD — invert the USD/XXX rate
        rate = 1 / rates[fx.base]
      }

      // Format the rate display
      const formatted = rate < 10
        ? rate.toFixed(4)
        : rate < 1000
          ? rate.toFixed(2)
          : rate.toFixed(0)

      return {
        ...fx,
        rate: parseFloat(formatted),
        rateDisplay: formatted,
        timestamp: data.time_last_update_unix * 1000,
        live: true,
      }
    })

    return NextResponse.json({
      success: true,
      timestamp: Date.now(),
      data: pairs,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      }
    })

  } catch (err) {
    console.error('Forex API error:', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch forex data' }, { status: 500 })
  }
}
