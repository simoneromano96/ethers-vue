import type { ExternalProvider } from "@ethersproject/providers"

export const initMetamask = async () => {
  const { Web3Provider } = await import("@ethersproject/providers")
  const ethereum = window?.ethereum
  if (!ethereum) {
    throw new Error("Ethereum missing")
  }
  const provider = new Web3Provider(ethereum as unknown as ExternalProvider)
  
  const signer = provider.getSigner()
  return { provider, signer, ethereum }
}
