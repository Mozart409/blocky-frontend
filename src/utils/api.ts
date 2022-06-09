import axios from 'axios'

import { useQuery } from 'react-query'

const getFullUrl = (url: string) => {
  let baseUrl
  if (process.env.NODE_ENV === 'development') {
    baseUrl = 'http://localhost:4000/api'
  }

  if (process.env.NODE_ENV === 'production') {
    baseUrl = process.env.API_URL + '/api'
  }

  const fullURL = `${baseUrl}${url}`
  console.log(fullURL)
  return fullURL
}

export function useBlockingStatus() {
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
