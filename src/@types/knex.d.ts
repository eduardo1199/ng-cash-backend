import { Knex } from 'knex'

declare module 'knex/types/tables' {
  interface User {
    id: string
    name: string
    email: string
    session_id: string | null
  }

  interface Transactions {
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
