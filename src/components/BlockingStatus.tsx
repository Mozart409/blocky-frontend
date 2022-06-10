import { FC } from 'react'
import {
  disableBlocking,
  useBlockingStatus,
  enableBlocking,
} from '../utils/api'
import { useMutation, useQueryClient } from 'react-query'

interface IBlockingStatus {
  enabled: boolean
  disabledGroups?: any
  autoEnableInSec: number
}

export const BlockingStatus: FC = () => {
  const { status, data, error, isFetching } = useBlockingStatus()

  const blockingData: IBlockingStatus = data
  return <>{status === 'success' && <Banner status={blockingData.enabled} />}</>
}

export function Banner({ status }: { status: boolean }) {
  const queryClient = useQueryClient()
  const handleDisableBlocking = useMutation(disableBlocking, {
    onSuccess: () => {
      queryClient.invalidateQueries('blocking')
    },
  })

  const handleEnableBlocking = useMutation(enableBlocking, {
    onSuccess: () => {
      queryClient.invalidateQueries('blocking')
    },
  })

  const mutationEnable = useMutation(
    async () => {
      return await enableBlocking()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('blocking')
      },
    }
  )

  const mutationDisable = useMutation(
    async () => {
      return await disableBlocking()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('blocking')
      },
    }
  )

  if (status === true) {
    return (
      <div className="relative bg-sky-600">
        <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
          <div className="pr-16 sm:text-center sm:px-16">
            <p className="font-medium text-white">
              <span className="md:hidden">Blocking enabled</span>
              <span className="hidden md:inline">
                You are save. Blocking is enabled.
              </span>
              <span className="block sm:ml-2 sm:inline-block">
                <button
                  type="button"
                  onClick={() => {
                    mutationDisable.mutate()
                  }}
                >
                  <p className="text-white font-bold underline">
                    {' '}
                    Disable Blocking
                  </p>
                </button>
              </span>
            </p>
          </div>
        </div>
      </div>
    )
  }
  /*  if (status === undefined) {
    return (
      <div className="relative bg-green-600">
        <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
          <div className="pr-16 sm:text-center sm:px-16">
            <p className="font-medium text-white">
              <span className="md:hidden">Blocking active</span>
              <span className="hidden md:inline">
                You are save. Blocking enabled
              </span>
            </p>
            <button
              type="button"
              onClick={() => {
                mutationDisable.mutate()
              }}
              className="p-2 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span className="text-white">Disable Blocking</span>
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 pt-1 pr-1 flex items-start sm:pt-1 sm:pr-2 sm:items-start">
            <button
              type="button"
              onClick={() => {
                mutationDisable.mutate()
              }}
              className="flex p-2 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span className="text-white">Disable Blocking</span>
            </button>
          </div> 
        </div>
      </div>
    )
  } */
  if (status === false) {
    return (
      <div className="relative bg-red-600">
        <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
          <div className="pr-16 sm:text-center sm:px-16">
            <p className="font-medium text-white">
              <span className="md:hidden">Blocking disabled</span>
              <span className="hidden md:inline">
                You are exposed. Blocking is disabled.
              </span>
              <span className="block sm:ml-2 sm:inline-block">
                <button
                  type="button"
                  onClick={() => {
                    mutationEnable.mutate()
                  }}
                >
                  <p className="text-white font-bold underline">
                    {' '}
                    Enable Blocking
                  </p>
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
