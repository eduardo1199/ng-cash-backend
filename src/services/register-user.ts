import { knex } from '../database'
import { UserRepository } from './../repositories/user-repositorie'
import crypto from 'node:crypto'

interface RegisterServiceUserRequest {
  name: string
  email: string
}

export async function registerServiceUser({
  name,
  email,
}: RegisterServiceUserRequest) {
  const userRepository = new UserRepository()

  const transition_id = crypto.randomUUID()

  const user_id = await userRepository.insert(name, email)

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
