import { FC } from 'react'
import {
  disableBlocking,
  useBlockingStatus,
  enableBlocking
} from '../utils/api'
import { useMutation, useQueryClient } from 'react-query'

export const BlockingStatus: FC = () => {
  const { status, data, error, isFetching } = useBlockingStatus()

  if (data === undefined) {
    return null
  }
  const blockingData = data

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
      <>{status === 'success' && <Banner status={blockingData.enabled} />}</>
    )
  }

  return null
}

export function Banner({ status }: { status: boolean }) {
  const queryClient = useQueryClient()

  const mutationEnable = useMutation(
    async () => {
      return await enableBlocking()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('blocking')
      }
    }
  )

  const mutationDisable = useMutation(
    async () => {
      return await disableBlocking()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('blocking')
      }
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
