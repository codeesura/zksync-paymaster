## Overview

`zksync-paymaster` is a repository containing scripts and configurations for deploying and utilizing a paymaster smart contract on the zkSync network. This repository provides a streamlined way to interact with ERC20 tokens and a paymaster contract, specifically designed to work with Hardhat and zkSync's Ethereum Layer 2 scaling solution.

## Prerequisites

Before you start, ensure you have the following installed:
 
- [Node.js](https://nodejs.org/en) (version 18 or higher)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) or [npm](https://www.npmjs.com/package/npm)
- [Hardhat](https://hardhat.org/hardhat-runner/docs/getting-started)
- [Docker](https://www.docker.com/) (for Docker-based setup)

## Installation

### Manual Installation

1. Clone the Repository:

```bash
git clone https://github.com/codeesura/zksync-paymaster.git
cd zksync-paymaster
cp .env.example .env
```

2. Install Dependencies:

```bash
yarn install
# or
npm install
```

3. Environment Setup:
Create a `.env` file in the root directory and set the following environment variables:

```bash
DEPLOYER_WALLET_PRIVATE_KEY=your_wallet_private_key_here
```

### Docker-Based Installation

1. Clone the Repository:

```bash
git clone https://github.com/codeesura/zksync-paymaster.git
cd zksync-paymaster
cp .env.example .env
```

2. Set Up .env File

Ensure your `.env` file contains the necessary private key:

```bash
DEPLOYER_WALLET_PRIVATE_KEY=your_wallet_private_key_here
```

3. Build and Run with Docker:

```bash
docker build -t zksync-paymaster .
docker run -p 3000:3000 zksync-paymaster
```



