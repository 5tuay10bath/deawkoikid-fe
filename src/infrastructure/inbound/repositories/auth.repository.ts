import type { IAuthRepository } from "@application/ports/auth.repository.port"
import type { RegisterDto, LoginDto } from "../dtos/auth.dto"
import { axiosInstance } from "@infrastructure/libs/axios/axiosInstance"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { LoginResponse } from "@domain/models/loginResponse.model"
import { left, right } from "@shared/either"

export class AuthRepository implements IAuthRepository {
  private static instance: AuthRepository
  public static getInstance(): AuthRepository {
    if (!AuthRepository.instance) {
      AuthRepository.instance = new AuthRepository()
    }
    return AuthRepository.instance
  }

  async register(dto: RegisterDto): Promise<IAuthRepository.register> {
    try {
      const url = `/public/api/register`

      const { data } = await axiosInstance.post(url, dto)

      const result: ApiResponse = {
        status: data.status,
        message: data.message,
        timestamp: data.timestamp,
      }

      return right(result)
    } catch (error: any) {
      return left(error?.response?.data || error)
    }
  }

  async login(dto: LoginDto): Promise<IAuthRepository.login> {
    try {
      const url = `/public/api/login`

      const { data } = await axiosInstance.post(url, dto)

      const result: LoginResponse = {
        status: data.status,
        message: data.message,
        data: data.data,
        timestamp: data.timestamp,
      }

      return right(result)
    } catch (error: any) {
      return left(error?.response?.data || error)
    }
  }
}
