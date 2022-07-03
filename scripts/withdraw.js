const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
  const { deployer } = await getNamedAccounts()
  const fundMe = await ethers.getContract("FundMe", deployer)

  console.log("Withdraw...")
  const txResponse = await fundMe.withdraw()
  await txResponse.wait(1)

  console.log("Got it back!")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
