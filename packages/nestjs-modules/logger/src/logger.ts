import { Injectable, Scope } from '@nestjs/common'
import { PinoLogger } from 'nestjs-pino'

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends PinoLogger {}
