import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { SendgridService } from './sendgrid.service.js'

/**
 * The SendgridModule is a NestJS module that encapsulates the functionality for sending emails via SendGrid.
 * It imports the `ConfigModule` to retrieve the SendGrid API key from the application configuration.
 * The module provides and exports the `SendgridService`, allowing other parts of the application to send emails.
 *
 * @module SendgridModule
 */
@Module({
  imports: [ConfigModule],
  providers: [SendgridService],
  exports: [SendgridService]
})
export class SendgridModule {}
