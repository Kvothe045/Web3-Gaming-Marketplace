"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ArtifactCard from "../components/artifact-card"
import { ChevronRight } from "lucide-react"
import MarketplaceNavbar from "../components/altheader"
import Footer from "../components/footer"
import { useWeb3 } from "../context/Web3Context"

export default function LanderPage() {
  const [activeTab, setActiveTab] = useState("all")
  const { activeListings, connected } = useWeb3()

  // Sort listings to show newest first
  const sortedListings = [...activeListings].sort((a, b) => 
    Number(b.createdAt) - Number(a.createdAt)
  )

  // Categorize listings
  const categorizedListings = {
    all: sortedListings,
    weapons: sortedListings.filter(item => item.type === "Weapon"),
    armor: sortedListings.filter(item => item.type === "Armor")
  }

  const artifactCategories = [
    {
      value: "all",
      name: "All Artifacts",
      items: categorizedListings.all
    },
    {
      value: "weapons",
      name: "Weapons",
      items: categorizedListings.weapons
    },
    {
      value: "armor",
      name: "Armor",
      items: categorizedListings.armor
    }
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0e] text-white flex flex-col">
      <MarketplaceNavbar />
      <div className="min-h-screen bg-[#0a0a0e] text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Marketplace Artifacts
          </h1>

          {connected ? (
            <Tabs 
              defaultValue="all" 
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="bg-black/40 border border-purple-900/30 p-1 mb-6 mx-auto flex justify-center">
                {artifactCategories.map(category => (
                  <TabsTrigger key={category.value} value={category.value}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {artifactCategories.map(category => (
                <TabsContent key={category.value} value={category.value} className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {category.items.length > 0 ? (
                      category.items.map((item, index) => (
                        <ArtifactCard
                          key={index}
                          name={item.name}
                          type={item.type}
                          rarity={item.rarity}
                          price={item.price}
                          image={item.image}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center text-gray-400">
                        No artifacts in this category
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}

              <div className="text-center mt-12">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Load More Artifacts <ChevronRight className="ml-2" />
                </Button>
              </div>
            </Tabs>
          ) : (
            <div className="text-center">
              <p className="text-xl mb-4">Connect your wallet to view marketplace</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}