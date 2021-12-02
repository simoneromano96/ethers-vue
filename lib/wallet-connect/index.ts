
/**
 * Creates a wallet-connect based provider
 * @returns
 */
export const initWalletConnect = async () => {
  console.log("initWalletConnect")
  var global = window
  const { default: WalletConnectProvider } = await import("@walletconnect/web3-provider/dist/esm")
  console.log({ WalletConnectProvider })

  const externalProvider = new WalletConnectProvider({
    // Required
    infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
    // qrcode: false,
    // rpc: {
    //   1: "https://mainnet.mycustomnode.com",
    //   3: "https://ropsten.mycustomnode.com",
    //   100: "https://dai.poa.network",
    //   // ...
    // },
  })
  const { Web3Provider } = await import("@ethersproject/providers")

  const provider = new Web3Provider(externalProvider)
  console.log("🚀 ~ file: index.ts ~ line 20 ~ initWalletConnect ~ provider", provider)
  const signer = externalProvider.getSigner()
  console.log("🚀 ~ file: index.ts ~ line 21 ~ initWalletConnect ~ signer", signer)
  return { provider, signer }
}
