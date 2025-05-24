import axios from 'axios'

const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY
const pinataSecretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY

export async function uploadToIPFS(file: File | Blob) {
  try {
    // Create form data
    const formData = new FormData()
    formData.append('file', file)

    // Upload to Pinata
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS', 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretKey
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      }
    )

    // Return IPFS URL
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
  } catch (error) {
    console.error('IPFS upload failed:', error)
    throw new Error('Failed to upload to IPFS')
  }
}

export async function uploadMetadataToIPFS(metadata: any) {
  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      metadata,
      {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretKey
        }
      }
    )

    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
  } catch (error) {
    console.error('Metadata upload failed:', error)
    throw new Error('Failed to upload metadata to IPFS')
  }
}

export async function fetchIPFSMetadata(ipfsUrl: string) {
  try {
    const response = await fetch(ipfsUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch IPFS metadata')
    }
    return await response.json()
  } catch (error) {
    console.error('Fetching IPFS metadata failed:', error)
    throw error
  }
}