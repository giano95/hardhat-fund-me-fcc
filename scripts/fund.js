const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
  const { deployer } = await getNamedAccounts()
  const fundMe = await ethers.getContract("FundMe", deployer)
  const sendValue = ethers.utils.parseEther("0.06")

  console.log("Funding...")
  const txResponse = await fundMe.fund({ value: sendValue })
  await txResponse.wait(1)

  console.log("Funded!")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
