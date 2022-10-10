export type Role = 'admin' | 'ghost' | 'user';

export class UserJwtDto {
  id: string
  firstName: string
  lastName: string
  avatar: string
  role: Role
  exp: number
  iat: number
}
