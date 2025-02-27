import { Injectable } from '@nestjs/common'
import { MetabaseGuard } from './metabase.guard.js'

@Injectable()
export class CollectionGuard extends MetabaseGuard {
  async checkAccess(): Promise<boolean> {
    // return this.appService.hasAccessToCollection(collectionId, organizationsNames)
    return true
  }
}
