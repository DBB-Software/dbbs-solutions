import { DatabaseError } from '../../interfaces/index.js'

export function handleDbCreateError(error: DatabaseError) {
  // FIXME: Implement different error-handling logic for databases other than SQLite
  if (error?.code === 'SQLITE_CONSTRAINT' && error.message.includes('UNIQUE')) {
    return null
  }

  throw error
}
