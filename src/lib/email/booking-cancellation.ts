import "server-only";

export interface BookingCancellationEmailProps {
  listingTitle: string;
  listingImage: string;
  listingCity: string;
  checkIn: string;
  checkOut: string;
  reason?: string;
  siteUrl: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function bookingCancellationSubject(listingTitle: string) {
  return `Your reservation at ${listingTitle} has been cancelled — LUMA`;
}

export function bookingCancellationEmail({
  listingTitle,
  listingImage,
  listingCity,
  checkIn,
  checkOut,
  reason,
  siteUrl,
}: BookingCancellationEmailProps): string {
  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Reservation cancelled</title>
</head>
<body style="margin:0; padding:0; background-color:#EFE8E0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#EFE8E0;">
    <tr>
      <td align="center" style="padding: 48px 16px;">
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px; width:100%; background-color:#FAF1F2; border-radius:6px; overflow:hidden; border:1px solid #E9E2D6;">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#0B0F14; padding: 40px 24px 32px;">
              <div style="font-family: Georgia, 'Times New Roman', serif; font-size:26px; letter-spacing:7px; color:#D4AF37; font-weight:400;">
                LUMA
              </div>
              <div style="margin-top:10px; font-size:10px; letter-spacing:2.5px; text-transform:uppercase; color:rgba(250,241,242,0.55);">
                Curated Stays &middot; Extraordinary Moments
              </div>
            </td>
          </tr>

          <!-- Cancellation banner -->
          <tr>
            <td align="center" style="padding: 32px 40px 8px;">
              <div style="display:inline-block; padding:5px 14px; border:1px solid #9a8f85; border-radius:20px; font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color:#6b6259; margin-bottom:18px;">
                Reservation Cancelled
              </div>
              <h1 style="margin:0 0 6px; font-family: Georgia, 'Times New Roman', serif; font-weight:400; font-size:22px; color:#0B0F14;">
                Your stay has been cancelled
              </h1>
              <p style="margin:0; font-size:14px; line-height:22px; color:#4a423c;">
                ${reason ? reason : "This reservation is no longer on the calendar. If you have questions, reply to this email."}
              </p>
            </td>
          </tr>

          <!-- Listing image -->
          <tr>
            <td style="padding: 24px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <img src="${listingImage}" alt="${listingTitle}" width="440" style="width:100%; max-width:440px; height:auto; border-radius:4px; display:block; opacity:0.6;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Listing details -->
          <tr>
            <td style="padding: 20px 40px 0;">
              <p style="margin:0 0 2px; font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color:#B8933F;">${listingCity}</p>
              <h2 style="margin:0; font-family: Georgia, 'Times New Roman', serif; font-weight:400; font-size:19px; color:#0B0F14; text-decoration:line-through; text-decoration-color:#9a8f85;">${listingTitle}</h2>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E9E2D6; border-bottom:1px solid #E9E2D6;">
                <tr>
                  <td style="padding:16px 0; width:50%;">
                    <p style="margin:0 0 3px; font-size:10px; letter-spacing:1px; text-transform:uppercase; color:#9a8f85;">Check-in</p>
                    <p style="margin:0; font-size:14px; color:#0B0F14;">${formatDate(checkIn)}</p>
                  </td>
                  <td style="padding:16px 0; width:50%;">
                    <p style="margin:0 0 3px; font-size:10px; letter-spacing:1px; text-transform:uppercase; color:#9a8f85;">Check-out</p>
                    <p style="margin:0; font-size:14px; color:#0B0F14;">${formatDate(checkOut)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding: 32px 40px 8px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="border-radius:3px; background-color:#D4AF37;">
                    <a href="${siteUrl}/search" target="_blank"
                      style="display:inline-block; padding:15px 34px; font-size:12px; letter-spacing:1.5px; text-transform:uppercase; font-weight:600; color:#0B0F14; text-decoration:none;">
                      Browse Other Stays
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 28px 40px 36px; border-top:1px solid #E9E2D6; margin-top:24px;">
              <p style="margin:0; font-size:11px; letter-spacing:0.4px; color:#a39a90;">
                LUMA &middot; Curated Stays. Extraordinary Moments.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
