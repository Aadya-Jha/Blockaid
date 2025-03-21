require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_SEPOLIA_RPC,
      accounts: [process.env.PRIVATE_KEY],
    },
    mumbai: {
      url: process.env.ALCHEMY_MUMBAI_RPC,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
