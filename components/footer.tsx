import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-red-700 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold">VictoryVault</span>
            </div>
            <p className="text-red-100">
              Empowering conservative leadership across America through grassroots fundraising.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-red-100">
              <li>
                <Link href="/candidates" className="hover:text-white transition-colors">
                  Candidates
                </Link>
              </li>
              <li>
                <Link href="/causes" className="hover:text-white transition-colors">
                  Causes
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-red-100">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-white transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-red-100">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Newsletter
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Instagram
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-red-600 mt-8 pt-8 text-center text-red-100">
          <p>
            &copy; {new Date().getFullYear()} VictoryVault. All rights reserved. Paid for by VictoryVault and not
            authorized by any candidate or candidate's committee.
          </p>
        </div>
      </div>
    </footer>
  )
}
