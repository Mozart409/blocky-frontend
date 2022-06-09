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
      <h2>useListRefresh</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Enter a domain name:</span>
          <input
            required
            placeholder="1.1.1.1"
            type="text"
            onChange={(e) => {
              setIP(e.target.value)
            }}
          />
        </label>

        <label>
          <span>Select a query tpye : {JSON.stringify(type)}</span>
          <select onChange={(e) => setType(e.target.value)}>
            {queryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="flex p-2 rounded-md bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <span className="text-white">DNS Query</span>
        </button>
      </form>
    </>
  )
}
