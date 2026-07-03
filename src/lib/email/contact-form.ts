import "server-only";

export interface ContactFormEmailProps {
  name: string;
  email: string;
  message: string;
}

export function contactFormSubject(name: string) {
  return `New contact form message from ${name}`;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Internal ops notification — plainer than the guest-facing templates on purpose. */
export function contactFormEmail({ name, email, message }: ContactFormEmailProps): string {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);
  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>New contact message</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f1ea; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1ea;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%; background-color:#ffffff; border-radius:6px; border:1px solid #E9E2D6;">
          <tr>
            <td style="padding: 28px 32px 8px;">
              <p style="margin:0 0 4px; font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color:#B8933F;">LUMA Contact Form</p>
              <h1 style="margin:0; font-family: Georgia, 'Times New Roman', serif; font-weight:400; font-size:20px; color:#0B0F14;">New message</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E9E2D6;">
                <tr>
                  <td style="padding:14px 0 4px; font-size:13px; color:#6b6259;">From</td>
                </tr>
                <tr>
                  <td style="padding:0 0 14px; font-size:14px; color:#0B0F14;">${safeName} &lt;${safeEmail}&gt;</td>
                </tr>
                <tr>
                  <td style="padding:0 0 4px; font-size:13px; color:#6b6259; border-top:1px solid #E9E2D6; padding-top:14px;">Message</td>
                </tr>
                <tr>
                  <td style="padding:0 0 20px; font-size:14px; line-height:22px; color:#0B0F14; white-space:pre-wrap;">${safeMessage}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
