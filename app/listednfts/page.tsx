"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useWeb3 } from "../context/Web3Context"
import MarketplaceNavbar from "../components/altheader"
import Footer from "../components/footer"
import { toast } from 'sonner'

// Define an interface for your listing items
interface Listing {
  listingId: string;
  image?: string;
  name: string;
  type: string;
  rarity: string;
  price: string;
  seller: string;
}

export default function ListedNFTsPage() {
  const { 
    connected, 
    activeListings, 
    cancelListing, 
    buyNFT,
    account 
  } = useWeb3()
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)

  const handleCancelListing = async (listingId: string) => {
    try {
      const success = await cancelListing(listingId)
      if (success) {
        toast.success('Listing Cancelled Successfully!')
      }
    } catch (error) {
      toast.error('Failed to cancel listing')
    }
  }

  const handleBuyNFT = async (listing: Listing) => {
    try {
      const success = await buyNFT(listing.listingId, listing.price)
      if (success) {
        toast.success('NFT Purchased Successfully!')
      }
    } catch (error) {
      toast.error('Failed to buy NFT')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0e] text-white flex flex-col">
      <MarketplaceNavbar />
      <div className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Listed NFTs Marketplace</h1>
        
        {connected ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activeListings.length > 0 ? (
              activeListings.map((listing: Listing) => (
                <div 
                  key={listing.listingId} 
                  className="bg-black/40 p-4 rounded-lg border border-purple-900/30"
                >
                  <img 
                    src={listing.image || "/placeholder-nft.png"} 
                    alt={listing.name} 
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold">{listing.name}</h3>
                    <p>Type: {listing.type}</p>
                    <p>Rarity: {listing.rarity}</p>
                    <p>Price: {listing.price} BLVD</p>
                    <div className="mt-4 space-y-2">
                      <Button 
                        onClick={() => handleBuyNFT(listing)}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        Buy NFT
                      </Button>
                      {listing.seller === account && (
                        <Button 
                          onClick={() => handleCancelListing(listing.listingId)}
                          className="w-full bg-red-600 hover:bg-red-700"
                        >
                          Cancel Listing
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center">
                <p>No NFTs currently listed in the marketplace</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xl mb-4">Connect your wallet to view marketplace listings</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
