import axios, { type AxiosRequestConfig } from "axios"
import { cloneDeep } from "lodash"

import type { AxiosRequestHeaders } from "./types"
import { DEAWKOIKID_API_BASE_URL } from "../../../config/env"

const axiosInstance = axios.create({
  baseURL: DEAWKOIKID_API_BASE_URL,
})

axiosInstance.interceptors.request.use(
  async (config: AxiosRequestConfig): Promise<any> => {
    const newConfig = cloneDeep(config)

    newConfig.headers = {
      ...newConfig.headers,
    } as AxiosRequestHeaders

    // Only add API key if it exists
    if (import.meta.env.VITE_PUBLIC_X_API_KEY) {
      newConfig.headers["x-api-key"] = import.meta.env.VITE_PUBLIC_X_API_KEY
    }

    return newConfig
  },
  (error) => error,
)

export { axiosInstance }
