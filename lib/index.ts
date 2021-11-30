/**
 * Supported provider types.
 */
export enum ProviderTypes {
  Metamask = "Metamask",
  Ledger = "Ledger",
}

/**
 * Types of events that the Connector class will emit.
 */
export enum ConnectorEvents {
  AccountsChanged = "AccountsChanged",
  Connect = "Connect",
  Disconnect = "Disconnect",
  ChainChanged = "ChainChanged",
  Message = "Message",
}

/**
 * A generic Connector class used to interact with the user's wallet
 */
export class Connector extends EventTarget {
  constructor(private providerType: ProviderTypes) {
    super()
  }

  /**
   * Dispatches an event from the Connector
   * @param type A supported event type to emit.
   * @param detail Additional data to use in the emitted event.
   */
  protected emit = (type: ConnectorEvents, detail: any) => {
    const event = new CustomEvent(type, { detail })
    this.dispatchEvent(event)
  }

  /**
   * Wraps the EventTarget event listener.
   *
   * Refer to EventTarget.addEventListener documentation.
   * @param type A supported event type to listen to.
   * @param callback A callback function called when the event is emitted.
   * @param options Additional options to pass to EventTarget.addEventListener.
   */
  addEventListener = (type: ConnectorEvents, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
    super.addEventListener(type, callback, options)
  }

  /**
   * Wraps the EventTarget event listener.
   *
   * Refer to EventTarget.removeEventListener documentation.
   * @param type A supported event type to remove.
   * @param callback A callback function called when the event is emitted.
   * @param options Additional options to pass to EventTarget.removeEventListener.
   */
  removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | EventListenerOptions) {
    super.removeEventListener(type, callback, options)
  }

  /**
   * Initialize the specified provider
   * @returns
   */
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
          ethereum.on("accountsChanged", (accounts: any) => {
            this.emit(ConnectorEvents.AccountsChanged, accounts)
          })
          ethereum.on("chainChanged", (chainId: any) => {
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

/**
 * Creates a ledger based provider
 * @returns
 */
const initLedger = async () => {
  const { LedgerSigner } = await import("@ethersproject/hardware-wallets")
  const { Web3Provider } = await import("@ethersproject/providers")
  const signer = new LedgerSigner()
  const provider = new Web3Provider({})
  return { signer, provider }
}
