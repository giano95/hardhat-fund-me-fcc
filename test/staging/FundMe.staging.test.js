const { assert } = require("chai")
const { network, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

// Ternary operator use to skip we are in a development chain
developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe Staging Tests", async function () {
      let deployer
      let fundMe
      let sendValue

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        fundMe = await ethers.getContract("FundMe", deployer)
        sendValue = ethers.utils.parseEther("0.06")
      })

      // Test if we can do simple fund and withdraw on an real net
      it("allows people to fund and withdraw", async function () {
        // I added the wait() in the response because sometimes the withdraw doesn't work
        // Even if the test passes it doesn't work (now is a lot more slow)
        const txResponseFundMe = await fundMe.fund({ value: sendValue })
        await txResponseFundMe.wait()
        const txResponseWithdraw = await fundMe.withdraw()
        await txResponseWithdraw.wait()

        const endingFundMeBalance = await fundMe.provider.getBalance(
          fundMe.address
        )

        assert.equal(endingFundMeBalance.toString(), "0")
      })
    })
