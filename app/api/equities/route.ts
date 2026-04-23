import { NextResponse } from 'next/server'
import YahooFinance from 'yahoo-finance2'

const yf = new YahooFinance()

const MINING_STOCKS = [
  { ticker: 'FCX',   name: 'Freeport-McMoRan',   minerals: 'Copper, Gold, Molybdenum',       relevance: 'Largest publicly traded copper producer. Direct AI infrastructure play.',                                      risk: 'Medium',   dot: '#b87333', category: 'stock' },
  { ticker: 'MP',    name: 'MP Materials',        minerals: 'Rare Earths (Nd, Dy, Pr)',       relevance: 'Only US rare earth miner/processor. Neodymium for data center fans/motors.',                                  risk: 'High',     dot: '#c060a0', category: 'stock' },
  { ticker: 'LAC',   name: 'Lithium Americas',    minerals: 'Lithium',                        relevance: 'Thacker Pass — largest known US lithium deposit. UPS battery supply.',                                         risk: 'High',     dot: '#a8c44c', category: 'stock' },
  { ticker: 'PLL',   name: 'Piedmont Lithium',    minerals: 'Lithium',                        relevance: 'Carolina lithium project. Domestic supply for battery backup systems.',                                        risk: 'Very High',dot: '#a8c44c', category: 'stock' },
  { ticker: 'IVN.TO', name: 'Ivanhoe Mines',       minerals: 'Copper, Zinc, Platinum',         relevance: "Kamoa-Kakula: one of world's highest-grade copper deposits.",                                                  risk: 'Medium',   dot: '#b87333', category: 'stock' },
  { ticker: 'WPM',   name: 'Wheaton Precious',    minerals: 'Silver, Gold, Palladium',        relevance: 'Streaming model — royalty on silver/palladium feeding semiconductor supply chains.',                          risk: 'Low-Med',  dot: '#a8a8b0', category: 'stock' },
  { ticker: 'SQM',   name: 'Sociedad Quimica',    minerals: 'Lithium, Iodine, Nitrates',      relevance: "World's largest lithium producer from Chile's Atacama.",                                                       risk: 'Medium',   dot: '#a8c44c', category: 'stock' },
  { ticker: 'TECK',  name: 'Teck Resources',      minerals: 'Copper, Zinc, Coal',             relevance: 'Major copper developer. QB2 expansion directly tied to AI copper demand.',                                    risk: 'Medium',   dot: '#b87333', category: 'stock' },
  { ticker: 'NEM',   name: 'Newmont Corp',        minerals: 'Gold, Silver, Copper',           relevance: "World's largest gold miner. Gold demand from AI connector plating growing.",                                  risk: 'Low-Med',  dot: '#c9a84c', category: 'stock' },
  { ticker: 'UUUU',  name: 'Energy Fuels',        minerals: 'Uranium, Rare Earths',           relevance: 'Uranium for AI data center nuclear power + rare earth recovery from uranium ore.',                            risk: 'High',     dot: '#c060a0', category: 'stock' },
]

const ETFS = [
  { ticker: 'COPX', name: 'Global X Copper Miners ETF',     holdings: 'FCX, IVN, FM, SCCO, HBM',  exp: '0.65%', category: 'etf', dot: '#b87333', desc: 'Pure-play copper miner exposure. Direct AI infrastructure demand play.' },
  { ticker: 'GDX',  name: 'VanEck Gold Miners ETF',         holdings: 'NEM, GOLD, AEM, WPM, KGC', exp: '0.51%', category: 'etf', dot: '#c9a84c', desc: 'Largest gold miner ETF. Benefits from AI connector demand + safe-haven flows.' },
  { ticker: 'SIL',  name: 'Global X Silver Miners ETF',     holdings: 'WPM, PAAS, SILV, MAG, HL', exp: '0.65%', category: 'etf', dot: '#a8a8b0', desc: 'Silver miner exposure. Dual demand from AI hardware + solar energy.' },
  { ticker: 'LIT',  name: 'Global X Lithium & Battery ETF', holdings: 'ALB, SQM, LTHM, PLL, LAC', exp: '0.75%', category: 'etf', dot: '#a8c44c', desc: 'Lithium miner + battery tech. AI data center UPS is new demand vertical.' },
  { ticker: 'REMX', name: 'VanEck Rare Earth ETF',          holdings: 'MP, LYNAS, ILUKA, NB, SGA',exp: '0.54%', category: 'etf', dot: '#c060a0', desc: 'Rare earth and critical mineral exposure. Highest geopolitical beta of any commodity ETF.' },
  { ticker: 'IAU',  name: 'iShares Gold Trust ETF',         holdings: 'Physical Gold Bullion',     exp: '0.25%', category: 'etf', dot: '#c9a84c', desc: 'Physical gold. Liquid cross-asset hedge for geopolitical mineral supply disruption.' },
]

const HYPERSCALERS = [
  { ticker: 'MSFT', name: 'Microsoft', category: 'hyperscaler', dot: '#4c8ec9' },
  { ticker: 'AMZN', name: 'Amazon',    category: 'hyperscaler', dot: '#c9a84c' },
  { ticker: 'GOOGL',name: 'Alphabet',  category: 'hyperscaler', dot: '#4caf78' },
  { ticker: 'META', name: 'Meta',      category: 'hyperscaler', dot: '#4c8ec9' },
  { ticker: 'NVDA', name: 'Nvidia',    category: 'hyperscaler', dot: '#c94c8e' },
]

async function fetchQuote(ticker: string) {
  try {
    const q = await yf.quote(ticker)
    const price = q.regularMarketPrice ?? 0
    const prevClose = q.regularMarketPreviousClose ?? price
    const chgAmt = price - prevClose
    const chgPct = prevClose > 0 ? (chgAmt / prevClose) * 100 : 0
    const mktCap = q.marketCap
      ? q.marketCap >= 1e12 ? `$${(q.marketCap / 1e12).toFixed(1)}T`
      : q.marketCap >= 1e9  ? `$${(q.marketCap / 1e9).toFixed(1)}B`
      : `$${(q.marketCap / 1e6).toFixed(0)}M`
      : 'N/A'
    return {
      ticker,
      price: parseFloat(price.toFixed(2)),
      chg: parseFloat(chgPct.toFixed(2)),
      chgAmt: parseFloat(chgAmt.toFixed(2)),
      mktCap,
      fiftyTwoWeekHigh: q.fiftyTwoWeekHigh ?? null,
      fiftyTwoWeekLow: q.fiftyTwoWeekLow ?? null,
      marketState: q.marketState ?? 'CLOSED',
      live: true,
    }
  } catch {
    return { ticker, price: null, chg: null, live: false }
  }
}

export async function GET() {
  try {
    const allTickers = [
      ...MINING_STOCKS.map(s => s.ticker),
      ...ETFS.map(e => e.ticker),
      ...HYPERSCALERS.map(h => h.ticker),
    ]

    const results = await Promise.allSettled(allTickers.map(fetchQuote))
    const quoteMap: Record<string, any> = {}
    results.forEach((r, i) => {
      if (r.status === 'fulfilled') quoteMap[allTickers[i]] = r.value
    })

    const enrich = (arr: any[]) => arr.map(item => ({ ...item, ...(quoteMap[item.ticker] ?? {}) }))

    return NextResponse.json({
      success: true,
      timestamp: Date.now(),
      data: {
        stocks: enrich(MINING_STOCKS),
        etfs: enrich(ETFS),
        hyperscalers: enrich(HYPERSCALERS),
      }
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' }
    })

  } catch (err) {
    console.error('Equities API error:', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch equity data' }, { status: 500 })
  }
}
