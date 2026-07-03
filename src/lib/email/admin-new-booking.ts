import "server-only";

export interface AdminNewBookingEmailProps {
  listingTitle: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  currency: string;
  adminBookingUrl: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function adminNewBookingSubject(listingTitle: string) {
  return `New reservation — ${listingTitle}`;
}

/** Internal ops notification — plainer than the guest-facing templates on purpose. */
export function adminNewBookingEmail({
  listingTitle,
  guestName,
  guestEmail,
  checkIn,
  checkOut,
  guests,
  total,
  currency,
  adminBookingUrl,
}: AdminNewBookingEmailProps): string {
  const safeListingTitle = escapeHtml(listingTitle);
  const safeGuestName = escapeHtml(guestName);
  const safeGuestEmail = escapeHtml(guestEmail);
  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>New reservation</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f1ea; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1ea;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%; background-color:#ffffff; border-radius:6px; border:1px solid #E9E2D6;">
          <tr>
            <td style="padding: 28px 32px 8px;">
              <p style="margin:0 0 4px; font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color:#B8933F;">LUMA Operations</p>
              <h1 style="margin:0; font-family: Georgia, 'Times New Roman', serif; font-weight:400; font-size:20px; color:#0B0F14;">New reservation</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E9E2D6; border-bottom:1px solid #E9E2D6;">
                <tr>
                  <td style="padding:14px 0; font-size:13px; color:#6b6259;">Property</td>
                  <td align="right" style="padding:14px 0; font-size:13px; color:#0B0F14;">${safeListingTitle}</td>
                </tr>
                <tr>
                  <td style="padding:0 0 14px; font-size:13px; color:#6b6259;">Guest</td>
                  <td align="right" style="padding:0 0 14px; font-size:13px; color:#0B0F14;">${safeGuestName} (${safeGuestEmail})</td>
                </tr>
                <tr>
                  <td style="padding:0 0 14px; font-size:13px; color:#6b6259;">Dates</td>
                  <td align="right" style="padding:0 0 14px; font-size:13px; color:#0B0F14;">${formatDate(checkIn)} &ndash; ${formatDate(checkOut)}</td>
                </tr>
                <tr>
                  <td style="padding:0 0 14px; font-size:13px; color:#6b6259;">Guests</td>
                  <td align="right" style="padding:0 0 14px; font-size:13px; color:#0B0F14;">${guests}</td>
                </tr>
                <tr>
                  <td style="padding:0 0 14px; font-size:13px; font-weight:600; color:#0B0F14;">Total</td>
                  <td align="right" style="padding:0 0 14px; font-size:13px; font-weight:600; color:#0B0F14;">${total.toLocaleString("en-US")} ${currency}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 24px 32px 32px;">
              <a href="${adminBookingUrl}" target="_blank" style="display:inline-block; padding:12px 28px; font-size:12px; letter-spacing:1px; text-transform:uppercase; font-weight:600; color:#ffffff; background-color:#0B0F14; border-radius:3px; text-decoration:none;">
                View in dashboard
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
