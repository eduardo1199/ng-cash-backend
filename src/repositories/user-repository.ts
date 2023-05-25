export interface User {
  id: string
  name: string
  email: string
  session_id: string | null
}

export interface UserRepository {
  insert(name: string, email: string): Promise<string>
  findByEmail(email: string): Promise<boolean>
  updateSessionUser(email: string): Promise<string>
  deleteUser(id: string): Promise<void>
  getUserBySessionId(session_id: string): Promise<string>
  getAllUsers(): Promise<User[]>
}
