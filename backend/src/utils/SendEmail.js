import { ApiError } from "./ApiError.js";

const getEnvValue = (...keys) => {
      for (const key of keys) {
            const value = process.env[key];
            if (typeof value === "string" && value.trim()) return value.trim();
      }

      for (const [envKey, value] of Object.entries(process.env || {})) {
            const normalized = envKey.toUpperCase();
            const match = keys.some((key) => key.toUpperCase() === normalized);
            if (match && typeof value === "string" && value.trim()) {
                  return value.trim();
            }
      }

      return undefined;
};

export const getBrevoSenderEmail = () =>
      getEnvValue("BREVO_SENDER_EMAIL", "brevo_sender_email", "EMAIL_USER", "email_user");

const sendemail = async (options) => {
      try {
            const BREVO_API_KEY = getEnvValue("BREVO_API_KEY", "brevo_api_key");
            const senderEmail = getBrevoSenderEmail();

            if (!BREVO_API_KEY) {
                  console.log("Missing BREVO_API_KEY in the .env files")
                  throw new ApiError(400, "Missing Email api key")
            }

            if (!senderEmail) {
                  console.log("Missing sender email in the .env files")
                  throw new ApiError(400, "Missing sender email")
            }

            const data = {
                  sender: {
                        name: "Real State Platform",
                        email: senderEmail
                  },
                  to: [{ email: options.email }],
                  subject: options.subject,
                  htmlContent: options.message
            }

            const response = await fetch("https://api.brevo.com/v3/smtp/email", {
                  method: "POST",
                  headers: {
                        "api-key": BREVO_API_KEY,
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                  },
                  body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                  console.log("Email send successfully by Brevo", result.messageId);
                  return result;
            }

            console.error("Brevo API rejected the email request:", result);
            throw new ApiError(500, result.message || "couldn't send email by Brevo");

      } catch (error) {
            console.error("Brevo Email Error:", error?.message || error);
            throw new ApiError(500, error?.message || "couldn't send email by Brevo");
      }
}

export { sendemail }


// Check API key
// Prepare email
// Call Brevo API
// Send email
// Return success OR throw error