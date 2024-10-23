export function getSendOrganizationInviteTemplate({ organizationName, recipientEmail, acceptInviteLink }) {
  return {
    Body: {
      Html: {
        Charset: 'UTF-8',
        Data: '<h1>DBB Software</h1>'
      },
      Text: {
        Charset: 'UTF-8',
        Data: `
        You were invited to join ${organizationName} team
        Click the link below to accept
        ${acceptInviteLink}
      `
      }
    },
    Subject: {
      Charset: 'UTF-8',
      Data: `Hi ${recipientEmail}!`
    }
  }
}
