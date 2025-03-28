import axios from 'redaxios'
import { BlockStatusResponse } from './types'
import { useQuery, UseQueryResult } from 'react-query'

const getFullUrl = (url: string) => {
  let baseUrl: string = ''

  if (process.env.NODE_ENV === 'production') {
    let API_URL = import.meta.env.API_URL
    if (API_URL === undefined) {
      throw new Error('API_URL is undefined. Please set it in .env file.')
    }
    baseUrl = import.meta.env.API_URL + '/api'
  } else {
    baseUrl = 'http://localhost:4000/api'
  }

  console.debug(`API URL: ${baseUrl}`)

  const fullURL = `${baseUrl}${url}`

  return fullURL
}

export function useBlockingStatus(): UseQueryResult<BlockStatusResponse> {
  return useQuery(['blocking'], async () => {
    const url = getFullUrl('/blocking/status')
    const { data } = await axios.get(url)
    return data
  })
}

export function enableBlocking() {
  const url = getFullUrl('/blocking/enable')
  return axios.get(url)
}

export function disableBlocking() {
  const url = getFullUrl('/blocking/disable')
  return axios.get(url)
}

export function refreshLists() {
  const url = getFullUrl('/lists/refresh')
  const data = axios.post(url)
  return data
}

export interface IDNSQuery {
  ip: string
  type: string
  // type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'NS' | 'PTR' | 'SOA' | 'TXT'
}

export function dnsQuery({ ip, type }: IDNSQuery) {
  const url = getFullUrl('/query')
  const data = axios.post(url, {
    query: ip,
    type
  })
  return data
}


export function flushCache() {
  const url = getFullUrl('/cache/flush')
  const data = axios.post(url)
  return data
}