import { Schema, Document } from 'mongoose'

export const UserSchema = new Schema({
  email: String,
  first_name: String,
  last_name: String,
  phone: String,
  organization: [
    {
      id: { type: Schema.Types.ObjectId, ref: 'Organization' },
      role: String,
      _id: false
    }
  ]
})

export interface User extends Document {
  id: string
  email: string
  first_name: string
  last_name: string
  organization: { id: string; role: string }[]
}
