"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye, Play, Pause, Trash2, Search, Plus, DollarSign, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

interface CampaignData {
  id: string
  title: string
  creatorName: string
  creatorEmail: string
  status: "active" | "paused" | "deleted"
  goalAmount: number
  raisedAmount: number
  donorCount: number
  createdAt: string
  endDate: string
  category: string
}

export default function CampaignManagementPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignData | null>(null)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"pause" | "activate" | "delete" | "restore">("pause")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewCampaignDialogOpen, setViewCampaignDialogOpen] = useState(false)

  // Mock data - in real app, this would come from database
  const [campaigns, setCampaigns] = useState<CampaignData[]>([
    {
      id: "1",
      title: "Support Conservative Values in Education",
      creatorName: "John Smith",
      creatorEmail: "john.smith@example.com",
      status: "active",
      goalAmount: 50000,
      raisedAmount: 32500,
      donorCount: 145,
      createdAt: "2024-01-15",
      endDate: "2024-03-15",
      category: "Education",
    },
    {
      id: "2",
      title: "Defend Second Amendment Rights",
      creatorName: "Sarah Johnson",
      creatorEmail: "sarah.johnson@example.com",
      status: "active",
      goalAmount: 75000,
      raisedAmount: 68200,
      donorCount: 289,
      createdAt: "2024-01-10",
      endDate: "2024-02-28",
      category: "Rights & Freedoms",
    },
    {
      id: "3",
      title: "Border Security Initiative",
      creatorName: "Mike Wilson",
      creatorEmail: "mike.wilson@example.com",
      status: "paused",
      goalAmount: 100000,
      raisedAmount: 45800,
      donorCount: 198,
      createdAt: "2024-01-05",
      endDate: "2024-04-01",
      category: "Security",
    },
  ])

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.creatorName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCampaignAction = (campaign: CampaignData, action: "pause" | "activate" | "delete" | "restore") => {
    setSelectedCampaign(campaign)
    setActionType(action)
    setActionDialogOpen(true)
  }

  const executeCampaignAction = () => {
    if (!selectedCampaign) return

    let newStatus: "active" | "paused" | "deleted"
    let message: string

    switch (actionType) {
      case "pause":
        newStatus = "paused"
        message = "Campaign paused successfully"
        break
      case "activate":
        newStatus = "active"
        message = "Campaign activated successfully"
        break
      case "delete":
        newStatus = "deleted"
        message = "Campaign deleted successfully"
        break
      case "restore":
        newStatus = "active"
        message = "Campaign restored successfully"
        break
    }

    setCampaigns((prev) =>
      prev.map((campaign) => (campaign.id === selectedCampaign.id ? { ...campaign, status: newStatus } : campaign)),
    )

    toast.success(message)
    setActionDialogOpen(false)
    setSelectedCampaign(null)
  }

  const viewCampaignDetails = (campaign: CampaignData) => {
    setSelectedCampaign(campaign)
    setViewCampaignDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active
          </Badge>
        )
      case "paused":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Paused
          </Badge>
        )
      case "deleted":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Deleted
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getActionButtons = (campaign: CampaignData) => {
    switch (campaign.status) {
      case "active":
        return (
          <>
            <Button size="sm" variant="outline" onClick={() => handleCampaignAction(campaign, "pause")}>
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleCampaignAction(campaign, "delete")}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </>
        )
      case "paused":
        return (
          <>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleCampaignAction(campaign, "activate")}
            >
              <Play className="h-4 w-4 mr-1" />
              Activate
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleCampaignAction(campaign, "delete")}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </>
        )
      case "deleted":
        return (
          <Button size="sm" variant="outline" onClick={() => handleCampaignAction(campaign, "restore")}>
            <Play className="h-4 w-4 mr-1" />
            Restore
          </Button>
        )
    }
  }

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back to Dashboard Link */}
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaign Management</h1>
          <p className="text-gray-600 mt-1">Manage all campaigns across the platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export Campaigns
          </Button>
          <Button size="sm" className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-1" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Campaigns</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by title or creator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign List */}
      <div className="grid gap-4">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{campaign.title}</h3>
                    {getStatusBadge(campaign.status)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">Creator:</span> {campaign.creatorName}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {campaign.category}
                    </div>
                    <div>
                      <span className="font-medium">End Date:</span> {new Date(campaign.endDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Progress</span>
                      <span>{getProgressPercentage(campaign.raisedAmount, campaign.goalAmount).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(campaign.raisedAmount, campaign.goalAmount)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Raised:</span> ${campaign.raisedAmount.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Goal:</span> ${campaign.goalAmount.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Donors:</span> {campaign.donorCount}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => viewCampaignDetails(campaign)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  {getActionButtons(campaign)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{actionType.charAt(0).toUpperCase() + actionType.slice(1)} Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionType} "{selectedCampaign?.title}"?
              {actionType === "delete" && " This action will hide the campaign but can be reversed."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={executeCampaignAction}
              className={
                actionType === "delete"
                  ? "bg-red-600 hover:bg-red-700"
                  : actionType === "activate" || actionType === "restore"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-orange-600 hover:bg-orange-700"
              }
            >
              {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Campaign Details Dialog */}
      <Dialog open={viewCampaignDialogOpen} onOpenChange={setViewCampaignDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Campaign Details</DialogTitle>
            <DialogDescription>Detailed information about this campaign</DialogDescription>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-4">
              <div>
                <Label className="font-medium">Campaign Title</Label>
                <p className="text-sm text-gray-600">{selectedCampaign.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Creator</Label>
                  <p className="text-sm text-gray-600">{selectedCampaign.creatorName}</p>
                </div>
                <div>
                  <Label className="font-medium">Email</Label>
                  <p className="text-sm text-gray-600">{selectedCampaign.creatorEmail}</p>
                </div>
                <div>
                  <Label className="font-medium">Category</Label>
                  <p className="text-sm text-gray-600">{selectedCampaign.category}</p>
                </div>
                <div>
                  <Label className="font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedCampaign.status)}</div>
                </div>
                <div>
                  <Label className="font-medium">Created</Label>
                  <p className="text-sm text-gray-600">{new Date(selectedCampaign.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="font-medium">End Date</Label>
                  <p className="text-sm text-gray-600">{new Date(selectedCampaign.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="font-medium">Goal Amount</Label>
                  <p className="text-sm text-gray-600">${selectedCampaign.goalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="font-medium">Raised Amount</Label>
                  <p className="text-sm text-gray-600">${selectedCampaign.raisedAmount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="font-medium">Donor Count</Label>
                  <p className="text-sm text-gray-600">{selectedCampaign.donorCount}</p>
                </div>
                <div>
                  <Label className="font-medium">Progress</Label>
                  <p className="text-sm text-gray-600">
                    {getProgressPercentage(selectedCampaign.raisedAmount, selectedCampaign.goalAmount).toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    // In real app, this would navigate to campaign page
                    toast.info("Would navigate to campaign page")
                  }}
                >
                  View Public Campaign Page
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewCampaignDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
