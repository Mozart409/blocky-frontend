import type { FC, ReactNode } from 'react'

import { useGetStats } from '../api/endpoints/stats/stats'
import type { ApiNameCount } from '../api/schemas'

const fmt = (n: number) => n.toLocaleString()

// cacheHitRate may arrive as a 0..1 ratio or an already-scaled percent.
const asPercent = (v: number) => (v <= 1 ? v * 100 : v)

const card =
  'rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4'

export const StatsDashboard: FC = () => {
  const { data, error, isLoading } = useGetStats({
    query: { refetchInterval: 30_000, retry: false },
  })

  if (isLoading) {
    return (
      <div className="prose prose-slate dark:prose-invert">
        <p>Loading statistics…</p>
      </div>
    )
  }

  if (error) {
    const disabled = error.response?.status === 503
    return (
      <div className={`${card} border-amber-300 dark:border-amber-700`}>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          DNS Statistics
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {disabled
            ? 'Statistics are disabled on the server. Enable statistics collection in your blocky configuration to view this dashboard.'
            : 'Unable to load statistics from the server.'}
        </p>
      </div>
    )
  }

  if (!data) return null
  const stats = data.data
  const s = stats.summary
  const blockedPct = s.queries > 0 ? (s.blocked / s.queries) * 100 : 0

  return (
    <section className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          DNS Statistics
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {new Date(stats.start).toLocaleString()} –{' '}
          {new Date(stats.end).toLocaleTimeString()}
        </span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Queries" value={fmt(s.queries)} />
        <Stat
          label="Blocked"
          value={fmt(s.blocked)}
          sub={`${blockedPct.toFixed(1)}%`}
          accent="text-red-500"
        />
        <Stat label="Cached" value={fmt(s.cached)} accent="text-sky-500" />
        <Stat label="Forwarded" value={fmt(s.forwarded)} />
        <Stat
          label="Cache hit rate"
          value={`${asPercent(s.cacheHitRate).toFixed(1)}%`}
        />
        <Stat label="Avg response" value={`${s.avgResponseMs.toFixed(1)} ms`} />
      </div>

      {/* Per-hour time series */}
      <div className={card}>
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Queries vs. blocked (per hour)
        </h3>
        <HourChart points={stats.perHour} />
        <div className="mt-2 flex gap-4 text-xs text-slate-500 dark:text-slate-400">
          <Legend className="bg-sky-500" label="Queries" />
          <Legend className="bg-red-500" label="Blocked" />
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid gap-3 md:grid-cols-3">
        <BarCard title="Response type" data={stats.byResponseType} />
        <BarCard title="Query type" data={stats.byQueryType} />
        <BarCard title="Response code" data={stats.byResponseCode} />
      </div>

      {/* Top lists */}
      <div className="grid gap-3 md:grid-cols-3">
        <TopList title="Top domains" rows={stats.topDomains} />
        <TopList title="Top blocked domains" rows={stats.topBlockedDomains} />
        <TopList title="Top clients" rows={stats.topClients} />
      </div>

      {/* Cache + lists */}
      <div className="grid gap-3 md:grid-cols-3">
        <div className={card}>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Cache
          </h3>
          <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
            {fmt(stats.cache.entries)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">entries</p>
        </div>
        <BarCard title="Denylist entries" data={stats.lists.denylist} />
        <BarCard title="Allowlist entries" data={stats.lists.allowlist} />
      </div>
    </section>
  )
}

function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub?: string
  accent?: string
}) {
  return (
    <div className={card}>
      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p
        className={`mt-1 text-2xl font-bold ${
          accent ?? 'text-slate-800 dark:text-slate-100'
        }`}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{sub}</p>
      )}
    </div>
  )
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`inline-block h-2 w-2 rounded-sm ${className}`} />
      {label}
    </span>
  )
}

function HourChart({
  points,
}: {
  points: { hour: string; queries: number; blocked: number }[]
}) {
  if (!points || points.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No hourly data yet.
      </p>
    )
  }
  const max = Math.max(1, ...points.map((p) => p.queries))
  return (
    <div className="flex h-32 items-stretch gap-1">
      {points.map((p) => (
        <div
          key={p.hour}
          className="relative h-full min-w-[0.5rem] max-w-[2.5rem] flex-1 rounded-t bg-slate-100 dark:bg-slate-700/40"
          title={`${new Date(p.hour).toLocaleTimeString([], {
            hour: '2-digit',
          })} — ${fmt(p.queries)} queries, ${fmt(p.blocked)} blocked`}
        >
          <div
            className="absolute bottom-0 w-full rounded-t bg-sky-500/80"
            style={{ height: `${(p.queries / max) * 100}%` }}
          />
          <div
            className="absolute bottom-0 w-full rounded-t bg-red-500"
            style={{ height: `${(p.blocked / max) * 100}%` }}
          />
        </div>
      ))}
    </div>
  )
}

function BarCard({
  title,
  data,
}: {
  title: string
  data: { [key: string]: number }
}) {
  const rows = Object.entries(data).sort((a, b) => b[1] - a[1])
  const max = Math.max(1, ...rows.map(([, v]) => v))
  return (
    <div className={card}>
      <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
        {title}
      </h3>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No data.</p>
      ) : (
        <ul className="space-y-1.5">
          {rows.map(([name, value]) => (
            <BarRow key={name} name={name} value={value} max={max} />
          ))}
        </ul>
      )}
    </div>
  )
}

function TopList({ title, rows }: { title: string; rows: ApiNameCount[] }) {
  const items = rows ?? []
  const max = Math.max(1, ...items.map((r) => r.count))
  return (
    <div className={card}>
      <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No data.</p>
      ) : (
        <ul className="space-y-1.5">
          {items.slice(0, 10).map((r) => (
            <BarRow key={r.name} name={r.name} value={r.count} max={max} />
          ))}
        </ul>
      )}
    </div>
  )
}

function BarRow({
  name,
  value,
  max,
}: {
  name: string
  value: number
  max: number
}): ReactNode {
  return (
    <li>
      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
        <span className="truncate pr-2" title={name}>
          {name}
        </span>
        <span className="tabular-nums">{fmt(value)}</span>
      </div>
      <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded bg-slate-100 dark:bg-slate-700">
        <div
          className="h-full rounded bg-sky-500"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </li>
  )
}
