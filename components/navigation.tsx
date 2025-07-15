"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, DollarSign, User, Settings, LogOut } from "lucide-react"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const pathname = usePathname()
  const profileMenuRef = useRef<HTMLDivElement>(null)

  // Simulate login status - in a real app, this would come from your auth system
  const isLoggedIn = pathname?.startsWith("/dashboard") || pathname?.startsWith("/profile")

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/candidates", label: "Candidates" },
    { href: "/causes", label: "Causes" },
    { href: "/about", label: "About" },
  ]

  const quickLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/contact", label: "Contact Support" },
    { href: "/faq", label: "Help Center" },
  ]

  const profileMenuItems = [
    { href: "/dashboard/profile", label: "Edit Profile", icon: User },
    { href: "/dashboard", label: "Dashboard", icon: Settings },
    { href: "/signin", label: "Sign Out", icon: LogOut },
  ]

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-red-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <div className="text-2xl font-bold text-red-600">VictoryVault</div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-red-100 text-red-700"
                        : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop Auth Buttons and Profile */}
            <div className="hidden md:flex items-center space-x-4">
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                <Link href="/donate">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Donate Now
                </Link>
              </Button>

              {isLoggedIn ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-1 rounded-full border-2 border-red-600 hover:border-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <img
                      src="/placeholder.svg?height=90&width=90&text=Profile"
                      alt="Profile"
                      className="w-[90px] h-[90px] rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">John Smith</p>
                        <p className="text-sm text-gray-500">john.smith@email.com</p>
                      </div>
                      <div className="py-1">
                        {profileMenuItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <item.icon className="mr-3 h-4 w-4" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    asChild
                    className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                  >
                    <Link href="/signin">Sign In</Link>
                  </Button>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-red-100">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-red-100 text-red-700"
                        : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                {isLoggedIn ? (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-center px-3 py-2">
                      <img
                        src="/placeholder.svg?height=100&width=100&text=Profile"
                        alt="Profile"
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">John Smith</p>
                        <p className="text-sm text-gray-500">john.smith@email.com</p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard/profile"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-red-50 hover:text-red-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Edit Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-red-50 hover:text-red-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-red-50 hover:text-red-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                    <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white">
                      <Link href="/donate" onClick={() => setIsMenuOpen(false)}>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Donate Now
                      </Link>
                    </Button>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        asChild
                        className="flex-1 border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                      >
                        <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                          Register
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
