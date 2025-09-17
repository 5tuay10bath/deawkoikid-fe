// import axios, { AxiosRequestConfig } from 'axios'
// import { cloneDeep } from 'lodash'

// import { AxiosRequestHeaders } from './types'

// const axiosInstance = axios.create({
//     baseURL: process.env.PUBLIC_API_ENDPOINT,
// })

// axiosInstance.interceptors.request.use(
//     async (config: AxiosRequestConfig): Promise<any> => {
//         const newConfig = cloneDeep(config)

//         newConfig.headers = {
//             ...newConfig.headers,
//             'x-api-key': process.env.PUBLIC_X_API_KEY,
//         } as AxiosRequestHeaders

//         return newConfig
//     },
//     (error) => error,
// )

// export { axiosInstance }
