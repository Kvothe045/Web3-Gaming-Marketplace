"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useWeb3 } from "../context/Web3Context";
import MarketplaceNavbar from "../components/altheader";
import Footer from "../components/footer";
import { toast } from 'sonner';

// Define an interface for your owned NFT objects
interface OwnedNFT {
  tokenId: string;
  tokenURI: string;
  assetType: string;
  rarityLevel: string;
  isUsable: boolean;
  // add other properties as needed
}

export default function OwnedNFTsPage() {
  const { 
    connected, 
    ownedNFTs, 
    createListing, 
    useNFT 
  } = useWeb3();
  const [listingNFT, setListingNFT] = useState<OwnedNFT | null>(null);
  const [listingPrice, setListingPrice] = useState('');

  const handleCreateListing = async () => {
    if (!listingNFT || !listingPrice) {
      toast.error('Please select an NFT and set a price');
      return;
    }

    try {
      const success = await createListing(listingNFT.tokenId, listingPrice);
      if (success) {
        toast.success('NFT Listed Successfully!');
        setListingNFT(null);
        setListingPrice('');
      }
    } catch (error) {
      toast.error('Failed to list NFT');
    }
  };

  const handleUseNFT = async (tokenId: string) => {
    try {
      const success = await useNFT(tokenId);
      if (success) {
        toast.success('NFT Used Successfully!');
      }
    } catch (error) {
      toast.error('Failed to use NFT');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0e] text-white flex flex-col">
      <MarketplaceNavbar />
      <div className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">My Owned NFTs</h1>
        
        {connected ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {ownedNFTs.length > 0 ? (
              (ownedNFTs as OwnedNFT[]).map((nft: OwnedNFT) => (
                <div 
                  key={nft.tokenId} 
                  className="bg-black/40 p-4 rounded-lg border border-purple-900/30"
                >
                  <img 
                    src={nft.tokenURI} 
                    alt={nft.assetType} 
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold">{nft.assetType}</h3>
                    <p>Rarity: {nft.rarityLevel}</p>
                    <div className="mt-4 space-y-2">
                      <Button 
                        onClick={() => setListingNFT(nft)}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        List for Sale
                      </Button>
                      <Button 
                        onClick={() => handleUseNFT(nft.tokenId)}
                        disabled={!nft.isUsable}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
                      >
                        Use NFT
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center">
                <p>You don't own any NFTs yet</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xl mb-4">Connect your wallet to view owned NFTs</p>
          </div>
        )}

        {listingNFT && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#0a0a0e] p-8 rounded-lg w-96">
              <h2 className="text-2xl mb-4">List {listingNFT.assetType}</h2>
              <input 
                type="number" 
                placeholder="Price in BLVD"
                value={listingPrice}
                onChange={(e) => setListingPrice(e.target.value)}
                className="w-full mb-4 p-2 bg-black/40 text-white"
              />
              <div className="flex space-x-4">
                <Button 
                  onClick={handleCreateListing}
                  className="flex-grow bg-purple-600 hover:bg-purple-700"
                >
                  Confirm Listing
                </Button>
                <Button 
                  onClick={() => setListingNFT(null)}
                  variant="outline"
                  className="flex-grow"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
