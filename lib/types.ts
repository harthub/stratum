// ─── TYPES ───────────────────────────────────────────────

export interface MetalQuote {
  key: string
  name: string
  sym: string
  price: number | null
  unit: string
  chg: number | null
  category: 'precious' | 'industrial' | 'specialty'
  live: boolean
  marketState?: string
  timestamp?: number
  note?: string
}

export interface ForexPair {
  pair: string
  base: string
  quote: string
  rate: number
  rateDisplay: string
  commodity: string
  country: string
  desc: string
  bg: string
  live: boolean
  timestamp?: number
}

export interface EquityQuote {
  ticker: string
  name: string
  price: number | null
  chg: number | null
  chgAmt?: number | null
  mktCap?: string
  minerals?: string
  relevance?: string
  risk?: string
  dot: string
  category: 'stock' | 'etf' | 'hyperscaler'
  live: boolean
  holdings?: string
  exp?: string
  desc?: string
  marketState?: string
  fiftyTwoWeekHigh?: number
  fiftyTwoWeekLow?: number
}

export interface ChartDataset {
  sym: string
  label: string
  color: string
  dash?: boolean
  data: number[]
  labels: string[]
  live: boolean
}

// ─── FORMATTERS ──────────────────────────────────────────

export function formatPrice(price: number | null, unit: string): string {
  if (price === null) return '—'
  if (unit === '/oz') return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  if (unit === '/t') return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  if (unit === '/kg') return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  return `$${price.toLocaleString()}`
}

export function formatChg(chg: number | null): string {
  if (chg === null) return '—'
  return `${chg >= 0 ? '+' : ''}${chg.toFixed(2)}%`
}

export function formatStockPrice(price: number | null): string {
  if (price === null) return '—'
  return `$${price.toFixed(2)}`
}

export function formatLargeNumber(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(0)}M`
  return `$${n.toLocaleString()}`
}

export function isPositive(chg: number | null): boolean {
  return chg !== null && chg >= 0
}

// ─── COLORS ──────────────────────────────────────────────

export const COLORS = {
  bg:          '#0a0a0a',
  bg2:         '#111111',
  bg3:         '#171717',
  border:      '#2a2a2a',
  borderBright:'#3d3d3d',
  text:        '#e8e2d4',
  textDim:     '#7a7468',
  textMuted:   '#4a4642',
  gold:        '#c9a84c',
  copper:      '#b87333',
  silver:      '#a8a8b0',
  green:       '#4caf78',
  red:         '#c94c4c',
  blue:        '#4c8ec9',
}

// ─── CHART DEFAULTS ──────────────────────────────────────

export const CHART_OPTIONS_BASE = {
  responsive: true,
  interaction: { mode: 'index' as const, intersect: false },
  plugins: {
    legend: {
      labels: {
        color: COLORS.textDim,
        font: { family: "'IBM Plex Mono', monospace", size: 10 },
        boxWidth: 20,
      }
    },
    tooltip: {
      backgroundColor: '#111',
      borderColor: '#2a2a2a',
      borderWidth: 1,
      titleColor: COLORS.text,
      bodyColor: COLORS.textDim,
      titleFont: { family: "'IBM Plex Mono', monospace", size: 10 },
      bodyFont:  { family: "'IBM Plex Mono', monospace", size: 10 },
    }
  },
  scales: {
    x: {
      grid: { color: '#1a1a1a' },
      ticks: { color: COLORS.textMuted, font: { family: "'IBM Plex Mono', monospace", size: 9 } }
    },
    y: {
      grid: { color: '#1a1a1a' },
      ticks: { color: COLORS.textMuted, font: { family: "'IBM Plex Mono', monospace", size: 9 } }
    }
  }
}
