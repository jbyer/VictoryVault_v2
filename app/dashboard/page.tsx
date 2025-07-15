"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import {
  Plus,
  DollarSign,
  TrendingUp,
  Target,
  Edit,
  Eye,
  Share2,
  Settings,
  Pause,
  Play,
  Trash2,
  RotateCcw,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { getCampaigns, pauseCampaign, resumeCampaign, deleteCampaign, restoreCampaign } from "./actions"
import { useToast } from "@/hooks/use-toast"

interface Campaign {
  id: string
  title: string
  status: "active" | "paused" | "deleted"
  donations: string
  progress: string
  createdAt: string
  pausedAt: string | null
  deletedAt: string | null
}

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    description: string
    confirmText: string
    confirmVariant: "default" | "destructive"
    action: () => void
  }>({
    isOpen: false,
    title: "",
    description: "",
    confirmText: "",
    confirmVariant: "default",
    action: () => {},
  })

  const { toast } = useToast()

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    try {
      const data = await getCampaigns()
      setCampaigns(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load campaigns",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePauseCampaign = async (campaignId: string, title: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Pause Campaign",
      description: `Are you sure you want to pause "${title}"? This will temporarily stop all donations and hide the campaign from public view.`,
      confirmText: "Pause Campaign",
      confirmVariant: "default",
      action: async () => {
        setActionLoading(campaignId)
        try {
          const result = await pauseCampaign(campaignId)
          if (result.success) {
            toast({
              title: "Success",
              description: result.message,
            })
            await loadCampaigns()
          } else {
            toast({
              title: "Error",
              description: result.message,
              variant: "destructive",
            })
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to pause campaign",
            variant: "destructive",
          })
        } finally {
          setActionLoading(null)
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
        }
      },
    })
  }

  const handleResumeCampaign = async (campaignId: string, title: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Resume Campaign",
      description: `Are you sure you want to resume "${title}"? This will reactivate the campaign and make it visible to donors.`,
      confirmText: "Resume Campaign",
      confirmVariant: "default",
      action: async () => {
        setActionLoading(campaignId)
        try {
          const result = await resumeCampaign(campaignId)
          if (result.success) {
            toast({
              title: "Success",
              description: result.message,
            })
            await loadCampaigns()
          } else {
            toast({
              title: "Error",
              description: result.message,
              variant: "destructive",
            })
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to resume campaign",
            variant: "destructive",
          })
        } finally {
          setActionLoading(null)
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
        }
      },
    })
  }

  const handleDeleteCampaign = async (campaignId: string, title: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Campaign",
      description: `Are you sure you want to delete "${title}"? This action will remove the campaign from public view but can be restored later if needed.`,
      confirmText: "Delete Campaign",
      confirmVariant: "destructive",
      action: async () => {
        setActionLoading(campaignId)
        try {
          const result = await deleteCampaign(campaignId)
          if (result.success) {
            toast({
              title: "Success",
              description: result.message,
            })
            await loadCampaigns()
          } else {
            toast({
              title: "Error",
              description: result.message,
              variant: "destructive",
            })
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete campaign",
            variant: "destructive",
          })
        } finally {
          setActionLoading(null)
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
        }
      },
    })
  }

  const handleRestoreCampaign = async (campaignId: string, title: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Restore Campaign",
      description: `Are you sure you want to restore "${title}"? This will reactivate the campaign and make it visible to donors.`,
      confirmText: "Restore Campaign",
      confirmVariant: "default",
      action: async () => {
        setActionLoading(campaignId)
        try {
          const result = await restoreCampaign(campaignId)
          if (result.success) {
            toast({
              title: "Success",
              description: result.message,
            })
            await loadCampaigns()
          } else {
            toast({
              title: "Error",
              description: result.message,
              variant: "destructive",
            })
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to restore campaign",
            variant: "destructive",
          })
        } finally {
          setActionLoading(null)
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
        }
      },
    })
  }

  const getStatusBadge = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Active
          </span>
        )
      case "paused":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Paused
          </span>
        )
      case "deleted":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Deleted
          </span>
        )
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Unknown
          </span>
        )
    }
  }

  const getActionButtons = (campaign: Campaign) => {
    const isLoading = actionLoading === campaign.id

    if (campaign.status === "deleted") {
      return (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRestoreCampaign(campaign.id, campaign.title)}
            disabled={isLoading}
            className="text-green-600 hover:text-green-700 border-green-300 hover:bg-green-50 bg-transparent"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            {isLoading ? "..." : "Restore"}
          </Button>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-end space-x-2">
        {campaign.status === "active" && (
          <>
            <Link href={`/dashboard/edit-campaign/${campaign.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50 bg-transparent"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-700 bg-transparent">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700 bg-transparent">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePauseCampaign(campaign.id, campaign.title)}
              disabled={isLoading}
              className="text-yellow-600 hover:text-yellow-700 border-yellow-300 hover:bg-yellow-50 bg-transparent"
            >
              <Pause className="h-4 w-4 mr-1" />
              {isLoading ? "..." : "Pause"}
            </Button>
          </>
        )}

        {campaign.status === "paused" && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleResumeCampaign(campaign.id, campaign.title)}
              disabled={isLoading}
              className="text-green-600 hover:text-green-700 border-green-300 hover:bg-green-50 bg-transparent"
            >
              <Play className="h-4 w-4 mr-1" />
              {isLoading ? "..." : "Resume"}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDeleteCampaign(campaign.id, campaign.title)}
          disabled={isLoading}
          className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50 bg-transparent"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {isLoading ? "..." : "Delete"}
        </Button>
      </div>
    )
  }

  // Calculate stats based on campaign status
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length
  const pausedCampaigns = campaigns.filter((c) => c.status === "paused").length
  const deletedCampaigns = campaigns.filter((c) => c.status === "deleted").length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading campaigns...</div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's an overview of your campaigns and activities.</p>
          </div>
          <Link href="/dashboard/create-campaign">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create New Campaign
            </Button>
          </Link>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCampaigns}</div>
              <p className="text-xs text-gray-500">Currently running</p>
            </CardContent>
          </Card>
          <Card className="border-yellow-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paused Campaigns</CardTitle>
              <Pause className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pausedCampaigns}</div>
              <p className="text-xs text-gray-500">Temporarily halted</p>
            </CardContent>
          </Card>
          <Card className="border-red-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deleted Campaigns</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deletedCampaigns}</div>
              <p className="text-xs text-gray-500">Can be restored</p>
            </CardContent>
          </Card>
          <Card className="border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$26,500</div>
              <p className="text-xs text-gray-500">Across all campaigns</p>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns Table */}
        <Card className="mb-8 border-red-100">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">All Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Campaign Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Donations
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Progress
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className={campaign.status === "deleted" ? "opacity-60" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {campaign.title}
                        {campaign.status === "deleted" && <span className="ml-2 text-xs text-red-500">(Deleted)</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getStatusBadge(campaign.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.donations}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.progress}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {getActionButtons(campaign)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/dashboard/create-campaign">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center text-blue-600 border-blue-300 hover:bg-blue-50 bg-transparent"
              >
                <Plus className="h-6 w-6 mb-2" />
                <span>Create New Campaign</span>
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center text-purple-600 border-purple-300 hover:bg-purple-50 bg-transparent"
              >
                <Settings className="h-6 w-6 mb-2" />
                <span>Account Settings</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full h-24 flex flex-col items-center justify-center text-green-600 border-green-300 hover:bg-green-50 bg-transparent"
            >
              <TrendingUp className="h-6 w-6 mb-2" />
              <span>View Analytics</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.action}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmText={confirmDialog.confirmText}
        confirmVariant={confirmDialog.confirmVariant}
        isLoading={actionLoading !== null}
      />
    </div>
  )
}
