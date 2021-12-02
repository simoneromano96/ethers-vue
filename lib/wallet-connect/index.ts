import { Web3Provider } from "@ethersproject/providers"

/**
 * Creates a wallet-connect based provider
 * @returns
 */
export const initWalletConnect = async () => {
  const { default: WalletConnectProvider } = await import("@walletconnect/web3-provider")

  const externalProvider = new WalletConnectProvider({
    infuraId: "27e484dcd9e3efcfd25a83a78777cdf1", // Required
    // rpc: {
    //   1: "https://mainnet.mycustomnode.com",
    //   3: "https://ropsten.mycustomnode.com",
    //   100: "https://dai.poa.network",
    //   // ...
    // },
  })
  const provider = new Web3Provider(externalProvider)
  console.log("🚀 ~ file: index.ts ~ line 20 ~ initWalletConnect ~ provider", provider)
  const signer = externalProvider.getSigner()
  console.log("🚀 ~ file: index.ts ~ line 21 ~ initWalletConnect ~ signer", signer)
  return { provider, signer }
}
