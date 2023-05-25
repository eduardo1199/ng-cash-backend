import { knex } from '../database'
import { UserRepository } from '../repositories/user-repository'
import { PrismaUserRepository } from './../repositories/prisma-user-repository'
import crypto from 'node:crypto'

interface RegisterServiceUserRequest {
  name: string
  email: string
}

export class RegisterUserCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ name, email }: RegisterServiceUserRequest) {
    const transition_id = crypto.randomUUID()

    const user_id = await this.userRepository.insert(name, email)

    await knex('transactions').insert({
      id: transition_id,
      amount: 100,
      created_at: new Date(),
      type: 'income',
      user_id,
      category: 'Entrada inicial',
      description: 'Primeiro depósito',
    })

    return user_id
  }
}
