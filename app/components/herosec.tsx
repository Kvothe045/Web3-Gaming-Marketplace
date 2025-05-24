// components/hero.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Diamond, Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "../context/Web3Context";

export default function HeroSection() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use your real wallet connection
  const { account, connected, connectWallet, disconnectWallet } = useWeb3();

  // Display either truncated address (if connected) or "Connect Wallet"
  const displayAccount = connected
    ? account
      ? account.slice(0, 6) + "..." + account.slice(-4)
      : "Connected"
    : "Connect Wallet";

  const handleWalletClick = () => {
    if (connected) {
      disconnectWallet(); // or remove if you don’t want to allow disconnect
    } else {
      connectWallet();
    }
  };

  return (
    <header className="border-b border-purple-900/30 bg-black/40 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Home Button */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <Diamond className="h-6 w-6 text-purple-500" />
          <span className="font-bold text-xl tracking-wider">BOULEVARD MARKETPLACE</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <nav>
            <ul className="flex items-center gap-6">
              <li>
                <Link href="/buy-token">
                  <Button className="hover:text-purple-400 transition">Buy BLVD</Button>
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="hover:text-purple-400 transition">
                  Marketplace
                </Link>
              </li>
              {/* <li>
                <Link href="/collection" className="hover:text-purple-400 transition">
                  My Collection
                </Link>
              </li> */}
              <li>
                <Link href="/community" className="hover:text-purple-400 transition">
                  Community
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right Icons + Connect Button */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="border-purple-700 text-purple-400 hover:bg-purple-900/20"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-purple-700 text-purple-400 hover:bg-purple-900/20"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-purple-700 text-purple-400 hover:bg-purple-900/20"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleWalletClick}
            >
              {displayAccount}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-purple-400"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-purple-900/30">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              href="/buy-token"
              className="hover:text-purple-400 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Buy BLVD
            </Link>
            <Link
              href="/marketplace"
              className="hover:text-purple-400 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              href="/collection"
              className="hover:text-purple-400 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Collection
            </Link>
            <Link
              href="/community"
              className="hover:text-purple-400 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Community
            </Link>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleWalletClick}
            >
              {displayAccount}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
