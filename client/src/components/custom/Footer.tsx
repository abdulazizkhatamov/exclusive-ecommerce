import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import imageFooterQr from "@/assets/footer_qr.png";
import imageAppStore from "@/assets/app_store.png";
import imageGooglePlay from "@/assets/google_play.png";

const Footer: React.FC = () => {
  return (
    <footer className="mt-10 font-inter bg-black text-white pt-12 pb-6">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Newsletter Section */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">Exclusive</h3>
            <p className="mb-4">Subscribe</p>
            <p className="text-sm mb-4">Get 10% off your first order</p>
            <div className="flex">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent border-white/20 text-white placeholder:text-white/50 rounded-r-none"
              />
              <Button className="bg-white hover:bg-white border-white/20 rounded-l-none">
                <svg
                  className="text-black w-5 h-5 rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4m0 0l6-6m-6 6l6 6"
                  />
                </svg>
              </Button>
            </div>
          </div>

          {/* Support Section */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">Support</h3>
            <address className="not-italic text-sm space-y-2">
              <p>111 Bijoy sarani, Dhaka,</p>
              <p>DH 1515, Bangladesh.</p>
              <p>exclusive@gmail.com</p>
              <p>+88015-88888-9999</p>
            </address>
          </div>

          {/* AccountPage Section */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">Account</h3>
            <nav className="space-y-2 text-sm">
              <Link
                to="/account"
                className="block hover:text-gray-300 max-w-max"
              >
                My Account
              </Link>
              <Link
                to="/signin"
                className="block hover:text-gray-300 max-w-max"
              >
                Login / Register
              </Link>
              <Link to="/cart" className="block hover:text-gray-300 max-w-max">
                Cart
              </Link>
              <Link
                to="/wishlist"
                className="block hover:text-gray-300 max-w-max"
              >
                Wishlist
              </Link>
              <Link to="/shop" className="block hover:text-gray-300 max-w-max">
                Shop
              </Link>
            </nav>
          </div>

          {/* Quick Link Section */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">Quick Link</h3>
            <nav className="space-y-2 text-sm">
              <Link
                to="/privacy-policy"
                className="block hover:text-gray-300 max-w-max"
              >
                Privacy Policy
              </Link>
              <Link to="/terms" className="block hover:text-gray-300 max-w-max">
                Terms Of Use
              </Link>
              <Link to="/faq" className="block hover:text-gray-300 max-w-max">
                FAQ
              </Link>
              <Link
                to="/contact"
                className="block hover:text-gray-300 max-w-max"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Download App Section */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">Download App</h3>
            <p className="text-sm text-gray-400 mb-4">
              Save $3 with App New User Only
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <img
                src={imageFooterQr}
                alt="QR Code"
                width={100}
                height={100}
                className="rounded-lg"
              />
              <div className="flex flex-col gap-2">
                <img
                  src={imageGooglePlay}
                  alt="Google Play"
                  width={120}
                  height={40}
                  className="rounded-lg"
                />
                <img
                  src={imageAppStore}
                  alt="App Store"
                  width={120}
                  height={40}
                  className="rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Link to="#" className="hover:text-gray-300">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link to="#" className="hover:text-gray-300">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link to="#" className="hover:text-gray-300">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link to="#" className="hover:text-gray-300">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center text-sm text-gray-400">
          <p>© Copyright Abdulaziz 2024. All right reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
