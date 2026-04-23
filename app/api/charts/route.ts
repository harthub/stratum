import { NextResponse } from 'next/server'
import YahooFinance from 'yahoo-finance2'

const yf = new YahooFinance()

const EQUITY_SYMBOLS = [
  { sym: 'FCX',  label: 'FCX (Copper)',     color: '#b87333' },
  { sym: 'COPX', label: 'COPX ETF',         color: '#c98c4c', dash: true },
  { sym: 'MP',   label: 'MP (Rare Earth)',  color: '#c060a0' },
  { sym: 'REMX', label: 'REMX ETF',         color: '#a060c0', dash: true },
  { sym: 'WPM',  label: 'WPM (Silver/PGM)', color: '#a8a8b0' },
  { sym: 'SPY',  label: 'S&P 500 (ref)',    color: '#3d3d3d', dash: true },
]

const COMMODITY_SYMBOLS = [
  { sym: 'GC=F', label: 'Gold ($/oz)',   color: '#c9a84c', mult: 1 },
  { sym: 'HG=F', label: 'Copper ($/t)',  color: '#b87333', mult: 2204.62 },
]

function indexToBase100(prices: number[]): number[] {
  if (!prices.length || prices[0] === 0) return prices
  const base = prices[0]
  return prices.map(p => parseFloat(((p / base) * 100).toFixed(2)))
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') ?? 'equity'

  try {
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    const symbols = type === 'equity' ? EQUITY_SYMBOLS : COMMODITY_SYMBOLS

    const results = await Promise.allSettled(
      symbols.map(s =>
        yf.historical(s.sym, { period1: oneYearAgo, interval: '1wk' })
      )
    )

    const datasets = symbols.map((meta, i) => {
      const result = results[i]
      if (result.status === 'fulfilled' && result.value.length > 0) {
        const closes = result.value.map((d: any) => d.close ?? 0)
        const labels = result.value.map((d: any) =>
          new Date(d.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
        )
        const data = type === 'equity'
          ? indexToBase100(closes)
          : closes.map((c: number) => parseFloat(((meta as any).mult ? c * (meta as any).mult : c).toFixed(0)))
        return { ...meta, labels, data, live: true }
      }
      return { ...meta, labels: [], data: [], live: false }
    })

    const labels = datasets.reduce((best, d) =>
      d.labels.length > best.length ? d.labels : best, [] as string[]
    )

    return NextResponse.json({
      success: true,
      timestamp: Date.now(),
      data: { labels, datasets }
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' }
    })

  } catch (err) {
    console.error('Charts API error:', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch chart data' }, { status: 500 })
  }
}
