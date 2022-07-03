<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="https://hardhat.org/_next/static/media/hardhat-logo.5c5f687b.svg" alt="Logo" width="300" height="80">
  </a>
<br />
<br />
<h1 align="center">Hardhat Fund Me</h1>

  <p align="center">
    This is my implementation of the Hardhat FundMe project develop by Patrick Collins for <a href="https://www.freecodecamp.org/">FreeCodeCamp</a>
    <br />
    <br />
    <br />
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

This project provides basic operation like funding a contract and withdraw the total funded value. It use the Hardhat development enviroment in order to deploy the contract, testing it and also running some scripts. Along with local hosting dev network it also works on Rinkeby Network.

### Built With

- [Hardhat](https://hardhat.org/)
- [Ethers.js](https://github.com/ethers-io/ethers.js/)
- [Waffle](https://getwaffle.io/)
- [Prettier](https://prettier.io/)
- [Solidity coverage](https://www.npmjs.com/package/solidity-coverage)
- [Solhint](https://www.npmjs.com/package/solhint)

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

I leave the command i use to install it on linux but they will change depending on your operating system, for more info check the documentation.

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  ```sh
  sudo apt install git-all
  ```
- [Nodejs](https://nodejs.org/en/)
  ```sh
  curl -fsSL https://deb.nodesource.com/setup_lts.x
  sudo apt-get install -y nodejs
  ```
- [Yarn](https://yarnpkg.com/getting-started/install)
  ```curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
  sudo apt update && sudo apt install yarn
  ```

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/giano95/hardhat-fund-me-fcc.git
   ```
2. Change the dir:
   ```sh
   cd hardhat-fund-me-fcc
   ```
3. Install all the dependecies:
   ```js
   yarn
   ```

### Set up

You need to add the following variables to an `.env` file, similar to what you see in `.env.example`.

- `PRIVATE_KEY`: The private key of your account (like from [metamask](https://metamask.io/)).
- `RINKEBY_RPC_URL`: This is a url of a rinkeby testnet node, we use it like an entry point to the network. You can get one from [Alchemy](https://alchemy.com/?a=673c802981)
- `ETHERSCAN_API_KEY`: This is a API key used to automatically verify your contract. You can get one from [Etherscan](https://etherscan.io/myapikey) after yor register yourself.
- `COINMARKETCAP_API_KEY`: This is a API key we use to estimate the gas fee in USD. You can get one from [CoinMarketCap](https://pro.coinmarketcap.com/signup)

<!-- USAGE EXAMPLES -->

## Usage

### Deploy

First thing we gonna do after we are done with the set up stuff is deploy the contract:

```
yarn hardhat deploy
```

This will automatically deploy to our local Hardhat network, if we wanna deploy to a real network like Rinkeby type in:

```
yarn hardhat deploy --network rinkeby
```

## Testing

After deploying the contract we can do some test, locally:

```
yarn hardhat test
```

Or on Rinkeby:

```
yarn hardhat test --network rinkeby
```

### Test Coverage

This allow us to have a clue about the coverage of our test

```
yarn hardhat coverage
```

<!-- CONTRIBUTING -->

## Thanks

A special Thanks to [Patrick Collins](https://github.com/PatrickAlphaC/) for creating this project and help other peoples to get in Blockchain development! Here you can find his original [repo](https://github.com/PatrickAlphaC/hardhat-fund-me-fcc/) and here the [video course](https://www.youtube.com/watch?v=gyMwXuJrbJQ) he made for FreeCodeCamp.org.

<p align="right">-<a href="#top"> back to top </a>-</p>
