import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-linear-to-b from-slate-900 to-slate-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Brand */}
          <div>
            <h2 className="text-white text-xl font-semibold mb-4">
              Matotina&apos;s Kitchen
            </h2>
            <p className="text-sm text-gray-400">
              Creating unforgettable culinary experiences
              for your special events since 2009.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/services" className="hover:text-white">Services</Link></li>
              <li><Link href="/menu" className="hover:text-white">Menu</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Social */}
            <div>
                <h3 className="text-white font-semibold mb-4">
                    Follow Us
                </h3>
                <div className="flex gap-4 text-xl">
                    <a href="https://www.facebook.com/adrianbenedict.cuartero.3" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    <Facebook />
                    </a>
                    <a href="https://www.instagram.com/YourPage" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    <Instagram />
                    </a>
                    <a href="https://twitter.com/YourPage" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    <Twitter />
                    </a>
                </div>
            </div>
        </div>
        {/* Divider */}
        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-sm text-gray-400">
          © 2026 Matotina&apos;s Kitchen. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
