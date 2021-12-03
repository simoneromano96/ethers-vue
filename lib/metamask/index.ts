import type { ExternalProvider } from "@ethersproject/providers"
import type { MetaMaskInpageProvider } from "@metamask/providers"

/**
 * Creates a metamask based provider
 * @returns
 */
export const initMetamask = async () => {
  const { Web3Provider } = await import("@ethersproject/providers")
  const ethereum = window?.ethereum
  if (!ethereum) {
    throw new Error("Ethereum missing")
  }
  const externalProvider = ethereum as unknown as ExternalProvider & MetaMaskInpageProvider
  const provider = new Web3Provider(externalProvider, "any")

  const signer = provider.getSigner()
  return { provider, signer, externalProvider }
}
