import { SendEmailInput } from '@dbbs/nestjs-module-sendgrid'

interface AuthorizedUserEmailTemplateParams {
  acceptInviteLink: string
  recipientEmail: string
  organizationName: string
}

interface UnAuthorizedUserEmailTemplateParams {
  recipientEmail: string
  organizationName: string
}

export const emailToAuthorizedUserTemplate = ({
  organizationName,
  acceptInviteLink,
  recipientEmail
}: AuthorizedUserEmailTemplateParams): SendEmailInput => ({
  to: recipientEmail,
  subject: 'DBB-Software',
  text: `<h3>Hi ${recipientEmail}!</h3>
  <p>You were invited to join ${organizationName} team. Click the link below to accept ${acceptInviteLink} </p>`
})

export const emailToUnAuthorizedUserTemplate = ({
  organizationName,
  recipientEmail
}: UnAuthorizedUserEmailTemplateParams): SendEmailInput => ({
  to: recipientEmail,
  subject: 'DBB-Software',
  html: `<h3>Hi ${recipientEmail}!</h3>
  <p>You were invited to join ${organizationName} team Register before accepting the invite</p>`
})
