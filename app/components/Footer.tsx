import React from "react";
import { Link } from "react-router-dom";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-yellow-400">RJ</span> Ecommerce
            </h3>
            <p className="text-gray-400 mb-4">
              Your one-stop destination for all your shopping needs. Quality products, competitive prices, and exceptional service.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Quick Links</h4>
            <ul className="space-y-2">
              <FooterLink href="/" text="Home" />
              <FooterLink href="/products" text="Products" />
              <FooterLink href="/about" text="About Us" />
              <FooterLink href="/contact" text="Contact" />
              <FooterLink href="/favourites" text="Favourites" />
            </ul>
          </div>
          
          
          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <HiLocationMarker className="text-yellow-400 text-lg mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  852 Block B, Faisal Town<br />
                  Lahore, Pakistan 54700
                </span>
              </li>
              <li className="flex items-center gap-3">
                <HiPhone className="text-yellow-400 text-lg flex-shrink-0" />
                <a href="tel:+(92)1234567891" className="text-gray-400 hover:text-white transition-colors">
                +(92)1234567891
                </a>
              </li>
              <li className="flex items-center gap-3">
                <HiMail className="text-yellow-400 text-lg flex-shrink-0" />
                <a href="mailto:support@rjecommerce.com" className="text-gray-400 hover:text-white transition-colors">
                  support@rjecommerce.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        
        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm border-t border-gray-800 pt-6">
          <p>&copy; {new Date().getFullYear()} RJ E-Commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

interface FooterLinkProps {
  href: string;
  text: string;
}

function FooterLink({ href, text }: FooterLinkProps) {
  return (
    <li>
      <Link to={href} className="text-gray-400 hover:text-white transition-colors">
        {text}
      </Link>
    </li>
  );
}

interface SocialIconProps {
  icon: React.ReactNode;
  href: string;
}

function SocialIcon({ icon, href }: SocialIconProps) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white h-8 w-8 rounded-full flex items-center justify-center transition-colors"
    >
      {icon}
    </a>
  );
}