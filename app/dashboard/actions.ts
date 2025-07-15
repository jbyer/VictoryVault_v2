"use server"

// Mock database for campaigns with status tracking
const mockCampaigns = [
  {
    id: "campaign-1",
    title: "Elect Sarah Johnson for Congress",
    status: "active" as "active" | "paused" | "deleted",
    donations: "$15,000",
    progress: "30%",
    createdAt: "2024-01-15",
    pausedAt: null,
    deletedAt: null,
  },
  {
    id: "campaign-2",
    title: "Protect Our Second Amendment Rights",
    status: "active" as "active" | "paused" | "deleted",
    donations: "$8,000",
    progress: "50%",
    createdAt: "2024-01-10",
    pausedAt: null,
    deletedAt: null,
  },
  {
    id: "campaign-3",
    title: "Support Local Veterans Programs",
    status: "paused" as "active" | "paused" | "deleted",
    donations: "$3,500",
    progress: "15%",
    createdAt: "2024-01-05",
    pausedAt: "2024-01-20",
    deletedAt: null,
  },
]

export async function getCampaigns() {
  await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate network delay
  return mockCampaigns
}

export async function pauseCampaign(campaignId: string): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

  const campaign = mockCampaigns.find((c) => c.id === campaignId)
  if (!campaign) {
    return { success: false, message: "Campaign not found" }
  }

  if (campaign.status === "deleted") {
    return { success: false, message: "Cannot pause a deleted campaign" }
  }

  campaign.status = "paused"
  campaign.pausedAt = new Date().toISOString().split("T")[0]

  return { success: true, message: "Campaign paused successfully" }
}

export async function resumeCampaign(campaignId: string): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

  const campaign = mockCampaigns.find((c) => c.id === campaignId)
  if (!campaign) {
    return { success: false, message: "Campaign not found" }
  }

  if (campaign.status === "deleted") {
    return { success: false, message: "Cannot resume a deleted campaign" }
  }

  campaign.status = "active"
  campaign.pausedAt = null

  return { success: true, message: "Campaign resumed successfully" }
}

export async function deleteCampaign(campaignId: string): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

  const campaign = mockCampaigns.find((c) => c.id === campaignId)
  if (!campaign) {
    return { success: false, message: "Campaign not found" }
  }

  campaign.status = "deleted"
  campaign.deletedAt = new Date().toISOString().split("T")[0]

  return { success: true, message: "Campaign deleted successfully" }
}

export async function restoreCampaign(campaignId: string): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

  const campaign = mockCampaigns.find((c) => c.id === campaignId)
  if (!campaign) {
    return { success: false, message: "Campaign not found" }
  }

  if (campaign.status !== "deleted") {
    return { success: false, message: "Campaign is not deleted" }
  }

  campaign.status = "active"
  campaign.deletedAt = null

  return { success: true, message: "Campaign restored successfully" }
}
