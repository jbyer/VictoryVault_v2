"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye, Check, X, Search, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

interface Registration {
  id: string
  userId: string
  userName: string
  email: string
  organizationType: string
  submittedAt: string
  status: "pending" | "approved" | "rejected"
  documents: {
    taxId: string
    bankingInfo: string
    organizationProof: string
  }
  notes?: string
}

export default function RegistrationReviewPage() {
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [reviewAction, setReviewAction] = useState<"approve" | "reject">("approve")
  const [reviewNotes, setReviewNotes] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data - in real app, this would come from database
  const [registrations, setRegistrations] = useState<Registration[]>([
    {
      id: "1",
      userId: "user-1",
      userName: "John Smith",
      email: "john.smith@example.com",
      organizationType: "Political Action Committee",
      submittedAt: "2024-01-15T10:30:00Z",
      status: "pending",
      documents: {
        taxId: "tax-id-doc-1.pdf",
        bankingInfo: "banking-info-1.pdf",
        organizationProof: "org-proof-1.pdf",
      },
    },
    {
      id: "2",
      userId: "user-2",
      userName: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      organizationType: "Campaign Committee",
      submittedAt: "2024-01-14T14:20:00Z",
      status: "approved",
      documents: {
        taxId: "tax-id-doc-2.pdf",
        bankingInfo: "banking-info-2.pdf",
        organizationProof: "org-proof-2.pdf",
      },
      notes: "All documents verified successfully",
    },
    {
      id: "3",
      userId: "user-3",
      userName: "Mike Wilson",
      email: "mike.wilson@example.com",
      organizationType: "Super PAC",
      submittedAt: "2024-01-13T09:15:00Z",
      status: "rejected",
      documents: {
        taxId: "tax-id-doc-3.pdf",
        bankingInfo: "banking-info-3.pdf",
        organizationProof: "org-proof-3.pdf",
      },
      notes: "Tax ID document is unclear and needs to be resubmitted",
    },
  ])

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || reg.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleReview = (registration: Registration, action: "approve" | "reject") => {
    setSelectedRegistration(registration)
    setReviewAction(action)
    setReviewDialogOpen(true)
    setReviewNotes("")
  }

  const submitReview = () => {
    if (!selectedRegistration) return

    setRegistrations((prev) =>
      prev.map((reg) =>
        reg.id === selectedRegistration.id ? { ...reg, status: reviewAction, notes: reviewNotes } : reg,
      ),
    )

    toast.success(`Registration ${reviewAction}d successfully`)
    setReviewDialogOpen(false)
    setSelectedRegistration(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Registration Document Review</h1>
          <p className="text-gray-600 mt-1">Review and approve user registration documents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export Reviews
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Registrations</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registration List */}
      <div className="grid gap-4">
        {filteredRegistrations.map((registration) => (
          <Card key={registration.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{registration.userName}</h3>
                    {getStatusBadge(registration.status)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Email:</span> {registration.email}
                    </div>
                    <div>
                      <span className="font-medium">Organization:</span> {registration.organizationType}
                    </div>
                    <div>
                      <span className="font-medium">Submitted:</span>{" "}
                      {new Date(registration.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                  {registration.notes && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                      <span className="font-medium">Notes:</span> {registration.notes}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // In real app, this would open document viewer
                      toast.info("Document viewer would open here")
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Docs
                  </Button>
                  {registration.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleReview(registration, "approve")}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReview(registration, "reject")}>
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{reviewAction === "approve" ? "Approve" : "Reject"} Registration</DialogTitle>
            <DialogDescription>
              {reviewAction === "approve"
                ? "Approve this registration to allow the user to create campaigns."
                : "Reject this registration and provide feedback to the user."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="review-notes">
                {reviewAction === "approve" ? "Approval Notes (Optional)" : "Rejection Reason (Required)"}
              </Label>
              <Textarea
                id="review-notes"
                placeholder={
                  reviewAction === "approve"
                    ? "Add any notes about the approval..."
                    : "Explain why this registration is being rejected..."
                }
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={submitReview}
              className={reviewAction === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
              disabled={reviewAction === "reject" && !reviewNotes.trim()}
            >
              {reviewAction === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
