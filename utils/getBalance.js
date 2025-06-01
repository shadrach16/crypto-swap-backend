const { ethers } = require("ethers");

const getTokenBalance = async (walletAddress, rpcUrl, contractAddress, decimals) => {
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  const erc20Abi = [
    "function balanceOf(address owner) view returns (uint256)"
  ];

  const contract = new ethers.Contract(contractAddress, erc20Abi, provider);
  const rawBalance = await contract.balanceOf(walletAddress);
  return parseFloat(ethers.formatUnits(rawBalance, decimals));
};

module.exports = getTokenBalance;
