import { FC } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  useBlockingStatus,
  enableBlocking,
  disableBlocking,
  getBlockingStatusQueryKey
} from '../api/endpoints/blocking/blocking'

// Quick-disable durations. `undefined` means disable indefinitely (blocky default).
const DISABLE_DURATIONS: { label: string; duration?: string }[] = [
  { label: 'Disable', duration: undefined },
  { label: '5m', duration: '5m' },
  { label: '30m', duration: '30m' },
  { label: '1h', duration: '1h' }
]

export const BlockingStatus: FC = () => {
  // Poll so the banner reflects auto re-enable after a timed disable expires.
  const { status, data, error } = useBlockingStatus({
    query: { refetchInterval: 5000 }
  })

  if (data === undefined) {
    return null
  }

  if (error) {
    return (
      <div className="relative bg-yellow-600">
        <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
          <div className="pr-16 sm:text-center sm:px-16">
            <p className="font-medium text-white">
              <span className="md:hidden">Connection Error</span>
              <span className="hidden md:inline">
                We are unable to connect to the server.
              </span>
              <span className="block sm:ml-2 sm:inline-block">
                <button
                  type="button"
                  onClick={() => {
                    window.location.reload()
                  }}
                >
                  <p className="text-white font-bold underline"> Retry</p>
                </button>
              </span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (data) {
    return (
      <>
        {status === 'success' && (
          <Banner
            enabled={data.data.enabled}
            autoEnableInSec={data.data.autoEnableInSec}
          />
        )}
      </>
    )
  }

  return null
}

function formatCountdown(totalSec: number): string {
  const s = Math.max(0, Math.round(totalSec))
  const m = Math.floor(s / 60)
  const rem = s % 60
  if (m <= 0) return `${rem}s`
  return `${m}m ${rem}s`
}

export function Banner({
  enabled,
  autoEnableInSec
}: {
  enabled: boolean
  autoEnableInSec?: number
}) {
  const queryClient = useQueryClient()

  const invalidateStatus = () =>
    queryClient.invalidateQueries({ queryKey: getBlockingStatusQueryKey() })

  const mutationEnable = useMutation({
    mutationFn: () => enableBlocking(),
    onSuccess: invalidateStatus
  })

  const mutationDisable = useMutation({
    mutationFn: (duration?: string) =>
      disableBlocking(duration ? { duration } : undefined),
    onSuccess: invalidateStatus
  })

  if (enabled === true) {
    return (
      <div className="relative bg-sky-600">
        <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
          <div className="pr-16 sm:text-center sm:px-16">
            <p className="font-medium text-white flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="md:hidden">Blocking enabled</span>
              <span className="hidden md:inline">
                You are safe. Blocking is enabled.
              </span>
              <span className="inline-flex flex-wrap items-center gap-2">
                {DISABLE_DURATIONS.map(({ label, duration }) => (
                  <button
                    key={label}
                    type="button"
                    disabled={mutationDisable.isPending}
                    onClick={() => {
                      mutationDisable.mutate(duration)
                    }}
                    className="rounded-md bg-sky-700 hover:bg-sky-800 px-2 py-1 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-60"
                    title={
                      duration
                        ? `Disable blocking for ${duration}`
                        : 'Disable blocking indefinitely'
                    }
                  >
                    {label}
                  </button>
                ))}
              </span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (enabled === false) {
    return (
      <div className="relative bg-red-600">
        <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
          <div className="pr-16 sm:text-center sm:px-16">
            <p className="font-medium text-white flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="md:hidden">Blocking disabled</span>
              <span className="hidden md:inline">
                You are exposed. Blocking is disabled.
              </span>
              {autoEnableInSec !== undefined && autoEnableInSec > 0 && (
                <span className="inline-block rounded bg-red-800 px-2 py-0.5 text-sm">
                  Auto-enables in {formatCountdown(autoEnableInSec)}
                </span>
              )}
              <span className="inline-block">
                <button
                  type="button"
                  disabled={mutationEnable.isPending}
                  onClick={() => {
                    mutationEnable.mutate()
                  }}
                  className="rounded-md bg-red-800 hover:bg-red-900 px-2 py-1 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-60"
                >
                  Enable Blocking
                </button>
              </span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
