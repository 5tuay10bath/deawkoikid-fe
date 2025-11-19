import type { LoginDto, IAuthRepository } from "@application/ports/auth.repository.port"

export interface ILoginUseCase {
  execute: (dto: LoginDto) => Promise<IAuthRepository.login>
}

export class LoginUseCase implements ILoginUseCase {
  private authRepository: IAuthRepository

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository
  }

  async execute(dto: LoginDto): Promise<IAuthRepository.login> {
    return await this.authRepository.login(dto)
  }
}
