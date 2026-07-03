import { FC } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { cacheFlush } from '../api/endpoints/cache/cache'
import { getGetStatsQueryKey } from '../api/endpoints/stats/stats'

export const CacheFlush: FC = () => {
  const queryClient = useQueryClient()

  const mutationFlush = useMutation({
    mutationFn: () => cacheFlush(),
    onSuccess: () => {
      toast.success('DNS cache flushed!')
      // cache entry count in the stats dashboard is now stale
      queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() })
    },
    onError: () => {
      toast.error('Error! Flushing the DNS cache failed.')
    }
  })

  return (
    <button
      type="button"
      onClick={() => {
        mutationFlush.mutate()
      }}
      disabled={mutationFlush.isPending}
      className="flex p-2 rounded-md bg-sky-500 hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-60"
    >
      <span className="text-white">
        {mutationFlush.isPending ? 'Flushing…' : 'Flush Cache'}
      </span>
    </button>
  )
}
