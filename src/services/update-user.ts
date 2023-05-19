import { UserRepository } from '../repositories/user-repositorie'

interface UpdateUserService {
  email: string
}

export async function updateUserService({ email }: UpdateUserService) {
  const userRepository = new UserRepository()

  const user_id = await userRepository.updateSessionUser(email)

  return user_id
}
