import { json } from "express";
import { ApiError } from "./ApiError.js";

const sendemail = async (options) => {
      try {
            const BREVO_API_KEY = process.env.BREVO_API_KEY?.trim();
            
            if (!BREVO_API_KEY) {
                  console.log("Missing BREVO_API_KEY in the .env files")
                  throw new ApiError(400,"Missing Email api key")
            }
           
            const data = {
                  sender: {
                        name: "Real State Platform",
                        email: process.env.EMAIL_USER
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
            }
            else {
                  console.error("Brevo api key error")
                  throw new ApiError(500,result.message ||"couldn't send email by Brevo")
            }

      } catch (error) {
            console.error("Brevo Email Eror")
            throw new ApiError(500,"couldn't send email by Brevo")
      }
      
}

export { sendemail }


// Check API key
// Prepare email
// Call Brevo API
// Send email
// Return success OR throw error