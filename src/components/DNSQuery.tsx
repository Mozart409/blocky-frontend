import { FC, useState } from 'react'
import { dnsQuery, refreshLists } from '../utils/api'
import { useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'

const queryTypes = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'PTR', 'SOA', 'TXT']

export const DNSQuery: FC = () => {
  const queryClient = useQueryClient()

  const [ip, setIP] = useState<string>('')
  const [type, setType] = useState<string>(queryTypes[0])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await dnsQuery({ ip, type })
      toast.success(`Query is ${res.data.responseType}`)
    } catch (error: any) {
      toast.error(error)
    }
  }

  return (
    <>
      <h2>DNS Query</h2>

      <div className="w-full max-w-xs">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <span>Enter an ip</span>
              <input
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="1.1.1.1"
                type="text"
                onChange={(e) => {
                  setIP(e.target.value)
                }}
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <span>Select a query type {JSON.stringify(type)}</span>
              <select
                onChange={(e) => setType(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
              >
                {queryTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>{' '}
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            <span className="text-white">DNS Query</span>
          </button>
        </form>
      </div>
    </>
  )
}
