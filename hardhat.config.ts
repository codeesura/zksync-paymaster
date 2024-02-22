import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

import { HardhatUserConfig } from "hardhat/config";

// dynamically changes endpoints for local tests
const zkSyncLocalTestnet =
  process.env.NODE_ENV == "test"
    ? {
        url: "http://localhost:3050",
        ethNetwork: "",
        zksync: true,
      }
    : {
        url: "https://mainnet.era.zksync.io",
        ethNetwork: "mainnet",
        zksync: true,
        verifyURL:
          "https://api.zksync.network/api",
      };

const config: HardhatUserConfig = {
  zksolc: {
    version: "latest",
    settings: {},
  },
  defaultNetwork: "zkSyncLocalTestnet",
  networks: {
    hardhat: {
      zksync: false,
    },
    zkSyncLocalTestnet,
  },
  solidity: {
    version: "0.8.17",
  },
};

export default config;
