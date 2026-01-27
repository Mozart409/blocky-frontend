import { FC } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { listRefresh } from '../api/endpoints/lists/lists'

export const RefreshList: FC = () => {
  const mutationRefresh = useMutation({
    mutationFn: () => listRefresh(),
    onSuccess: () => {
      toast.success('Refreshed!')
    },
    onError: () => {
      toast.error('Error! Refreshing the list failed.')
    }
  })

  return (
    <>
      <div className="prose prose-lg prose-slate dark:prose-invert">
        <h2>Refresh Block List</h2>
      </div>
      <button
        type="button"
        onClick={() => {
          mutationRefresh.mutate()
        }}
        className="flex p-2 rounded-md bg-sky-500 hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-white"
      >
        <span className="text-white">Refresh Lists</span>
      </button>
    </>
  )
}
