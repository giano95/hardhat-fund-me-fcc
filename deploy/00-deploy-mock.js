const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const DECIMALS = 8
const INITIAL_PRICE = 2000 * 10 ** 8

// It's a way to export speciafically these modules in order to use it
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  if (developmentChains.includes(network.name)) {
    //
    log("Local network detected! Deploying mocks...")
    //
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE],
    })
    log("Mocks Deployed!")
    log("------------------------------------------------")
    log(
      "You are deploying to a local network, you'll need a local network running to interact"
    )
    log(
      "Please run `npx hardhat console` to interact with the deployed smart contracts!"
    )
    log("------------------------------------------------")
  }
}

// In order to select what to deploy we use tags, this means that this deploy run when
// we say "all" or "mocks"
module.exports.tags = ["all", "mocks"]
