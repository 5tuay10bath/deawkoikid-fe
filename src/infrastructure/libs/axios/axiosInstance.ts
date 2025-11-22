import axios, { type AxiosRequestConfig } from "axios"
import { cloneDeep } from "lodash"

import { cookieUtils } from "@shared/utils/cookie.utils"
import type { AxiosRequestHeaders } from "./types"

const axiosInstance = axios.create({
  baseURL: `https://muict.app/fivetuay10bath-backend/api`,
})

axiosInstance.interceptors.request.use(
  async (config: AxiosRequestConfig): Promise<any> => {
    const newConfig = cloneDeep(config)

    newConfig.headers = {
      ...newConfig.headers,
    } as AxiosRequestHeaders

    if (import.meta.env.VITE_PUBLIC_X_API_KEY) {
      newConfig.headers["x-api-key"] = import.meta.env.VITE_PUBLIC_X_API_KEY
    }

    const token = cookieUtils.getAuthToken()
    if (token) {
      newConfig.headers.Authorization = `Bearer ${token}`
    }

    return newConfig
  },
  (error) => error,
)

export { axiosInstance }
