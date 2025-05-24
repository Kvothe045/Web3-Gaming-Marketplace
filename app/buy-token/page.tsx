"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "../context/Web3Context";
import HeroSection from "../components/herosec"; // Update path if needed
import Footer from "../components/footer";       // Update path if needed
import Image from "next/image";
import MarketplaceNavbar from "../components/altheader";

export default function BuyTokensPage() {
  const {
    account,
    connected,
    buyBlvdTokens,
    tokenSaleInfo,
    blvdBalance,
    contractEthBalance,
  } = useWeb3();

  const [ethAmount, setEthAmount] = useState("");

  // Attempt to buy tokens
  const handleBuyTokens = async () => {
    if (!ethAmount || isNaN(Number(ethAmount))) {
      alert("Please enter a valid ETH amount");
      return;
    }
    try {
      const success = await buyBlvdTokens(ethAmount);
      if (success) {
        alert("Tokens purchased successfully!");
        setEthAmount("");
      } else {
        alert("Token purchase failed.");
      }
    } catch (error) {
      console.error("Error buying tokens:", error);
      alert("Error purchasing tokens.");
    }
  };

  // If tokenSaleInfo is loaded, use tokenSaleInfo.ethBalance; otherwise use contractEthBalance
  const totalEthInvested = tokenSaleInfo?.ethBalance || contractEthBalance || "0";

  return (
    <div className="min-h-screen bg-[#0a0a0e] text-white flex flex-col">
      {/* Hero / Header Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Buy BLVD Section */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-3xl font-bold mb-6">Buy BLVD Tokens</h2>

            {/* Show user BLVD balance if connected */}
            {connected && (
              <div className="mb-4">
                <p className="text-sm text-gray-300">Your BLVD Balance:</p>
                <p className="text-lg font-semibold">{blvdBalance} BLVD</p>
              </div>
            )}

            {account ? (
              <>
                {/* ETH Amount Input */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Enter ETH amount"
                    value={ethAmount}
                    onChange={(e) => setEthAmount(e.target.value)}
                    className="w-full p-3 rounded bg-black border border-gray-700 text-white"
                  />
                </div>

                {/* Buy Button */}
                <Button
                  onClick={handleBuyTokens}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Buy Tokens
                </Button>

                {/* Token Sale Info */}
                {tokenSaleInfo && (
                  <div className="mt-6 text-sm text-gray-300 space-y-1">
                    <p>
                      <strong>Current Token Price:</strong> {tokenSaleInfo.price} ETH per BLVD
                    </p>
                    <p>
                      <strong>Minimum Purchase:</strong> {tokenSaleInfo.minAmount} ETH
                    </p>
                    <p>
                      <strong>Maximum Purchase:</strong> {tokenSaleInfo.maxAmount} ETH
                    </p>
                    <p>
                      <strong>Total ETH Invested (All Investors):</strong>{" "}
                      {tokenSaleInfo.ethBalance} ETH
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center mt-4">
                <p>Please connect your wallet to buy tokens.</p>
              </div>
            )}
          </div>

            {/* Right Column: Image Placeholder + Current Investors + Contract ETH Balance */}
            <div className="flex flex-col items-center justify-center">
            {/* BLVD Token Image */}
            <Image
              src="/blvd.png"
              alt="BLVD Token"
              width={600}
              height={900}
              className="w-full rounded-md mb-4 object-cover hover:shadow-lg transition-shadow duration-300"
            />

            {/* Current Investors Text */}
            <div className="text-xl font-bold text-white mb-2">Current Investors</div>

            {/* Purple Box displaying total ETH invested */}
            <div className="bg-purple-700 text-white text-xl font-bold px-6 py-3 rounded-md shadow-md">
              {totalEthInvested} ETH
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
