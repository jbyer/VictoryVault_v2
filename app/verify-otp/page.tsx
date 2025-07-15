"use client"

import { Label } from "@/components/ui/label"
import { useState, useEffect, useActionState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft, RotateCcw } from "lucide-react"
import { OtpInput } from "@/components/otp-input"
import { sendOtp, verifyOtp } from "../auth/actions"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function OtpVerificationPage() {
  const searchParams = useSearchParams()
  const initialEmail = searchParams.get("email") || "your email" // Get email from query param
  const [email, setEmail] = useState(initialEmail)
  const [otp, setOtp] = useState("")
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(true)
  const [isResending, setIsResending] = useState(false)

  const [verifyOtpState, verifyOtpAction, isVerifyingOtp] = useActionState(verifyOtp, null)
  const [sendOtpState, sendOtpAction, isSendingOtp] = useActionState(sendOtp, null)

  useEffect(() => {
    if (!isTimerActive) return

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setIsTimerActive(false)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isTimerActive])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleResendOtp = async () => {
    setIsResending(true)
    const formData = new FormData()
    formData.append("email", email)
    await sendOtpAction(formData)
    setIsResending(false)
    setTimeLeft(300) // Reset timer to 5 minutes
    setIsTimerActive(true)
    setOtp("") // Clear OTP input
  }

  const handleVerifyOtp = async (formData: FormData) => {
    formData.append("email", email) // Ensure email is part of the form data
    formData.append("otp", otp) // Ensure OTP is part of the form data
    await verifyOtpAction(formData)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md p-6 space-y-6">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold">Verify Your Account</CardTitle>
            <CardDescription className="text-gray-600">
              We've sent a verification code to your email address. Please enter it below to complete your sign in.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center gap-2 rounded-lg bg-blue-50/50 px-4 py-3 text-blue-600 border border-blue-200">
              <Mail className="h-5 w-5" />
              <span className="font-medium">Code sent to: {email}</span>
            </div>

            <form action={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2 text-center">
                <Label htmlFor="otp" className="text-base font-medium">
                  Enter 6-digit verification code
                </Label>
                <OtpInput value={otp} onChange={setOtp} length={6} disabled={isVerifyingOtp} />
                <p className="text-sm text-gray-500">
                  Code expires in: <span className="font-semibold">{formatTime(timeLeft)}</span>
                </p>
              </div>

              {verifyOtpState && !verifyOtpState.success && (
                <p className="text-sm text-red-500 text-center" aria-live="polite">
                  {verifyOtpState.message}
                </p>
              )}
              {sendOtpState && sendOtpState.success && isSendingOtp && (
                <p className="text-sm text-green-600 text-center" aria-live="polite">
                  {sendOtpState.message}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold"
                disabled={isVerifyingOtp || otp.length !== 6}
              >
                {isVerifyingOtp ? "Verifying..." : "Verify & Sign In"}
              </Button>
            </form>

            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">Didn't receive the code?</p>
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                onClick={handleResendOtp}
                disabled={isResending || isSendingOtp || isTimerActive} // Disable if timer is active or already sending
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                {isResending || isSendingOtp ? "Resending..." : "Resend Code"}
              </Button>
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </div>

            <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600 border border-gray-200 text-center">
              Demo: Use code "123456" to verify, or any other 6-digit code to test error handling.
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
