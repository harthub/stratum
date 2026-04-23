import { NextResponse } from 'next/server'

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

export async function GET() {
  try {
    // Frankfurter is a free, no-auth-required ECB exchange rate API
    const symbols = 'AUD,CLP,ZAR,PEN'
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=USD&to=${symbols}`,
      { next: { revalidate: 300 } }
    )

    if (!res.ok) throw new Error(`Frankfurter error: ${res.status}`)
    const data = await res.json()
    const rates = data.rates // { AUD: x, CLP: x, ZAR: x, PEN: x }

    const pairs = FX_PAIRS.map(fx => {
      let rate: number

      if (fx.from === 'USD') {
        rate = rates[fx.to]
      } else {
        // AUD/USD = 1 / (USD/AUD rate)
        rate = 1 / rates[fx.from]
      }

      const formatted = rate < 10
        ? rate.toFixed(4)
        : rate < 1000
          ? rate.toFixed(2)
          : rate.toFixed(0)

      return {
        ...fx,
        rate: parseFloat(formatted),
        rateDisplay: formatted,
        chg: 0, // Frankfurter doesn't provide change %, keep at 0
        timestamp: Date.now(),
        live: true,
      }
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
