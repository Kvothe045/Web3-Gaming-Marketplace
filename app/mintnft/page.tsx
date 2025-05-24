"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWeb3 } from "../context/Web3Context";
import MarketplaceNavbar from "../components/altheader";
import Footer from "../components/footer";
import { uploadToIPFS } from "../lib/ipfs"; // Utility for uploading to IPFS
import { toast } from "sonner"; // Toast notifications


export default function MintNFTPage() {
  const { connected, account, gameAssetNFT } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    assetType: "",
    rarity: "" as "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary",
    metadataUrl: "",
    image: null as File | null,
  });

  const rarityOptions = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    }
  };

  // Function to upload the image to our local API
  const uploadImageToServer = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: data,
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || "Image upload failed");
    }
    return json.url;
  };

  const handleMint = async () => {
    const { name, assetType, rarity, metadataUrl, image } = formData;
    if (!name || !assetType || !rarity) {
      toast.error("Please fill in name, asset type, and rarity");
      return;
    }
    if (!metadataUrl && !image) {
      toast.error("Provide either a metadata URL or an image");
      return;
    }

    try {
      setLoading(true);
      let finalImageUrl = metadataUrl;
      if (!metadataUrl && image) {
        finalImageUrl = await uploadImageToServer(image);
      }

      // Prepare metadata (here we just include the image URL)
      const metadata = {
        name,
        assetType,
        rarity,
        image: finalImageUrl, // local image URL, e.g. /uploads/filename.png
        description: `${name} - ${assetType} (${rarity})`,
      };

      // Upload metadata to IPFS or store it as needed. For now, let's assume you use a function uploadToIPFS:
      const metadataUri = await uploadToIPFS(
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );

      // Mint the NFT by calling your contract
      const tx = await gameAssetNFT.mintGameAsset(
        account,
        metadataUri,
        assetType,
        1, // example rarity level; adjust mapping as needed
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      );
      await tx.wait();

      toast.success("NFT Minted Successfully!");
      setFormData({
        name: "",
        assetType: "",
        rarity: "" as "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary",
        metadataUrl: "",
        image: null,
      });
    } catch (error) {
      console.error("Minting failed:", error);
      toast.error("Failed to mint NFT");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0e] text-white flex flex-col">
      <MarketplaceNavbar />
      <div className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Mint New NFT</h1>
        {connected ? (
          <div className="max-w-md mx-auto bg-black/40 p-8 rounded-lg border border-purple-900/30">
            <div className="space-y-4">
              <Input
                name="name"
                placeholder="NFT Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full"
              />
              <Input
                name="assetType"
                placeholder="Asset Type (e.g. Weapon, Armor)"
                value={formData.assetType}
                onChange={handleInputChange}
                className="w-full"
              />
              <Select
                value={formData.rarity}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, rarity: value as any }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Rarity" />
                </SelectTrigger>
                <SelectContent>
                  {rarityOptions.map((rarity) => (
                    <SelectItem key={rarity} value={rarity}>
                      {rarity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                name="metadataUrl"
                placeholder="Metadata URL (optional)"
                value={formData.metadataUrl}
                onChange={handleInputChange}
                className="w-full"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full"
              />
              <Button
                onClick={handleMint}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {loading ? "Minting..." : "Mint NFT"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xl mb-4">Connect your wallet to mint NFTs</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}





// =====================================================================================================================



// export default function MintNFTPage() {
//   const { connected, account, gameAssetNFT } = useWeb3();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     assetType: "",
//     rarity: "" as "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary",
//     metadataUrl: "",
//     image: null as File | null,
//   });

//   const rarityOptions = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle file upload with an explicit check for files
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
//     }
//   };

//   // Map rarity strings to numeric levels (adjust these values as needed)
//   const rarityMapping: Record<string, number> = {
//     Common: 1,
//     Uncommon: 2,
//     Rare: 3,
//     Epic: 4,
//     Legendary: 5,
//   };

//   // Default bytes32 value for game properties (if none are provided)
//   const defaultGamePropertiesHash =
//     "0x0000000000000000000000000000000000000000000000000000000000000000";

//   const handleMint = async () => {
//     const { name, assetType, rarity, metadataUrl, image } = formData;

//     // Validate required fields:
//     // name, assetType, and rarity must be provided.
//     // And the user must provide either a metadata URL or an image.
//     if (!name || !assetType || !rarity) {
//       toast.error("Please fill in name, asset type, and rarity");
//       return;
//     }
//     if (!metadataUrl && !image) {
//       toast.error(
//         "Please provide either a metadata URL or an image to generate metadata"
//       );
//       return;
//     }

//     try {
//       setLoading(true);
//       let finalMetadataUri = metadataUrl;

//       // If the user did not provide a metadata URL, generate one using the image
//       if (!metadataUrl && image) {
//         // Upload the image file to IPFS
//         const imageUrl = await uploadToIPFS(image);

//         // Prepare metadata JSON
//         const generatedMetadata = {
//           name,
//           assetType,
//           rarity,
//           image: imageUrl,
//           description: `${name} - ${assetType} (${rarity})`,
//         };

//         // Upload the metadata JSON to IPFS
//         finalMetadataUri = await uploadToIPFS(
//           new Blob([JSON.stringify(generatedMetadata)], { type: "application/json" })
//         );
//       }

//       // Call the contract's mintGameAsset function.
//       // Note: Ensure the connected account is the contract owner since mintGameAsset is onlyOwner.
//       const tx = await gameAssetNFT.mintGameAsset(
//         account, // recipient address
//         finalMetadataUri, // metadata URI on IPFS
//         assetType, // asset type (e.g., "Weapon")
//         rarityMapping[rarity], // rarity level as a uint8
//         defaultGamePropertiesHash // default bytes32 for game properties
//       );
//       await tx.wait();

//       toast.success("NFT Minted Successfully!");

//       // Reset the form after successful minting
//       setFormData({
//         name: "",
//         assetType: "",
//         rarity: "" as "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary",
//         metadataUrl: "",
//         image: null,
//       });
//     } catch (error) {
//       console.error("Minting failed:", error);
//       toast.error("Failed to mint NFT");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0a0a0e] text-white flex flex-col">
//       <MarketplaceNavbar />
//       <div className="flex-grow container mx-auto px-4 py-12">
//         <h1 className="text-4xl font-bold mb-8 text-center">Mint New NFT</h1>
//         {connected ? (
//           <div className="max-w-md mx-auto bg-black/40 p-8 rounded-lg border border-purple-900/30">
//             <div className="space-y-4">
//               <Input
//                 name="name"
//                 placeholder="NFT Name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//               <Input
//                 name="assetType"
//                 placeholder="Asset Type (e.g. Weapon, Armor)"
//                 value={formData.assetType}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//               <Select
//                 value={formData.rarity}
//                 onValueChange={(value) =>
//                   setFormData((prev) => ({ ...prev, rarity: value as any }))
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Rarity" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {rarityOptions.map((rarity) => (
//                     <SelectItem key={rarity} value={rarity}>
//                       {rarity}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Input
//                 name="metadataUrl"
//                 placeholder="Metadata URL (optional)"
//                 value={formData.metadataUrl}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//               <Input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//                 className="w-full"
//               />
//               <Button
//                 onClick={handleMint}
//                 disabled={loading}
//                 className="w-full bg-purple-600 hover:bg-purple-700"
//               >
//                 {loading ? "Minting..." : "Mint NFT"}
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center">
//             <p className="text-xl mb-4">Connect your wallet to mint NFTs</p>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );
// }
