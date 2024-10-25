import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'http://localhost:8545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '0x68fc6537ab0264aac0dfc222c90819e9d11f2f4fd4e4558e9d00024f6865df5b'
      ]
    },
  },
};

export default config;
