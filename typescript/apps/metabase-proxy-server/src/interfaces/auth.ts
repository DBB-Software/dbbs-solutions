import { Request } from '@nestjs/common'

export interface User {
  email: string
}

export interface AuthRequest extends Request {
  user: User
}
