/**
 * Creates a wallet-connect based provider
 * @returns
 */
export const initWalletConnect = async () => {
  const { default: WalletConnectProvider } = await import("@walletconnect/web3-provider")

  const externalProvider = new WalletConnectProvider({
    // Required
    rpc: {
      1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      3: "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    },
    // qrcode: false,
  })

  const { Web3Provider } = await import("@ethersproject/providers")

  const provider = new Web3Provider(externalProvider)
  const signer = provider.getSigner()
  return { provider, signer, externalProvider }
}
