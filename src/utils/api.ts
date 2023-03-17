import axios from 'redaxios'
import { BlockStatusResponse } from './types'
import { useQuery, UseQueryResult } from 'react-query'

const getFullUrl = (url: string) => {
  let baseUrl = 'http://localhost:4000/api'
  /* if (process.env.NODE_ENV === 'development') {
    baseUrl = 'http://localhost:4000/api'
  }

  if (process.env.NODE_ENV === 'production') {
    baseUrl = process.env.API_URL + '/api'
  } */

  const fullURL = `${baseUrl}${url}`
  /* console.log(fullURL) */
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

/* const options = {
  method: 'POST',
  url: 'http://localhost:4000/api/query',
  headers: { 'Content-Type': 'application/json' },
  data: { query: '1.1.1.1', type: 'A' },
}

axios
  .request(options)
  .then(function (response) {
    console.log(response.data)
  })
  .catch(function (error) {
    console.error(error)
  }) */
