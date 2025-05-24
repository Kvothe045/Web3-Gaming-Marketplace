import Image from "next/image";
import { Button } from "../../components/ui/button";
import { useWeb3 } from "../context/Web3Context"; // adjust the path as needed
import Link from 'next/link'
export default function HeroSection() {
  const { account, connectWallet } = useWeb3();

  // Handle Explore Marketplace click
  const handleExploreMarketplace = () => {
    if (!account) {
      connectWallet();
    } else {
      // Add your navigation logic here when wallet is connected.
      console.log("Navigating to Marketplace with connected wallet");
    }
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-purple-900/30 to-black z-0">
        <div className="absolute inset-0 bg-[url('/fan_570.jpg')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                BOULEVARD
              </span>
              <br />
              ARSENAL
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-xl">
              Discover, collect, and trade unique NFT artifacts in our fantasy Web3 game. Enhance your character with
              powerful weapons, skins, and battle gear.
            </p>
            <div className="flex flex-wrap gap-4">
            <Link href="/lander">
          <Button
            onClick={handleExploreMarketplace}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg"
          >
            Explore Marketplace
          </Button>
        </Link>
              <Button
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-900/20 px-8 py-6 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur-xl"></div>
            <div className="relative bg-black/40 border border-purple-500/30 rounded-lg p-4">
              <Image
                src="/boulbg.png"
                alt="Featured Artifact"
                width={600}
                height={600}
                className="rounded w-full h-auto"
              />
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-xl">Boulevard</h3>
                  <p className="text-purple-400"> Arcadia </p>
                </div>
                <div className="bg-purple-900/50 px-4 py-2 rounded-lg border border-purple-500/30 text-center">
  <p className="text-sm text-gray-300">Active Players</p>
  <p className="font-bold text-xl">5124</p>
</div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}