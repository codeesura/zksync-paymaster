import * as ethers from "ethers";
import dotenv from 'dotenv';
dotenv.config();

import { Provider, Wallet } from "zksync-ethers";

import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Colors } from '../types';

const timestamp = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${Colors.gray}[${hours}:${minutes}:${seconds}]${Colors.reset}`;
};

export default async function deployPaymaster(hre: HardhatRuntimeEnvironment) {
  const provider = new Provider("https://mainnet.era.zksync.io");

  const deployerWalletPrivateKey = process.env.DEPLOYER_WALLET_PRIVATE_KEY;
  if (!deployerWalletPrivateKey) {
    throw new Error("Deployer wallet private key is not set in .env file");
  }

  const wallet = new Wallet(deployerWalletPrivateKey, provider);

  const emptyWallet = Wallet.createRandom();
  console.log(timestamp() + `${Colors.blue} Empty wallet's address: ${emptyWallet.address}${Colors.reset}`);
  console.log(timestamp() + `${Colors.blue} Empty wallet's private key: ${emptyWallet.privateKey}${Colors.reset}`);

  const deployer = new Deployer(hre, wallet);

  console.group(`${Colors.yellow}Deployment Process${Colors.reset}`);

  const erc20Artifact = await deployer.loadArtifact("MyERC20");
  const erc20 = await deployer.deploy(erc20Artifact, [
    "MyToken",
    "MyToken",
    18,
  ], {
    gasLimit: 4000000
  });
  console.log(timestamp() + `${Colors.magenta} ERC20 address: ${erc20.address}${Colors.reset}`);

  const paymasterArtifact = await deployer.loadArtifact("MyPaymaster");
  const paymaster = await deployer.deploy(paymasterArtifact, [erc20.address], {
    gasLimit: 4000000
  });
  console.log(timestamp() + `${Colors.magenta} Paymaster address: ${paymaster.address}${Colors.reset}`);

  await (
    await deployer.zkWallet.sendTransaction({
      to: paymaster.address,
      value: ethers.utils.parseEther("0.001"),
      gasLimit: 4000000
    })
  ).wait();

  let paymasterBalance = await provider.getBalance(paymaster.address);

  console.log(timestamp() + `${Colors.cyan} Paymaster ETH balance is now ${paymasterBalance.toString()}${Colors.reset}`);

  await
    (await erc20.mint(emptyWallet.address, 3, {
      gasLimit: 4000000
    })).wait();

    console.log(timestamp() + `${Colors.green} Minted 3 tokens for the empty wallet${Colors.reset}`);
    console.groupEnd();
  return {
    erc20Address: erc20.address,
    paymasterAddress: paymaster.address,
    emptyWalletPrivateKey: emptyWallet.privateKey,
  };
}
