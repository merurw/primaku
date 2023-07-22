/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axiosClient from 'axios'
import type { AxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import { token } from '../constants/constants'

interface IAuth {
  token?: string
}

/**
 * Creates an initial 'axios' instance with custom settings.
 */
const baseURL = process.env.NEXT_PUBLIC_API_URL
const instance = axiosClient.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8'
  },
  baseURL
})

/**
 * Handle all responses. It is possible to add handlers
 * for requests, but it is omitted here for brevity.
 */
instance.interceptors.request.use((config) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  if (typeof window !== undefined) {
    if (Cookies.get(token)) {
      const at = Cookies.get(token)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const autkn: IAuth = JSON.parse(at)
      if (autkn) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        config.headers.Authorization = `Bearer ${autkn.token}`
      }
    }
  }
  return config
})

instance.interceptors.response.use(
  (res) => res.data,
  async (err) => {
    if (err.response) {
      return await Promise.reject(err.response.data)
    }

    if (err.request) {
      return await Promise.reject(err.request)
    }

    return await Promise.reject(err.message)
  }
)

/**
 * Replaces main `axios` instance with the custom-one.
 *
 * @param cfg - Axios configuration object.
 * @returns A promise object of a response of the HTTP request with the 'data' object already
 * destructured.
 */
const axios = async <T>(cfg: AxiosRequestConfig) =>
  await instance.request<any, T>(cfg)

export default axios
