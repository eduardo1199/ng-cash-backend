import { PrismaUserRepository } from '../repositories/prisma-user-repository'

interface UpdateUserService {
  email: string
}

export class UpdateUserCase {
  constructor(private userRepository: PrismaUserRepository) {}

  async execute(email: string) {
    const user_id = await this.userRepository.updateSessionUser(email)

    return user_id
  }
}
