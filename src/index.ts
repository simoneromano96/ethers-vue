export const initMetamask = async () => {
  const { Web3Provider } = await import("@ethersproject/providers");
  if (!window.ethereum) {
    throw new Error("Ethereum missing");
  }
  const provider = new Web3Provider(window.ethereum);
  
  const signer = provider.getSigner();
  return { provider, signer };
};
