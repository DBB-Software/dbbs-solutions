import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { AuthError } from '@dbbs/common'
import { StripeService } from '@dbbs/nestjs-module-stripe'

@Injectable()
export class StripeWebhookGuard implements CanActivate {
  constructor(private readonly stripeService: StripeService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()

    try {
      request.event = this.stripeService.verifyWebhookSignature(request.rawBody, request.headers)
      return true
    } catch (err) {
      throw new AuthError((err as Error)?.message)
    }
  }
}
