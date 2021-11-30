export enum ProviderTypes {
  Metamask = "Metamask",
  Ledger = "Ledger",
}

export enum ConnectorEvents {
  AccountsChanged = "AccountsChanged",
  Connect = "Connect",
  Disconnect = "Disconnect",
  ChainChanged = "ChainChanged",
  Message = "Message",
}

export class Connector extends EventTarget {
  constructor(private providerType: ProviderTypes) {
    super()
  }

  emit = (eventType: ConnectorEvents, detail: any) => {
    const event = new CustomEvent(eventType, { detail })
    this.dispatchEvent(event)
  }

  initProvider = async () => {
    switch (this.providerType) {
      case ProviderTypes.Metamask: {
        const { initMetamask } = await import("./metamask")
        const { provider, signer, ethereum } = await initMetamask()
        if (ethereum.on) {
          ethereum.on("connect", (connectInfo: any) => {
            this.emit(ConnectorEvents.Connect, connectInfo)
          })
          ethereum.on("disconnect", (error: any) => {
            this.emit(ConnectorEvents.Disconnect, error)
          })
          ethereum.on("accountsChanged", (accounts: string[]) => {
            this.emit(ConnectorEvents.AccountsChanged, accounts)
          })
          ethereum.on("chainChanged", (chainId: string) => {
            this.emit(ConnectorEvents.ChainChanged, chainId)
          })
          ethereum.on("message", (message: any) => {
            this.emit(ConnectorEvents.Message, message)
          })
        }
        return { signer, provider }
      }
      case ProviderTypes.Ledger: {
        const { signer, provider } = await initLedger()
        return { signer, provider }
      }
    }
  }
}

const initLedger = async () => {
  const { LedgerSigner } = await import("@ethersproject/hardware-wallets")
  const { Web3Provider } = await import("@ethersproject/providers")
  const signer = new LedgerSigner()
  const provider = new Web3Provider({})
  return { signer, provider }
}
