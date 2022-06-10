import { FC } from 'react'
import { refreshLists } from '../utils/api'
import { useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
export const RefreshList: FC = () => {
  const queryClient = useQueryClient()

  const mutationRefresh = useMutation(
    async () => {
      return await refreshLists()
    },
    {
      onSuccess: () => {
        toast.success('Refreshed!')
      },

      onError: () => {
        toast.error('Error! Refreshing the list failed.')
      },
    }
  )

  return (
    <>
      <h2>Refresh Block List</h2>
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
