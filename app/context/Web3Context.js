"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

// Import ABIs
import GameAssetNFTABI from '../utils/GameAssetNFT.json';
import GameAssetMarketplaceABI from '../utils/GameAssetMarketplace.json';
import BLVDTokenABI from '../utils/BLVDToken.json';
// Create Context
const Web3Context = createContext();

// Contract addresses - replace with your deployed contract addresses
const CONTRACT_ADDRESSES = {
  BLVD_TOKEN: "0x4A6669e84a7a0A5a964B9F32fD12f60D0E6059a6", // Replace with your deployed BLVD token address
  GAME_ASSET_NFT: "0x8Caa2F746c30E4F87C37fF50eb73C4049457a17c", // Replace with your deployed NFT contract address
  MARKETPLACE: "0xB2E72121243fFA76937d0E3e082b0824F00670e3" // Replace with your deployed marketplace address
};

export const Web3Provider = ({ children }) => {
  // State variables
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [connected, setConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Contract instances
  const [blvdToken, setBlvdToken] = useState(null);
  const [gameAssetNFT, setGameAssetNFT] = useState(null);
  const [marketplace, setMarketplace] = useState(null);
  
  // User data
  const [blvdBalance, setBlvdBalance] = useState("0");
  const [ethBalance, setEthBalance] = useState("0");
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [tokenSaleInfo, setTokenSaleInfo] = useState(null);
  const [tokenMetrics, setTokenMetrics] = useState(null);
  
  // Marketplace data
  const [activeListings, setActiveListings] = useState([]);
  const [userOffers, setUserOffers] = useState([]);
  const [marketplaceFee, setMarketplaceFee] = useState(0);
  
  // Initialize Web3
  const initializeWeb3 = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Reset all states
      setConnected(false);
      setAccount(null);
      setSigner(null);
      
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error("MetaMask or a Web3 provider is required to use this application");
      }
      
      // Connect to provider
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);
      
      // Get network
      const network = await web3Provider.getNetwork();
      setChainId(network.chainId);
      
      // Get accounts
      const accounts = await web3Provider.listAccounts();
      
      if (accounts.length > 0) {
        const userSigner = await web3Provider.getSigner();
        setSigner(userSigner);
        setAccount(accounts[0].address);
        setConnected(true);
        
        // Initialize contracts
        initializeContracts(web3Provider, userSigner);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Failed to initialize Web3:", err);
      setError(err.message);
      setLoading(false);
    }
  }, []);
  
  // Initialize contract instances
  const initializeContracts = useCallback(async (provider, signer) => {
    try {
      // Initialize BLVD Token contract
      const blvdContract = new ethers.Contract(
        CONTRACT_ADDRESSES.BLVD_TOKEN,
        BLVDTokenABI.abi,
        provider
      );
      const blvdWithSigner = blvdContract.connect(signer);
      setBlvdToken(blvdWithSigner);
      
      // Initialize NFT contract
      const nftContract = new ethers.Contract(
        CONTRACT_ADDRESSES.GAME_ASSET_NFT,
        GameAssetNFTABI.abi,
        provider
      );
      const nftWithSigner = nftContract.connect(signer);
      setGameAssetNFT(nftWithSigner);
      
      // Initialize Marketplace contract
      const marketplaceContract = new ethers.Contract(
        CONTRACT_ADDRESSES.MARKETPLACE,
        GameAssetMarketplaceABI.abi,
        provider
      );
      const marketplaceWithSigner = marketplaceContract.connect(signer);
      setMarketplace(marketplaceWithSigner);
      
    } catch (err) {
      console.error("Failed to initialize contracts:", err);
      setError("Failed to initialize smart contracts");
    }
  }, []);
  
  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        await initializeWeb3();
      } else {
        throw new Error("No Ethereum wallet detected");
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [initializeWeb3]);
  
  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setSigner(null);
    setConnected(false);
    setBlvdBalance("0");
    setEthBalance("0");
    setOwnedNFTs([]);
  }, []);
  
  // Fetch user data
  const fetchUserData = useCallback(async () => {
    if (!connected || !account || !blvdToken || !gameAssetNFT || !provider) return;
    
    try {
      setLoading(true);
      
      // Fetch BLVD balance
      const tokenBalance = await blvdToken.balanceOf(account);
      setBlvdBalance(ethers.formatUnits(tokenBalance, 18));
      
      // Fetch ETH balance
      const rawEthBalance = await provider.getBalance(account);
      setEthBalance(ethers.formatEther(rawEthBalance));
      
      // Fetch owned NFTs
      const tokenIds = await gameAssetNFT.getTokensOwnedBy(account);
      const nftPromises = tokenIds.map(async (id) => {
        const tokenURI = await gameAssetNFT.tokenURI(id);
        const attributes = await gameAssetNFT.getAssetAttributes(id);
        return {
          tokenId: id,
          tokenURI,
          assetType: attributes[0],
          rarityLevel: attributes[1],
          gameProperties: attributes[2],
          isUsable: attributes[3],
          createdAt: attributes[4]
        };
      });
      
      const nfts = await Promise.all(nftPromises);
      setOwnedNFTs(nfts);
      
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setError("Failed to load user data");
      setLoading(false);
    }
  }, [connected, account, blvdToken, gameAssetNFT, provider]);
  
  const [contractEthBalance, setContractEthBalance] = useState("0");

  const fetchContractEthBalance = useCallback(async () => {
    if (!provider) return;
  
    try {
      const balance = await provider.getBalance(CONTRACT_ADDRESSES.BLVD_TOKEN);
      setContractEthBalance(ethers.formatEther(balance)); // Convert to readable ETH
    } catch (err) {
      console.error("Failed to fetch contract ETH balance:", err.message);
    }
  }, [provider]);

