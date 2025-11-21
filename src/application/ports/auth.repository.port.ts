import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { LoginResponse } from "@domain/models/loginResponse.model"
import type { RegisterDto, LoginDto } from "@infrastructure/inbound/dtos/auth.dto"
import type { Either } from "@shared/either"

export type { RegisterDto, LoginDto }

export interface IAuthRepository {
  register: (dto: RegisterDto) => Promise<IAuthRepository.register>
  login: (dto: LoginDto) => Promise<IAuthRepository.login>
}

export namespace IAuthRepository {
  export type register = Promise<Either<any, ApiResponse>>
  export type login = Promise<Either<any, LoginResponse>>
}
