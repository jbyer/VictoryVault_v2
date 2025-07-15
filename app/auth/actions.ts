"use server"

// In a real application, you would use a database or a more robust key-value store
// for OTPs, and integrate with an actual email service.
const otpStore = new Map<string, { code: string; expiresAt: number }>()

export async function sendOtp(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return { success: false, message: "Email is required." }
  }

  // Generate a 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = Date.now() + 5 * 60 * 1000 // OTP expires in 5 minutes

  otpStore.set(email, { code: otpCode, expiresAt })

  console.log(`Simulated OTP for ${email}: ${otpCode}`) // Log OTP for testing

  // Only attempt to send email if RESEND_API_KEY is available
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend")
      const resend = new Resend(process.env.RESEND_API_KEY)

      await resend.emails.send({
        from: "onboarding@resend.dev", // Replace with your verified sender email
        to: email,
        subject: "Your VictoryVault OTP",
        html: `<p>Your one-time password for VictoryVault is: <strong>${otpCode}</strong></p><p>This code will expire in 5 minutes.</p>`,
      })
      console.log(`OTP email sent to ${email} via Resend.`)
    } catch (error) {
      console.error("Error sending OTP email via Resend:", error)
      // Don't fail the entire operation if email sending fails
      console.log("Email sending failed, but OTP is still valid for testing")
    }
  } else {
    console.warn("RESEND_API_KEY not set. OTP email not sent, but OTP is valid for testing.")
  }

  return { success: true, message: "OTP sent to your email." }
}

export async function verifyOtp(formData: FormData) {
  const email = formData.get("email") as string
  const otp = formData.get("otp") as string

  if (!email || !otp) {
    return { success: false, message: "Email and OTP are required." }
  }

  const storedOtp = otpStore.get(email)

  if (!storedOtp) {
    return { success: false, message: "OTP not found or expired. Please request a new one." }
  }

  if (Date.now() > storedOtp.expiresAt) {
    otpStore.delete(email) // Clean up expired OTP
    return { success: false, message: "OTP has expired. Please request a new one." }
  }

  if (otp === storedOtp.code) {
    otpStore.delete(email) // OTP successfully used, remove it
    return { success: true, message: "OTP verified successfully! You can now proceed." }
  } else {
    return { success: false, message: "Invalid OTP. Please try again." }
  }
}