useEffect(() => {
  if (connected) {
    fetchContractEthBalance();
  }
}, [connected, fetchContractEthBalance]);



  // Fetch token sale info
  const fetchTokenSaleInfo = useCallback(async () => {
    if (!blvdToken) return;
    
    try {
      const saleInfo = await blvdToken.getSaleInfo();
      setTokenSaleInfo({
        price: ethers.formatUnits(saleInfo[0], 18),
        isActive: saleInfo[1],
        minAmount: ethers.formatEther(saleInfo[2]),
        maxAmount: ethers.formatEther(saleInfo[3]),
        ethBalance: ethers.formatEther(saleInfo[4])
      });
      
      const metrics = await blvdToken.getTokenMetrics();
      setTokenMetrics({
        currentSupply: ethers.formatUnits(metrics[0], 18),
        burnedAmount: ethers.formatUnits(metrics[1], 18),
        rewardPool: ethers.formatUnits(metrics[2], 18),
        treasuryPool: ethers.formatUnits(metrics[3], 18),
        maxSupply: ethers.formatUnits(metrics[4], 18)
      });
    } catch (err) {
      console.error("Failed to fetch token sale info:", err);
      setError("Failed to load token sale information");
    }
  }, [blvdToken]);
  
  // Fetch marketplace data
  const fetchMarketplaceData = useCallback(async () => {
    if (!marketplace || !connected) return;
    
    try {
      // Get fee percentage
      const fee = await marketplace.getFeePercentage();
      setMarketplaceFee(fee.toString());
      
      // Get active listings
      // This is a simplified approach - in a real app you'd implement pagination
      const listings = await marketplace.getActiveListingsByContract(CONTRACT_ADDRESSES.GAME_ASSET_NFT, 0, 100);
      
      const listingPromises = listings.filter(id => id > 0).map(async (listingId) => {
        const details = await marketplace.getListingDetails(listingId);
        return {
          listingId,
          seller: details[0],
          nftContract: details[1],
          tokenId: details[2],
          price: ethers.formatUnits(details[3], 18),
          isActive: details[4],
          createdAt: details[5]
        };
      });
      
      const activeListings = await Promise.all(listingPromises);
      setActiveListings(activeListings);
      
      // Get user offers
      if (account) {
        const offerIds = await marketplace.getUserActiveOffers(account);
        
        const offerPromises = offerIds.map(async (offerId) => {
          const details = await marketplace.getOfferDetails(offerId);
          return {
            offerId,
            buyer: details[0],
            nftContract: details[1],
            tokenId: details[2],
            price: ethers.formatUnits(details[3], 18),
            expiresAt: details[4],
            isActive: details[5]
          };
        });
        
        const activeOffers = await Promise.all(offerPromises);
        setUserOffers(activeOffers);
      }
    } catch (err) {
      console.error("Failed to fetch marketplace data:", err);
      setError("Failed to load marketplace data");
    }
  }, [marketplace, connected, account]);
  
  // BLVD Token Functions
  
  // Buy BLVD tokens
  const buyBlvdTokens = useCallback(async (ethAmount) => {
    if (!blvdToken || !connected) return;
    
    try {
      setLoading(true);
      
      // Convert ETH amount to wei
      const weiAmount = ethers.parseEther(ethAmount);
      
      // Make transaction
      const tx = await blvdToken.buyTokens({ value: weiAmount });
      await tx.wait();
      
      // Refresh balances
      await fetchUserData();
      await fetchTokenSaleInfo();
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Failed to buy tokens:", err);
      setError(err.message);
      setLoading(false);
      return false;
    }
  }, [blvdToken, connected, fetchUserData, fetchTokenSaleInfo]);
  
  // NFT Functions
  
  // Approve marketplace to transfer NFT
  const approveNFTForMarketplace = useCallback(async (tokenId) => {
    if (!gameAssetNFT || !connected) return;
    
    try {
      setLoading(true);
      
      const tx = await gameAssetNFT.approve(CONTRACT_ADDRESSES.MARKETPLACE, tokenId);
      await tx.wait();
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Failed to approve NFT:", err);
      setError(err.message);
      setLoading(false);
      return false;
    }
  }, [gameAssetNFT, connected]);
  
  // Use NFT (in-game functionality)
  const useNFT = useCallback(async (tokenId) => {
    if (!gameAssetNFT || !connected) return;
    
    try {
      setLoading(true);
      
      const tx = await gameAssetNFT.useAsset(tokenId);
      await tx.wait();
      
      // Refresh NFT data
      await fetchUserData();
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Failed to use NFT:", err);
      setError(err.message);
      setLoading(false);
      return false;
    }
  }, [gameAssetNFT, connected, fetchUserData]);
  
  // Marketplace Functions
  
  // Approve BLVD tokens for marketplace
  const approveTokensForMarketplace = useCallback(async (amount) => {
    if (!blvdToken || !connected) return;
    
    try {
      setLoading(true);
      
      // Convert amount to proper units
      const tokenAmount = ethers.parseUnits(amount, 18);
      
      const tx = await blvdToken.approve(CONTRACT_ADDRESSES.MARKETPLACE, tokenAmount);
      await tx.wait();
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Failed to approve tokens:", err);
      setError(err.message);
      setLoading(false);
      return false;
    }
  }, [blvdToken, connected]);
  
  // Create listing
  const createListing = useCallback(async (tokenId, price) => {
    if (!marketplace || !connected) return;
    
    try {
      setLoading(true);
      
      // Convert price to proper units
      const tokenPrice = ethers.parseUnits(price, 18);
      
      // First approve the NFT if not already approved
      const isApproved = await gameAssetNFT.getApproved(tokenId);
      if (isApproved !== CONTRACT_ADDRESSES.MARKETPLACE) {
        await approveNFTForMarketplace(tokenId);
      }
      
      // Create listing
      const tx = await marketplace.createListing(
        CONTRACT_ADDRESSES.GAME_ASSET_NFT,
        tokenId,
        tokenPrice
      );
      await tx.wait();
      
      // Refresh marketplace data
      await fetchMarketplaceData();
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Failed to create listing:", err);
      setError(err.message);
      setLoading(false);
      return false;
    }
  }, [marketplace, connected, gameAssetNFT, approveNFTForMarketplace, fetchMarketplaceData]);
  
  // Buy NFT from listing
  const buyNFT = useCallback(async (listingId, price) => {
    if (!marketplace || !connected || !blvdToken) return;
    
    try {
      setLoading(true);
      
      // Convert price to proper units
      const tokenPrice = ethers.parseUnits(price, 18);
      
      // First approve tokens if not already approved
      const allowance = await blvdToken.allowance(account, CONTRACT_ADDRESSES.MARKETPLACE);
      if (allowance < tokenPrice) {
        await approveTokensForMarketplace(price);
      }
      
      // Buy the NFT
      const tx = await marketplace.buyItem(listingId);
      await tx.wait();
      
      // Refresh data
      await fetchUserData();
      await fetchMarketplaceData();
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Failed to buy NFT:", err);
      setError(err.message);
      setLoading(false);
      return false;
    }
  }, [marketplace, connected, blvdToken, account, approveTokensForMarketplace, fetchUserData, fetchMarketplaceData]);
  
  // Create offer
  const createOffer = useCallback(async (tokenId, price, expirationTimeInHours) => {
    if (!marketplace || !connected || !blvdToken) return;
    
    try {
      setLoading(true);
      
      // Convert price to proper units
      const tokenPrice = ethers.parseUnits(price, 18);
      
      // Calculate expiration time
      const expirationTime = Math.floor(Date.now() / 1000) + (expirationTimeInHours * 60 * 60);
      
      // First approve tokens if not already approved
      const allowance = await blvdToken.allowance(account, CONTRACT_ADDRESSES.MARKETPLACE);
      if (allowance < tokenPrice) {
        await approveTokensForMarketplace(price);
      }
      
      // Create the offer
      const tx = await marketplace.createOffer(
        CONTRACT_ADDRESSES.GAME_ASSET_NFT,
        tokenId,
        tokenPrice,
        expirationTime
      );
      await tx.wait();
      
      // Refresh data
      await fetchUserData();
      await fetchMarketplaceData();
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Failed to create offer:", err);
      setError(err.message);
      setLoading(false);
      return false;
    }
  }, [marketplace, connected, blvdToken, account, approveTokensForMarketplace, fetchUserData, fetchMarketplaceData]);
  
  // Accept offer
  const acceptOffer = useCallback(async (offerId) => {
    if (!marketplace || !connected) return;
    
    try {
      setLoading(true);
      
      // Accept the offer
      const tx = await marketplace.acceptOffer(offerId);
      await tx.wait();
      
      // Refresh data
      await fetchUserData();
      await fetchMarketplaceData();
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Failed to accept offer:", err);
      setError(err.message);
      setLoading(false);
      return false;
    }
  }, [marketplace, connected, fetchUserData, fetchMarketplaceData]);
  
  // Cancel listing
  const cancelListing = useCallback(async (listingId) => {
    if (!marketplace || !connected) return;
    
    try {
      setLoading(true);
      
      // Cancel the listing
      const tx = await marketplace.cancelListing(listingId);
      await tx.wait();
      
      // Refresh marketplace data
      await fetchMarketplaceData();
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Failed to cancel listing:", err);
      setError(err.message);
      setLoading(false);
      return false;
    }
  }, [marketplace, connected, fetchMarketplaceData]);
  
  // Cancel offer
  const cancelOffer = useCallback(async (offerId) => {
    if (!marketplace || !connected) return;
    
    try {
      setLoading(true);
      
      // Cancel the offer
      const tx = await marketplace.cancelOffer(offerId);
      await tx.wait();
      
      // Refresh marketplace data
      await fetchMarketplaceData();
      await fetchUserData();
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Failed to cancel offer:", err);
      setError(err.message);
      setLoading(false);
      return false;
    }
  }, [marketplace, connected, fetchMarketplaceData, fetchUserData]);
  
  // Initialize on component mount
  useEffect(() => {
    if (window.ethereum) {
      // Initial setup
      initializeWeb3();
      
      // Setup event listeners
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User has disconnected
          disconnectWallet();
        } else {
          // User has switched accounts
          initializeWeb3();
        }
      };
      
      const handleChainChanged = () => {
        window.location.reload();
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      // Cleanup
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [initializeWeb3, disconnectWallet]);
  
  // Fetch data when connected
  useEffect(() => {
    if (connected && blvdToken && gameAssetNFT && marketplace) {
      fetchUserData();
      fetchTokenSaleInfo();
      fetchMarketplaceData();
    }
  }, [connected, blvdToken, gameAssetNFT, marketplace, fetchUserData, fetchTokenSaleInfo, fetchMarketplaceData]);
  
  // Context value
  const contextValue = {
    // Connection state
    account,
    provider,
    signer,
    connected,
    chainId,
    error,
    loading,
    
    // Connection functions
    connectWallet,
    disconnectWallet,
    
    // Contract instances
    blvdToken,
    gameAssetNFT,
    marketplace,
    
    // User data
    blvdBalance,
    ethBalance,
    ownedNFTs,
    tokenSaleInfo,
    tokenMetrics,
    
    // Marketplace data
    activeListings,
    userOffers,
    marketplaceFee,
    
    // BLVD Token functions
    buyBlvdTokens,
    
    // NFT functions
    approveNFTForMarketplace,
    useNFT,
    
    // Marketplace functions
    approveTokensForMarketplace,
    createListing,
    buyNFT,
    createOffer,
    acceptOffer,
    cancelListing,
    cancelOffer,
    
    // Fetch functions
    fetchUserData,
    fetchTokenSaleInfo,
    fetchMarketplaceData
  };
  
  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook for using Web3 context
export const useWeb3 = () => useContext(Web3Context);

export default Web3Context;