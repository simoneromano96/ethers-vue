import { providers } from "ethers";

interface Window {
  ethereum?: providers.ExternalProvider;
}
