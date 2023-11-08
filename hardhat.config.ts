import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.22",
    settings: {
      optimizer: {
        enabled: true,
        runs: 999999,
      },
      viaIR: true,
    }
  },
  gasReporter: {
    enabled: (process.env.REPORT_GAS) ? true : false
  },
};

export default config;
