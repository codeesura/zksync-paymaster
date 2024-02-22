import * as ethers from "ethers";
import { Provider, Wallet, utils } from "zksync-ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Colors } from '../types';

// Zaman damgası fonksiyonu
const timestamp = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${Colors.gray}[${hours}:${minutes}:${seconds}]${Colors.reset}`;
};

function getToken(hre: HardhatRuntimeEnvironment, wallet: Wallet, tokenAddress: string) {
  const artifact = hre.artifacts.readArtifactSync("MyERC20");
  return new ethers.Contract(tokenAddress, artifact.abi, wallet);
}

export default async function usePaymaster(
  hre: HardhatRuntimeEnvironment, 
  tokenAddress: string, 
  paymasterAddress: string, 
  emptyWalletPrivateKey: string
) {
  const provider = new Provider("https://mainnet.era.zksync.io");
  const emptyWallet = new Wallet(emptyWalletPrivateKey, provider);

  const ethBalance = await emptyWallet.getBalance();
  if (!ethBalance.eq(0)) {
    console.error(timestamp() + `${Colors.red} Error: The wallet is not empty!${Colors.reset}`);
    throw new Error("The wallet is not empty!");
  }

  console.group(`${Colors.yellow} ERC20 Token and Paymaster Balances${Colors.reset}`);
  
  console.log(
    timestamp() + `${Colors.green} ERC20 token balance of the empty wallet before mint: ${await emptyWallet.getBalance(tokenAddress)}${Colors.reset}`,
  );

  let paymasterBalance = await provider.getBalance(paymasterAddress);

  const erc20 = getToken(hre, emptyWallet, tokenAddress);

  console.group(`${Colors.yellow} Token Minting Process${Colors.reset}`);

  const gasPrice = await provider.getGasPrice();
  const paymasterParams = utils.getPaymasterParams(paymasterAddress, {
    type: "ApprovalBased",
    token: tokenAddress,
    minimalAllowance: ethers.BigNumber.from(1),
    innerInput: new Uint8Array(),
  });

  const gasLimit = await erc20.estimateGas.mint(emptyWallet.address, 5, {
    customData: {
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      paymasterParams: paymasterParams,
    },
  });

  const fee = gasPrice.mul(gasLimit.toString());
  console.log(timestamp() + `${Colors.magenta} Transaction fee estimation is :>> ${fee.toString()}${Colors.reset}`);

  console.log(timestamp() + `${Colors.green} Minting 5 tokens for empty wallet via paymaster...${Colors.reset}`);
  await (await erc20.mint(emptyWallet.address, 5, {
    customData: {
      paymasterParams: paymasterParams,
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    },
  })).wait();

  console.groupEnd();

  console.group(`${Colors.yellow} Final Balances${Colors.reset}`);

  console.log(
    timestamp() + `${Colors.cyan} Paymaster ERC20 token balance is now ${await erc20.balanceOf(paymasterAddress)}${Colors.reset}`,
  );

  paymasterBalance = await provider.getBalance(paymasterAddress);
  console.log(timestamp() + `${Colors.cyan} Paymaster ETH balance is now ${paymasterBalance.toString()}${Colors.reset}`);

  console.log(
    timestamp() + `${Colors.green} ERC20 token balance of the empty wallet after mint: ${await emptyWallet.getBalance(tokenAddress)}${Colors.reset}`,
  );

  console.groupEnd();
  console.groupEnd();
}
