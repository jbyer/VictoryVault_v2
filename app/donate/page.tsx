"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { DollarSign, Shield, CreditCard, User, MapPin, Building, Heart, CheckCircle, Lock, Flag } from "lucide-react"

export default function DonatePage() {
  const [donationType, setDonationType] = useState<"candidate" | "cause">("candidate")
  const [selectedRecipient, setSelectedRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringFrequency, setRecurringFrequency] = useState("monthly")
  const [isLoading, setIsLoading] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    employer: "",
    occupation: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  })

  const presetAmounts = ["25", "50", "100", "250", "500", "1000"]

  const candidates = [
    { id: "1", name: "Sarah Johnson", office: "U.S. Senate", state: "Texas" },
    { id: "2", name: "Mike Thompson", office: "Governor", state: "Florida" },
    { id: "3", name: "Lisa Chen", office: "U.S. House", state: "Arizona" },
  ]

  const causes = [
    { id: "1", name: "Border Security Initiative", description: "Supporting enhanced border security measures" },
    { id: "2", name: "Small Business Relief Fund", description: "Helping small businesses recover and thrive" },
    { id: "3", name: "Veterans Support Program", description: "Providing resources for our nation's heroes" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAmountSelect = (selectedAmount: string) => {
    setAmount(selectedAmount)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setAmount("")
  }

  const getCurrentAmount = () => {
    return customAmount || amount
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Donation submitted:", {
      type: donationType,
      recipient: selectedRecipient,
      amount: getCurrentAmount(),
      recurring: isRecurring,
      frequency: recurringFrequency,
      formData,
    })

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-full">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Make Your Donation</h1>
          <p className="text-lg text-red-100 max-w-2xl mx-auto">
            Support conservative candidates and causes that will preserve American values and freedoms
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Donation Type Selection */}
          <Card className="border-red-100">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-gray-900">
                <Flag className="mr-2 h-5 w-5 text-red-600" />
                Choose Your Impact
              </CardTitle>
              <CardDescription>Select whether you'd like to support a candidate or cause</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDonationType("candidate")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    donationType === "candidate" ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  <User className="h-8 w-8 mx-auto mb-2 text-red-600" />
                  <h3 className="font-semibold text-gray-900">Support a Candidate</h3>
                  <p className="text-sm text-gray-600 mt-1">Donate directly to conservative candidates</p>
                </button>
                <button
                  type="button"
                  onClick={() => setDonationType("cause")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    donationType === "cause" ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  <Heart className="h-8 w-8 mx-auto mb-2 text-red-600" />
                  <h3 className="font-semibold text-gray-900">Support a Cause</h3>
                  <p className="text-sm text-gray-600 mt-1">Contribute to conservative initiatives</p>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Recipient Selection */}
          <Card className="border-red-100">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">
                Select {donationType === "candidate" ? "Candidate" : "Cause"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(donationType === "candidate" ? candidates : causes).map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedRecipient === item.id
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-red-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="recipient"
                      value={item.id}
                      checked={selectedRecipient === item.id}
                      onChange={(e) => setSelectedRecipient(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {donationType === "candidate"
                          ? `${(item as any).office} • ${(item as any).state}`
                          : (item as any).description}
                      </p>
                    </div>
                    {selectedRecipient === item.id && <CheckCircle className="h-5 w-5 text-red-600" />}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Donation Amount */}
          <Card className="border-red-100">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-gray-900">
                <DollarSign className="mr-2 h-5 w-5 text-red-600" />
                Donation Amount
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preset Amounts */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {presetAmounts.map((presetAmount) => (
                  <button
                    key={presetAmount}
                    type="button"
                    onClick={() => handleAmountSelect(presetAmount)}
                    className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                      amount === presetAmount
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-200 hover:border-red-300 text-gray-700"
                    }`}
                  >
                    ${presetAmount}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div>
                <Label htmlFor="customAmount" className="text-sm font-medium text-gray-700">
                  Or enter a custom amount
                </Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="customAmount"
                    type="number"
                    placeholder="0.00"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    min="1"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Recurring Donation */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <input
                    id="recurring"
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="recurring" className="text-sm font-medium text-gray-700">
                    Make this a recurring donation
                  </Label>
                </div>
                {isRecurring && (
                  <div className="mt-3">
                    <select
                      value={recurringFrequency}
                      onChange={(e) => setRecurringFrequency(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="border-red-100">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-gray-900">
                <User className="mr-2 h-5 w-5 text-red-600" />
                Personal Information
              </CardTitle>
              <CardDescription>Required for FEC compliance and donation processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Street Address *
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                    City *
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                    State *
                  </Label>
                  <Input
                    id="state"
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
                    ZIP Code *
                  </Label>
                  <Input
                    id="zipCode"
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employer" className="text-sm font-medium text-gray-700">
                    Employer *
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="employer"
                      type="text"
                      value={formData.employer}
                      onChange={(e) => handleInputChange("employer", e.target.value)}
                      className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="occupation" className="text-sm font-medium text-gray-700">
                    Occupation *
                  </Label>
                  <Input
                    id="occupation"
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => handleInputChange("occupation", e.target.value)}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card className="border-red-100">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-gray-900">
                <CreditCard className="mr-2 h-5 w-5 text-red-600" />
                Payment Information
              </CardTitle>
              <CardDescription className="flex items-center">
                <Lock className="mr-1 h-4 w-4 text-green-600" />
                Your payment information is encrypted and secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nameOnCard" className="text-sm font-medium text-gray-700">
                  Name on Card *
                </Label>
                <Input
                  id="nameOnCard"
                  type="text"
                  value={formData.nameOnCard}
                  onChange={(e) => handleInputChange("nameOnCard", e.target.value)}
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">
                  Card Number *
                </Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                    className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate" className="text-sm font-medium text-gray-700">
                    Expiry Date *
                  </Label>
                  <Input
                    id="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv" className="text-sm font-medium text-gray-700">
                    CVV *
                  </Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value)}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Disclaimer */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Important Legal Information</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Contributions are not tax-deductible for federal income tax purposes.</p>
              <p>
                • Federal law requires us to use our best efforts to collect and report the name, mailing address,
                occupation, and name of employer of individuals whose contributions exceed $200 in a calendar year.
              </p>
              <p>
                • By proceeding, you confirm that this contribution is made from your own funds and not from funds
                provided by another person for the purpose of making this contribution.
              </p>
              <p>
                • You must be a U.S. citizen or lawfully admitted permanent resident to make political contributions.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 text-lg font-semibold"
              disabled={isLoading || !selectedRecipient || !getCurrentAmount()}
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Donate ${getCurrentAmount() || "0"} {isRecurring ? `${recurringFrequency}` : ""}
                </>
              )}
            </Button>
            <p className="mt-3 text-sm text-gray-500">
              Your donation will be processed securely with bank-level encryption
            </p>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
