import type { JsonRpcSigner, Web3Provider } from "@ethersproject/providers"
import type { MetaMaskInpageProvider } from "@metamask/providers"
import Emittery from "emittery"

/**
 * Supported provider types.
 */
export enum ProviderTypes {
  Metamask = "Metamask",
  Ledger = "Ledger",
}

/**
 * Hexprefixed chainId, emitted when the provider has connected
 */
export interface ConnectInfo {
  chainId: string
}

/**
 * Some kind of message sent from the provider
 */
export interface ProviderMessage {
  type: string
  data: unknown
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
 * List of all events that are emitted by the Connector's eventEmitter.
 */
export interface EmittedEvents {
  [ConnectorEvents.AccountsChanged]: string[]
  [ConnectorEvents.Connect]: ConnectInfo
  [ConnectorEvents.Disconnect]: unknown
  [ConnectorEvents.ChainChanged]: string
  [ConnectorEvents.Message]: ProviderMessage
}

/**
 * A generic Connector class used to interact with the user's wallet
 */
export class Connector {
  /**
   * The event emitter
   */
  public eventEmitter: Emittery<EmittedEvents>
  #provider?: Web3Provider
  #signer?: JsonRpcSigner
  #ethereum?: MetaMaskInpageProvider

  constructor(private providerType: ProviderTypes) {
    this.eventEmitter = new Emittery<EmittedEvents>()
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
        this.#provider = provider
        this.#signer = signer
        this.#ethereum = ethereum
        if (ethereum.on) {
          ethereum.on("connect", (connectInfo: any) => {
            this.eventEmitter.emit(ConnectorEvents.Connect, connectInfo)
          })
          ethereum.on("disconnect", (error: any) => {
            this.eventEmitter.emit(ConnectorEvents.Disconnect, error)
          })
          ethereum.on("accountsChanged", (accounts: any) => {
            this.eventEmitter.emit(ConnectorEvents.AccountsChanged, accounts)
          })
          ethereum.on("chainChanged", (chainId: any) => {
            this.eventEmitter.emit(ConnectorEvents.ChainChanged, chainId)
          })
          ethereum.on("message", (message: any) => {
            this.eventEmitter.emit(ConnectorEvents.Message, message)
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

  private requireProviderInitialized() {
    if (!this.#provider) {
      throw new Error("Provider has not been initialized, call initProvider() first")
    }
    return this.#provider
  }

  private requireEthereumInitialized() {
    if (!this.#ethereum) {
      throw new Error("Ethereum provider has not been initialized, call initProvider() first")
    }
    return this.#ethereum
  }

  /**
   * Requests the provider to access the user's wallet, will throw if the provider has not been initialized.
   */
  activate = async () => {
    const provider = this.requireProviderInitialized()
    switch (this.providerType) {
      case ProviderTypes.Metamask: {
        const accounts = await provider.send("eth_requestAccounts", [])
        this.eventEmitter.emit(ConnectorEvents.AccountsChanged, accounts)
        break
      }
      default:
        break
    }
  }

  /**
   * TODO: Remove all the event listeners
   */
  dispose = () => {
    throw new Error("Unimplemented!")
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
