import type { RegisterDto, IAuthRepository } from "@application/ports/auth.repository.port"

export interface IRegisterUseCase {
  execute: (dto: RegisterDto) => Promise<IAuthRepository.register>
}

export class RegisterUseCase implements IRegisterUseCase {
  private authRepository: IAuthRepository

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository
  }

  async execute(dto: RegisterDto): Promise<IAuthRepository.register> {
    return await this.authRepository.register(dto)
  }
}
