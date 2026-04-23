'use client'

import { useState, useEffect, useCallback } from 'react'

interface UseLiveDataOptions {
  refreshInterval?: number // ms, 0 = no auto-refresh
  enabled?: boolean
}

interface UseLiveDataResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  refresh: () => void
}

export function useLiveData<T>(
  url: string,
  options: UseLiveDataOptions = {}
): UseLiveDataResult<T> {
  const { refreshInterval = 60000, enabled = true } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    if (!enabled) return
    try {
      setError(null)
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error ?? 'API error')
      setData(json.data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [url, enabled])

  useEffect(() => {
    fetchData()
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, refreshInterval])

  return { data, loading, error, lastUpdated, refresh: fetchData }
}

// Specialized hooks
export function useMetals() {
  return useLiveData<{
    live: any[]
    specialty: any[]
  }>('/api/metals', { refreshInterval: 60000 })
}

export function useForex() {
  return useLiveData<any[]>('/api/forex', { refreshInterval: 300000 })
}

export function useEquities() {
  return useLiveData<{
    stocks: any[]
    etfs: any[]
    hyperscalers: any[]
  }>('/api/equities', { refreshInterval: 60000 })
}

export function useCharts(type: 'equity' | 'commodity') {
  return useLiveData<{
    labels: string[]
    datasets: any[]
  }>(`/api/charts?type=${type}`, { refreshInterval: 3600000 })
}
