"use server";

import { z } from "zod";
import { getResendClient, EMAIL_FROM } from "@/lib/email/client";
import { contactFormEmail, contactFormSubject } from "@/lib/email/contact-form";
import { checkRateLimit, rateLimitMessage } from "@/lib/rate-limit";

export type ContactFormState = { error?: string; success?: boolean } | undefined;

const CONTACT_RECIPIENT = process.env.ADMIN_NOTIFICATION_EMAIL || "hello@luma.stays";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.email("Please enter a valid email."),
  message: z.string().trim().min(10, "Please share a few more details."),
});

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details." };
  }

  const limit = await checkRateLimit(parsed.data.email, "contact-form", { max: 5, windowMinutes: 60 });
  if (!limit.allowed) return { error: rateLimitMessage("message", limit) };

  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: EMAIL_FROM,
      to: CONTACT_RECIPIENT,
      replyTo: parsed.data.email,
      subject: contactFormSubject(parsed.data.name),
      html: contactFormEmail(parsed.data),
    });
  } catch (emailError) {
    console.error("Failed to send contact form email:", emailError);
    return { error: "Something went wrong sending your message. Please try again." };
  }

  return { success: true };
}
