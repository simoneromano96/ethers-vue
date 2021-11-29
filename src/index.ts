export const add = (a: number, b: number) => a + b;

export const initMetamask = async () => {
  const ethers = await import("ethers");
  if (!window.ethereum) {
    throw new Error("Ethereum missing");
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return { provider, signer };
};
