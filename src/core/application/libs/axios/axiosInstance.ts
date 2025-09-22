import axios, { type AxiosRequestConfig } from "axios"
import { cloneDeep } from "lodash"

import type { AxiosRequestHeaders } from "./types"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_ENDPOINT,
})

axiosInstance.interceptors.request.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (config: AxiosRequestConfig): Promise<any> => {
    const newConfig = cloneDeep(config)

    newConfig.headers = {
      ...newConfig.headers,
      "x-api-key": import.meta.env.VITE_PUBLIC_X_API_KEY,
    } as AxiosRequestHeaders

    return newConfig
  },
  (error) => error,
)

export { axiosInstance }
