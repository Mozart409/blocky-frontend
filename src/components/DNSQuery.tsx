import { FC, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { query } from '../api/endpoints/query/query'

const queryTypes = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'PTR', 'SOA', 'TXT']

// Validate domain name (RFC 1123 with practical TLD validation)
const isValidDomain = (domain: string): boolean => {
  if (!domain || domain.length > 253) return false
  
  // Must contain at least one dot (e.g., "example.com", not just "localhost")
  if (!domain.includes('.')) return false
  
  const labels = domain.split('.')
  
  // Check each label
  for (const label of labels) {
    // Each label: 1-63 chars, alphanumeric and hyphens, can't start/end with hyphen
    if (!label || label.length > 63) return false
    if (label.startsWith('-') || label.endsWith('-')) return false
    if (!/^[a-zA-Z0-9-]+$/.test(label)) return false
  }
  
  // TLD validation: must be 2+ chars and letters only (no numbers)
  const tld = labels[labels.length - 1]
  if (tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
    return false
  }
  
  return true
}

// Validate IPv4 address
const isValidIPv4 = (ip: string): boolean => {
  const parts = ip.split('.')
  if (parts.length !== 4) return false
  return parts.every(part => {
    const num = parseInt(part, 10)
    return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString()
  })
}

// Validate IPv6 address (simplified check)
const isValidIPv6 = (ip: string): boolean => {
  const ipv6Pattern = /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$|^::(?:[a-fA-F0-9]{1,4}:){0,6}[a-fA-F0-9]{1,4}$|^(?:[a-fA-F0-9]{1,4}:){1,7}:$|^(?:[a-fA-F0-9]{1,4}:){0,6}::(?:[a-fA-F0-9]{1,4}:){0,5}[a-fA-F0-9]{1,4}$/
  return ipv6Pattern.test(ip)
}

// Validate query input based on record type
const validateQueryInput = (input: string, type: string): string | null => {
  const trimmed = input.trim()
  
  if (!trimmed) {
    return 'Please enter a domain name or IP address'
  }

  // PTR records expect an IP address
  if (type === 'PTR') {
    if (!isValidIPv4(trimmed) && !isValidIPv6(trimmed)) {
      return 'PTR queries require a valid IP address'
    }
    return null
  }

  // AAAA records are for IPv6, but query is still a domain
  // All other record types expect a domain name
  if (!isValidDomain(trimmed)) {
    // Check if user entered an IP when they should enter a domain
    if (isValidIPv4(trimmed) || isValidIPv6(trimmed)) {
      return 'Please enter a domain name, not an IP address (use PTR for reverse lookups)'
    }
    return 'Please enter a valid domain name (e.g., example.com)'
  }

  return null
}

export const DNSQuery: FC = () => {
  const [domain, setDomain] = useState<string>('')
  const [type, setType] = useState<string>(queryTypes[0])
  const [validationError, setValidationError] = useState<string | null>(null)

  const dnsQueryMutation = useMutation({
    mutationFn: (data: { query: string; type: string }) => query(data),
    onSuccess: (res) => {
      toast.success(`Query is ${res.data.responseType}`)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Query failed')
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDomain(value)
    // Clear validation error while typing
    if (validationError) {
      setValidationError(null)
    }
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value)
    // Re-validate on type change if there's input
    if (domain) {
      setValidationError(validateQueryInput(domain, e.target.value))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const error = validateQueryInput(domain, type)
    if (error) {
      setValidationError(error)
      toast.error(error)
      return
    }

    dnsQueryMutation.mutate({ query: domain.trim(), type })
  }

  return (
    <>
      <div className="prose prose-lg prose-slate dark:prose-invert">
        <h2>DNS Query</h2>
      </div>

      <div className="w-full grid grid-cols-1 gap-x-4 lg:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded pt-6 pb-8 mb-4 px-4"
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <span>{type === 'PTR' ? 'Enter an IP address' : 'Enter a domain name'}</span>
              <input
                required
                value={domain}
                placeholder={type === 'PTR' ? '8.8.8.8' : 'example.com'}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  validationError ? 'border-red-500' : ''
                }`}
                type="text"
                onChange={handleInputChange}
              />
              {validationError && (
                <p className="text-red-500 text-xs italic mt-1">{validationError}</p>
              )}
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <span>Select a query type</span>
              <select
                value={type}
                onChange={handleTypeChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
              >
                {queryTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="submit"
            disabled={dnsQueryMutation.isPending}
            className="bg-sky-500 hover:bg-sky-400 disabled:bg-sky-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            <span className="text-white">
              {dnsQueryMutation.isPending ? 'Querying...' : 'DNS Query'}
            </span>
          </button>
        </form>
      </div>
    </>
  )
}
