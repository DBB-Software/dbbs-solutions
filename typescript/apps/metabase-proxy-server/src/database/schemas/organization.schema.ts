import { Schema, Document } from 'mongoose'

export const OrganizationSchema = new Schema({
  org_id: { type: String, required: true },
  name: { type: String, required: true, unique: true },
  display_name: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' }
})

export interface Organization extends Document {
  id: string
  org_id: string
  name: string
  display_name: string
}
