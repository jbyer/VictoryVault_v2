"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CampaignForm, type CampaignData } from "@/components/campaign-form"
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

// Mock server action for creating a campaign
async function createCampaign(data: CampaignData): Promise<{ success: boolean; message: string }> {
  console.log("Creating campaign with data:", data)
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
  if (data.title.includes("fail")) {
    throw new Error("Campaign creation failed due to 'fail' in title.")
  }
  return { success: true, message: "Campaign created successfully!" }
}

export default function CreateCampaignPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (data: CampaignData) => {
    setIsSaving(true)
    setMessage(null)
    try {
      const result = await createCampaign(data)
      setMessage({ type: "success", text: result.message })
      // Optionally redirect or clear form after success
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "An unknown error occurred." })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Campaign</h1>
          <p className="text-gray-600">Set up your new political campaign with all the necessary details.</p>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span>{message.text}</span>
          </div>
        )}

        <CampaignForm onSubmit={handleSubmit} isSaving={isSaving} />
      </div>

      <Footer />
    </div>
  )
}
