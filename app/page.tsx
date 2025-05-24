"use client"

import { useState } from "react"
import { Search, ShoppingCart, User, Menu, X, ChevronRight, Diamond, Shield, Sword, Wand, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ArtifactCard from "./components/artifact-card"
import HeroSection from "./components/hero-section"
import MarketplaceStats from "./components/marketplace-stats"
import CategoryCard from "./components/category-card"
import Link from "next/link";
// Import our Web3 hook from your provided web3context.js file
import { useWeb3 } from "./context/Web3Context"

export default function BoulevardMarketplace() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Destructure the necessary values and functions from our Web3 context
  const { account, connectWallet, disconnectWallet } = useWeb3()

  // Helper to display a shortened account address if connected
  const displayAccount = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : "Connect Wallet"

  return (
    <div className="min-h-screen bg-[#0a0a0e] text-white overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-purple-900/30 bg-black/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Diamond className="h-6 w-6 text-purple-500" />
            <span className="font-bold text-xl tracking-wider">NFT MARKETPLACE</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <nav>
              <ul className="flex items-center gap-6">
                <li>
                <Link href="/buy-token">
  <Button className="hover:text-purple-400 transition">
    Buy BLVD
  </Button>
</Link>

                </li>
                <li>
                  <a href="/lander" className="hover:text-purple-400 transition">
                    Marketplace
                  </a>
                </li>
                {/* <li>
                  <a href="#" className="hover:text-purple-400 transition">
                    My Collection
                  </a>
                </li> */}
                <li>
                  <a href="#" className="hover:text-purple-400 transition">
                    Community
                  </a>
                </li>
              </ul>
            </nav>
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
                onClick={account ? disconnectWallet : connectWallet}
              >
                {displayAccount}
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-purple-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-purple-900/30 absolute w-full">
            <nav className="container mx-auto px-4 py-4">
              <ul className="flex flex-col gap-4">
                <li>
                  <a href="#" className="block py-2 hover:text-purple-400 transition">
                    Discover
                  </a>
                </li>
                <li>
                  <a href="#" className="block py-2 hover:text-purple-400 transition">
                    Marketplace
                  </a>
                </li>
                <li>
                  <a href="#" className="block py-2 hover:text-purple-400 transition">
                    My Collection
                  </a>
                </li>
                <li>
                  <a href="#" className="block py-2 hover:text-purple-400 transition">
                    Community
                  </a>
                </li>
                <li className="pt-2">
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={account ? disconnectWallet : connectWallet}
                  >
                    {displayAccount}
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Marketplace Stats */}
        <MarketplaceStats />

        {/* Categories Section */}
        <section className="py-12 container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Artifact Categories</h2>
            <Button variant="link" className="text-purple-400 flex items-center gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <CategoryCard
              title="Weapons"
              count="1,245"
              icon={<Sword className="h-6 w-6" />}
              color="from-red-500 to-purple-600"
            />
            <CategoryCard
              title="Skins"
              count="3,721"
              icon={<User className="h-6 w-6" />}
              color="from-blue-500 to-purple-600"
            />
            <CategoryCard
              title="BattleSuits"
              count="892"
              icon={<Shield className="h-6 w-6" />}
              color="from-purple-500 to-pink-600"
            />
            <CategoryCard
              title="Pets"
              count="1,103"
              icon={<span className="text-xl">🐉</span>}
              color="from-green-500 to-blue-600"
            />
            <CategoryCard
              title="Armor"
              count="2,450"
              icon={<Shield className="h-6 w-6" />}
              color="from-yellow-500 to-orange-600"
            />
            <CategoryCard
              title="Spell Books"
              count="756"
              icon={<Wand className="h-6 w-6" />}
              color="from-indigo-500 to-purple-600"
            />
          </div>
        </section>

        {/* Featured Artifacts */}
        <section className="py-12 container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Artifacts</h2>
            <Button variant="link" className="text-purple-400 flex items-center gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-black/40 border border-purple-900/30 p-1 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="weapons">Weapons</TabsTrigger>
              <TabsTrigger value="skins">Skins</TabsTrigger>
              <TabsTrigger value="battlesuits">BattleSuits</TabsTrigger>
              <TabsTrigger value="pets">Pets</TabsTrigger>
              <TabsTrigger value="armor">Armor</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <ArtifactCard
                  name="Crimson Blade"
                  type="Weapon"
                  rarity="Legendary"
                  price="300 BLVD"
                  image="/sword.png?height=300&width=300"
                />
                <ArtifactCard
                  name="Shadow Walker"
                  type="Skin"
                  rarity="Epic"
                  price="280 BLVD"
                  image="/skin.png?height=300&width=300"
                />
                <ArtifactCard
                  name="Dragon Scale Armor"
                  type="BattleSuit"
                  rarity="Legendary"
                  price="600 BLVD"
                  image="/dragon.png?height=300&width=300"
                />
                <ArtifactCard
                  name="Mystic Horse"
                  type="Pet"
                  rarity="Rare"
                  price="900 BLVD"
                  image="/horse.png?height=300&width=300"
                />
              </div>
            </TabsContent>

            <TabsContent value="weapons" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <ArtifactCard
                  name="Crimson Blade"
                  type="Weapon"
                  rarity="Legendary"
                  price="0.45 ETH"
                  image="/placeholder.svg?height=300&width=300"
                />
                <ArtifactCard
                  name="Void Slicer"
                  type="Weapon"
                  rarity="Epic"
                  price="0.32 ETH"
                  image="/placeholder.svg?height=300&width=300"
                />
                <ArtifactCard
                  name="Thunder Staff"
                  type="Weapon"
                  rarity="Rare"
                  price="0.18 ETH"
                  image="/placeholder.svg?height=300&width=300"
                />
                <ArtifactCard
                  name="Frost Bow"
                  type="Weapon"
                  rarity="Epic"
                  price="0.27 ETH"
                  image="/placeholder.svg?height=300&width=300"
                />
              </div>
            </TabsContent>

            {/* Other tabs would have similar content */}
            <TabsContent value="skins" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <ArtifactCard
                  name="Shadow Walker"
                  type="Skin"
                  rarity="Epic"
                  price="0.28 ETH"
                  image="/placeholder.svg?height=300&width=300"
                />
                <ArtifactCard
                  name="Celestial Form"
                  type="Skin"
                  rarity="Legendary"
                  price="0.52 ETH"
                  image="/placeholder.svg?height=300&width=300"
                />
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* NFT Marketplace */}
        <section className="py-12 bg-gradient-to-b from-purple-900/20 to-black/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">NFT Marketplace</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Trade, buy, and sell unique Artifacts as NFTs. Each item is authenticated on the blockchain, ensuring
                true ownership and rarity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-black/40 border-purple-900/30 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Buy Artifacts</h3>
                    <Diamond className="h-5 w-5 text-purple-500" />
                  </div>
                  <p className="text-gray-400 mb-6">
                    Browse thousands of unique Artifacts and add them to your collection.
                  </p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Explore Marketplace</Button>
                </div>
              </Card>

              <Card className="bg-black/40 border-purple-900/30 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Sell Artifacts</h3>
                    <ShoppingCart className="h-5 w-5 text-purple-500" />
                  </div>
                  <p className="text-gray-400 mb-6">
                    List your Artifacts for sale and earn cryptocurrency from other players.
                  </p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">List Your Items</Button>
                </div>
              </Card>

              <Card className="bg-black/40 border-purple-900/30 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Auction House</h3>
                    <Sparkles className="h-5 w-5 text-purple-500" />
                  </div>
                  <p className="text-gray-400 mb-6">Participate in auctions for rare and legendary Artifacts.</p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">View Auctions</Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-purple-900/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Diamond className="h-6 w-6 text-purple-500" />
                <span className="font-bold text-xl tracking-wider">BOULEVARD</span>
              </div>
              <p className="text-gray-400 mb-4">The premier marketplace for Web3 gaming Artifacts and NFTs.</p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-purple-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Marketplace</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    All Artifacts
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    Weapons
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    Skins
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    BattleSuits
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    Pets
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    Armor
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Account</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    Profile
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    My Collection
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    Favorites
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    Watchlist
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    Settings
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    Platform Status
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    Partners
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    Newsletter
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-purple-900/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2025 Boulevard Marketplace. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
