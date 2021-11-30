export enum AvailableProviders {
  Metamask,
  Ledger,
}

// export class GenericProvider {}

const initLedger = async () => {
  const { LedgerSigner } = await import("@ethersproject/hardware-wallets")
  const { Web3Provider } = await import("@ethersproject/providers")
  const signer = new LedgerSigner()
  const provider = new Web3Provider({})
  return { signer, provider }
}

export const initProvider = async (provider: AvailableProviders) => {
  switch (provider) {
    case AvailableProviders.Metamask: {
      const { initMetamask } = await import("./metamask")
      const { provider, signer, ethereum } = await initMetamask()
      ethereum.on("connect", (connectInfo) => {
        console.log("🚀 ~ file: index.ts ~ line 27 ~ ethereum.on ~ connectInfo", connectInfo)
      })
      ethereum.on("disconnect", (error) => {
        console.log("🚀 ~ file: index.ts ~ line 30 ~ ethereum.on ~ error", error)
      })
      ethereum.on("accountsChanged", (accounts) => {
        console.log("🚀 ~ file: index.ts ~ line 22 ~ ethereum.on ~ accounts", accounts)
      })
      ethereum.on("chainChanged", (chainId) => {
        console.log("🚀 ~ file: index.ts ~ line 24 ~ ethereum.on ~ chainId", chainId)
      })
      ethereum.on("message", (message) => {
        console.log("🚀 ~ file: index.ts ~ line 35 ~ ethereum.on ~ message", message)
      })
      return { signer, provider }
    }
    case AvailableProviders.Ledger: {
      const { signer, provider } = await initLedger()
      return { signer, provider }
    }
  }
}
