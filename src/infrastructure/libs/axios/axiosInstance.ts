import axios, { type AxiosRequestConfig } from "axios"
import { cloneDeep } from "lodash"

import type { AxiosRequestHeaders } from "./types"

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_DEAWKOIKID_API_BASE_URL}`,
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

    return newConfig
  },
  (error) => error,
)

export { axiosInstance }
