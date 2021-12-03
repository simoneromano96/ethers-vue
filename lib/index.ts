import Emittery from "emittery"

import type { JsonRpcSigner, Network, Web3Provider, ExternalProvider } from "@ethersproject/providers"
import type { MetaMaskInpageProvider } from "@metamask/providers"
import type WalletConnectProvider from "@walletconnect/web3-provider"

/**
 * Supported provider types.
 */
export enum ProviderTypes {
  Metamask = "Metamask",
  Ledger = "Ledger",
  WalletConnect = "WalletConnect",
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
  NetworkChanged = "NetworkChanged",
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
  [ConnectorEvents.NetworkChanged]: Network
}

/**
 * A generic Connector class used to interact with the user's wallet
 */
export class Connector {
  /**
   * The event emitter
   */
  public eventEmitter: Emittery<EmittedEvents>
  /**
   * The web3 provider, should this be private?
   */
  public provider?: Web3Provider
  /**
   * The transaction signer, should this be private?
   */
  public signer?: JsonRpcSigner
  /**
   * The external provider
   */
  #externalProvider?: MetaMaskInpageProvider | WalletConnectProvider

  constructor(private providerType: ProviderTypes) {
    this.eventEmitter = new Emittery<EmittedEvents>()
  }

  private requireProviderInitialized() {
    if (!this.provider) {
      throw new Error("Provider has not been initialized, call initProvider() first")
    }
    return this.provider
  }

  private requireExternalProviderInitialized() {
    if (!this.#externalProvider) {
      throw new Error("Provider has not been initialized, call initProvider() first")
    }
    return this.#externalProvider
  }

  private addEventListenersToProvider() {
    const provider = this.requireProviderInitialized()
    // Subscribe to network change
    provider.on("network", (newNetwork: Network) => {
      console.log("🚀 ~ file: index.ts ~ line 98 ~ Connector ~ provider.on ~ newNetwork", newNetwork)
      this.eventEmitter.emit(ConnectorEvents.NetworkChanged, newNetwork)
    })
    // Subscribe to accounts change
    // provider.on("accountsChanged", (accounts: any) => {
    //   console.log("accountsChanged", accounts)
    // })
    // Subscribe to chainId change
    provider.on("chainChanged", (chainId: number) => {
      console.log(chainId)
    })
    // Subscribe to session connection
    provider.on("connect", () => {
      console.log("connect")
    })
    // Subscribe to session disconnection
    provider.on("disconnect", (code: number, reason: string) => {
      console.log(code, reason)
    })
  }

  private addEventListenersToExternalProvider() {
    const externalProvider = this.requireExternalProviderInitialized()
    externalProvider.on("connect", (connectInfo: any) => {
      console.log("🚀 ~ file: index.ts ~ line 125 ~ Connector ~ externalProvider.on ~ connectInfo", connectInfo)
      this.eventEmitter.emit(ConnectorEvents.Connect, connectInfo)
    })
    externalProvider.on("disconnect", (error: any) => {
      console.log("🚀 ~ file: index.ts ~ line 129 ~ Connector ~ externalProvider.on ~ error", error)
      this.eventEmitter.emit(ConnectorEvents.Disconnect, error)
    })
    // Subscribe to accounts change
    externalProvider.on("accountsChanged", (accounts: any) => {
      this.eventEmitter.emit(ConnectorEvents.AccountsChanged, accounts)
      console.log("🚀 ~ file: index.ts ~ line 135 ~ Connector ~ externalProvider.on ~ accounts", accounts)
    })
    externalProvider.on("chainChanged", () => {
      // Currently empty, this is handled by the provider
    })
    externalProvider.on("message", (message: any) => {
      this.eventEmitter.emit(ConnectorEvents.Message, message)
      console.log("🚀 ~ file: index.ts ~ line 142 ~ Connector ~ externalProvider.on ~ message", message)
    })
  }

  /**
   * Initialize the specified provider
   *
   * Maybe we should pass the providerType here?
   * @returns
   */
  initProvider = async () => {
    switch (this.providerType) {
      case ProviderTypes.Metamask: {
        const { initMetamask } = await import("./metamask")
        const { provider, signer, externalProvider } = await initMetamask()
        this.provider = provider
        this.signer = signer
        this.#externalProvider = externalProvider
        this.addEventListenersToExternalProvider()
        break
      }
      case ProviderTypes.WalletConnect: {
        const { initWalletConnect } = await import("./wallet-connect")
        const { provider, signer, externalProvider } = await initWalletConnect()
        this.provider = provider
        this.signer = signer
        this.#externalProvider = externalProvider
        this.addEventListenersToExternalProvider()
        break
      }
      // case ProviderTypes.Ledger: {
      //   const { signer, provider } = await initLedger()
      // }
    }
    this.addEventListenersToProvider()
  }

  /**
   * Requests the provider to access the user's wallet, will throw if the provider has not been initialized.
   */
  activate = async () => {
    switch (this.providerType) {
      case ProviderTypes.Metamask: {
        const provider = this.requireProviderInitialized()
        const accounts = await provider.send("eth_requestAccounts", [])
        this.eventEmitter.emit(ConnectorEvents.AccountsChanged, accounts)
        break
      }
      case ProviderTypes.WalletConnect: {
        const externalProvider = this.requireExternalProviderInitialized() as WalletConnectProvider
        await externalProvider.enable()
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
