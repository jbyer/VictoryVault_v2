"use client"

import { useState, useActionState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { sendOtp, verifyOtp } from "../actions"
import Link from "next/link"

export default function OtpLoginPage() {
  const [email, setEmail] = useState("")
  const [step, setStep] = useState<"email_input" | "otp_input" | "success">("email_input")

  const [sendOtpState, sendOtpAction, isSendingOtp] = useActionState(sendOtp, null)
  const [verifyOtpState, verifyOtpAction, isVerifyingOtp] = useActionState(verifyOtp, null)

  const handleEmailSubmit = async (formData: FormData) => {
    const currentEmail = formData.get("email") as string
    setEmail(currentEmail)
    await sendOtpAction(formData)
    if (sendOtpState?.success) {
      setStep("otp_input")
    }
  }

  const handleOtpSubmit = async (formData: FormData) => {
    // Append email to formData for verification
    formData.append("email", email)
    await verifyOtpAction(formData)
    if (verifyOtpState?.success) {
      setStep("success")
      // In a real app, you would redirect the user here
      // router.push('/admin');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Login with OTP</CardTitle>
          <CardDescription>
            {step === "email_input" && "Enter your email to receive a one-time password."}
            {step === "otp_input" && `Enter the 6-digit code sent to ${email}.`}
            {step === "success" && "You have successfully logged in!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email_input" && (
            <form action={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              {sendOtpState && !sendOtpState.success && (
                <p className="text-sm text-red-500" aria-live="polite">
                  {sendOtpState.message}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={isSendingOtp}>
                {isSendingOtp ? "Sending OTP..." : "Send OTP"}
              </Button>
              <div className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link href="/register" className="font-medium text-blue-600 hover:underline">
                  Register
                </Link>
              </div>
            </form>
          )}

          {step === "otp_input" && (
            <form action={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password</Label>
                <Input id="otp" name="otp" type="text" placeholder="******" maxLength={6} required />
              </div>
              {verifyOtpState && !verifyOtpState.success && (
                <p className="text-sm text-red-500" aria-live="polite">
                  {verifyOtpState.message}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={isVerifyingOtp}>
                {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button
                type="button"
                variant="link"
                className="w-full"
                onClick={() => setStep("email_input")}
                disabled={isVerifyingOtp}
              >
                Resend OTP or Change Email
              </Button>
            </form>
          )}

          {step === "success" && (
            <div className="text-center space-y-4">
              <p className="text-lg font-semibold text-green-600">{verifyOtpState?.message}</p>
              <Link href="/admin" className="font-medium text-blue-600 hover:underline">
                Go to Admin Dashboard
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
