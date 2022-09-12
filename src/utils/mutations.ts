import { useQueryClient, useMutation } from 'react-query'
import { enableBlocking, disableBlocking } from './api'

const queryClient = useQueryClient()

export const mutationEnable = useMutation(
  async () => {
    return await enableBlocking()
  },
  {
    onSuccess: () => {
      queryClient.invalidateQueries('blocking')
    },
  }
)

export const mutationDisable = useMutation(
  async () => {
    return await disableBlocking()
  },
  {
    onSuccess: () => {
      queryClient.invalidateQueries('blocking')
    },
  }
)
