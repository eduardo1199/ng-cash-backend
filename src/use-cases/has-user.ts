import { UserRepository } from '../repositories/user-repository'

interface HasUserServiceUser {
  email: string
}

export class HasUserByEmailCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string) {
    const hasUser = await this.userRepository.findByEmail(email)

    return hasUser
  }
}
