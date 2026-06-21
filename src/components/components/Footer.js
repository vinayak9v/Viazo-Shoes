import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white pt-20 pb-8 font-sans border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Top Section: Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-10 lg:gap-8 mb-16">
          
          {/* Column 1: Brand Info & Socials */}
          <div className="pr-4">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                <path d="M2 2L12 22L22 2H16L12 12L8 2H2Z" fill="white" />
              </svg>
              <span className="text-2xl font-bold tracking-wide">Viazo</span>
            </div>
            
            <p className="text-gray-400 text-[13px] leading-relaxed mb-8 max-w-sm">
              Viazo is a lifestyle brand crafted for those who move with confidence and express themselves fearlessly.
            </p>
            
            {/* Social Icons (Replaced with direct SVGs) */}
            <div className="flex items-center gap-4">
              <Link href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all">
                {/* Instagram SVG */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all">
                {/* Facebook SVG */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all">
                {/* Twitter SVG */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all">
                {/* Youtube SVG */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Column 2: SHOP */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Shop</h4>
            <ul className="flex flex-col gap-3 text-[13px] text-gray-400">
              <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/men" className="hover:text-white transition-colors">Men</Link></li>
              <li><Link href="/women" className="hover:text-white transition-colors">Women</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/best-sellers" className="hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link href="/gift-cards" className="hover:text-white transition-colors">Gift Cards</Link></li>
            </ul>
          </div>

          {/* Column 3: COMPANY */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Company</h4>
            <ul className="flex flex-col gap-3 text-[13px] text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/story" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/sustainability" className="hover:text-white transition-colors">Sustainability</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/press" className="hover:text-white transition-colors">Press</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: HELP */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Help</h4>
            <ul className="flex flex-col gap-3 text-[13px] text-gray-400">
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Exchange</Link></li>
              <li><Link href="/track-order" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link href="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* Column 5: CONTACT US & PAYMENTS */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Contact Us</h4>
            <ul className="flex flex-col gap-3 text-[13px] text-gray-400 mb-8">
              <li><span className="text-white">Email:</span> support@viazo.com</li>
              <li><span className="text-white">Phone:</span> +91 98765 43210</li>
              <li><span className="text-white">Address:</span> Viazo HQ, India</li>
            </ul>

            {/* Payment Method Badges (Built with Tailwind) */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* VISA */}
              <div className="bg-white w-11 h-7 rounded flex items-center justify-center">
                <span className="text-[10px] font-black text-[#1a1f71] italic">VISA</span>
              </div>
              
              {/* Mastercard (Custom CSS Circles) */}
              <div className="bg-white w-11 h-7 rounded flex items-center justify-center relative overflow-hidden">
                <div className="w-4 h-4 rounded-full bg-[#eb001b] absolute left-2.5 opacity-90"></div>
                <div className="w-4 h-4 rounded-full bg-[#f79e1b] absolute right-2.5 opacity-90 mix-blend-multiply"></div>
              </div>

              {/* UPI */}
              <div className="bg-white w-11 h-7 rounded flex items-center justify-center">
                <span className="text-[10px] font-bold text-gray-800 tracking-tighter">UPI</span>
              </div>

              {/* COD */}
              <div className="bg-white w-11 h-7 rounded flex items-center justify-center">
                <span className="text-[10px] font-bold text-black">COD</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section: Copyright & Links */}
        <div className="pt-6 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2024 Viazo. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}