import crypto from 'node:crypto'
import { knex } from '../database'

export class UserRepository {
  async insert(name: string, email: string) {
    const session_id = crypto.randomUUID()

    const response = await knex('users')
      .insert({
        id: crypto.randomUUID(),
        name,
        email,
        session_id,
      })
      .returning(['id', 'name'])

    const id: string = response[0].id

    return id
  }

  async hasUserByEmail(email: string) {
    const user = await knex('users')
      .select()
      .where({
        email,
      })
      .first()

    const hasUserByEmail = !!user?.id

    return hasUserByEmail
  }

  async updateSessionUser(email: string) {
    const session_id = crypto.randomUUID()

    const response = await knex('users')
      .where({ email })
      .update({ session_id })
      .returning('id')

    const id: string = response[0].id

    return id
  }

  async deleteUser(id: string) {
    await knex('users').where({ id }).del()
  }

  async getUserBySessionId(session_id: string) {
    const response = await knex('users').select('id').where({ session_id })

    const id: string = response[0].id

    return id
  }

  async getAllUsers() {
    const usersAll = await knex('users').select('*')

    return usersAll
  }
}
