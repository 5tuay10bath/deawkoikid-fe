import { AxiosError } from 'axios'

export type AxiosRequestHeaders = Record<string, string>

export type CustomAxiosError = AxiosError & {
    response: {
        data: { statusCode: number; message: string }
    }
}
