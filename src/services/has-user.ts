import { UserRepository } from './../repositories/user-repositorie'

interface HasUserServiceUser {
  email: string
}

export async function hasUserServiceUser({ email }: HasUserServiceUser) {
  const userRepository = new UserRepository()

  const hasUser = await userRepository.hasUserByEmail(email)

  return hasUser
}
