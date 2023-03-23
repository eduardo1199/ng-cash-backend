import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface User {
    id: string
    name: string
    email: string
    session_id: string | null
  }

  export interface Transactions {
    id: string
    amount: number
    created_at: Date
    type: 'income' | 'outcome'
    user_id: string
  }

  export interface Tables {
    users: User

    transactions: Transactions
  }
}
