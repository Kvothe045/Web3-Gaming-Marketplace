"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Diamond, Wallet, Grid, Tag } from "lucide-react"
import { useWeb3 } from "../context/Web3Context"
import Link from 'next/link'

const MarketplaceNavbar: React.FC = () => {
  const { account, connected, connectWallet } = useWeb3()
  const [activeButton, setActiveButton] = useState<"mint" | "owned" | "listed">("mint")

  const displayAccount = connected 
    ? account 
      ? account.slice(0, 6) + "..." + account.slice(-4) 
      : "Connected" 
    : "Connect Wallet"

  return (
    <nav className="bg-[#0a0a0e] p-4 flex justify-between items-center">
      {/* Logo or Brand */}
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
        <Diamond className="h-6 w-6 text-purple-500" /> 
        HOME
      </Link>
      


      {/* Navigation Buttons */}
      <div className="flex items-center space-x-4">
      <Link href="/lander" className="flex items-center gap-2 hover:opacity-80 transition">
        <Diamond className="h-6 w-6 text-purple-500" /> 
        Market
      </Link>
        <Link href="/mintnft">
          <Button 
            variant={activeButton === "mint" ? "default" : "outline"} 
            className={`
              ${activeButton === "mint" 
                ? "bg-purple-600 hover:bg-purple-700" 
                : "bg-black/40 border border-purple-900/30 text-white hover:bg-black/50"}
              flex items-center space-x-2
            `}
            onClick={() => setActiveButton("mint")}
          >
            <Tag size={20} /> Mint NFT
          </Button>
        </Link>

        <Link href="/ownednfts">
          <Button 
            variant={activeButton === "owned" ? "default" : "outline"} 
            className={`
              ${activeButton === "owned" 
                ? "bg-purple-600 hover:bg-purple-700" 
                : "bg-black/40 border border-purple-900/30 text-white hover:bg-black/50"}
              flex items-center space-x-2
            `}
            onClick={() => setActiveButton("owned")}
          >
            <Wallet size={20} /> Owned NFTs
          </Button>
        </Link>

        <Link href="/listednfts">
          <Button 
            variant={activeButton === "listed" ? "default" : "outline"} 
            className={`
              ${activeButton === "listed" 
                ? "bg-purple-600 hover:bg-purple-700" 
                : "bg-black/40 border border-purple-900/30 text-white hover:bg-black/50"}
              flex items-center space-x-2
            `}
            onClick={() => setActiveButton("listed")}
          >
            <Grid size={20} /> Listed NFTs
          </Button>
        </Link>

        {/* Connect Wallet Button */}
        <Button 
          className="bg-purple-600 hover:bg-purple-700 flex items-center space-x-2" 
          onClick={connected ? undefined : connectWallet}
        >
          <Wallet size={20} /> {displayAccount}
        </Button>
      </div>
    </nav>
  )
}

export default MarketplaceNavbar