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
        '0xfdb4672195db2e74e75cfab8f29c9ae14386281b8f922892b5767a140c83c156'
      ]
    },
  },
};

export default config;
