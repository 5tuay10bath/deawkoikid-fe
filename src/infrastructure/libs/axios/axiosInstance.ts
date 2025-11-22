import axios, { type AxiosRequestConfig } from "axios"
import { cloneDeep } from "lodash"

import { cookieUtils } from "@shared/utils/cookie.utils"
import type { AxiosRequestHeaders } from "./types"

const apiBaseUrl = `https://muict.app/fivetuay10bath-backend`

const isPresignedUrl = (url?: string) => {
  if (!url) return false
  return /amazonaws\.com/i.test(url) || /[?&]X-Amz-Signature=/i.test(url)
}

const axiosInstance = axios.create({
  baseURL: `${apiBaseUrl}/api`,
})

axiosInstance.interceptors.request.use(
  async (config: AxiosRequestConfig): Promise<any> => {
    const newConfig = cloneDeep(config)
    const skipAuthHeaders = isPresignedUrl(newConfig.url)

    newConfig.headers = {
      ...newConfig.headers,
    } as AxiosRequestHeaders

    if (skipAuthHeaders) {
      delete newConfig.headers.Authorization
      delete (newConfig.headers as Record<string, unknown>)["x-api-key"]
    } else {
      if (import.meta.env.VITE_PUBLIC_X_API_KEY) {
        newConfig.headers["x-api-key"] = import.meta.env.VITE_PUBLIC_X_API_KEY
      }

      const token = cookieUtils.getAuthToken()
      if (token) {
        newConfig.headers.Authorization = `Bearer ${token}`
      }
    }

    return newConfig
  },
  (error) => error,
)

export { axiosInstance }
