const { assert, expect } = require("chai")
const { ethers, deployments } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

// Ternary operator use to skip we are not in a development chain
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function () {
      let fundMe
      let deployer
      let mockV3Aggregator
      let sendValue

      beforeEach(async function () {
        // wallet of the deployer
        deployer = (await getNamedAccounts()).deployer
        // a way to deploy all the contract using the tags
        await deployments.fixture(["all"])
        // actually contracts
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        )
      })

      describe("constructor", function () {
        it("sets the aggregator addresses correctly", async () => {
          // get the priceFeed address and owner address from the contract
          const priceFeed = await fundMe.getPriceFeed()
          const owner = await fundMe.getOwner()

          // Compare them to one we get from the deploy
          assert.equal(priceFeed, mockV3Aggregator.address)
          assert.equal(owner, deployer)
        })
      })

      describe("fund", function () {
        // Don't send nothing through the fund() function
        it("fail if you don't send any ETH", async () => {
          await expect(fundMe.fund()).to.be.revertedWith(
            "You need to spend more ETH!"
          )
        })

        // Send something but < threshold through the fund() function
        it("fail if you send too little ETH", async () => {
          sendValue = ethers.utils.parseUnits("1.0", "gwei")
          await expect(fundMe.fund({ value: sendValue })).to.be.revertedWith(
            "You need to spend more ETH!"
          )
        })

        // Send eth > threshold through the fund() function
        it("send ETH successfully", async () => {
          sendValue = ethers.utils.parseUnits("1.0", "ether")
          await fundMe.fund({ value: sendValue })
          amountFunded = await fundMe.getAddressToAmountFunded(deployer)
          // We use toString() because they are big number
          assert.equal(sendValue.toString(), amountFunded.toString())
        })

        // We check if fund() add our address to the array of funders
        it("add funder to array of funders", async () => {
          sendValue = ethers.utils.parseUnits("1.0", "ether")
          await fundMe.fund({ value: sendValue })
          const funder = await fundMe.getFunder(0)
          assert.equal(funder, deployer)
        })
      })

      describe("withdraw", function () {
        beforeEach(async function () {
          sendValue = ethers.utils.parseUnits("1.0", "ether")
          await fundMe.fund({ value: sendValue })
        })

        // We check if fund() add our address to the array of funders
        it("withdraw fund from a single founder", async () => {
          // Arrange
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          // Act
          const transactionResponse = await fundMe.withdraw()
          const transactionReceipt = await transactionResponse.wait()
          const { gasUsed, effectiveGasPrice } = transactionReceipt
          const gasCost = gasUsed.mul(effectiveGasPrice)

          // Assert
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )

          assert.equal(endingFundMeBalance, 0)
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          )
        })

        // Test withdraw with multiple funders
        it("withdraw with multiple funders", async () => {
          // Arrange
          // A Signer in ethers is an abstraction of an Ethereum Account
          const accounts = await ethers.getSigners()
          sendValue = ethers.utils.parseUnits("1.0", "ether")
          // Send ETH with 6 signers
          for (i = 1; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i])
            await fundMeConnectedContract.fund({ value: sendValue })
          }
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )

          // Act
          const transactionResponse = await fundMe.withdraw()
          const transactionReceipt = await transactionResponse.wait()
          const { gasUsed, effectiveGasPrice } = transactionReceipt
          const gasCost = gasUsed.mul(effectiveGasPrice)

          // Assert
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )

          assert.equal(endingFundMeBalance, 0)
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          )

          // Make sure that the funders array is empty
          await expect(fundMe.getFunder(0)).to.be.reverted

          // make sure that the funders map is reset properly (value funded = 0)
          for (i = 1; i < 6; i++) {
            const amountFunded = await fundMe.getAddressToAmountFunded(
              accounts[i].address
            )
            assert.equal(amountFunded, 0)
          }
        })

        // Test that only the owner fo the contract can withdraw
        it("Only allows the owner to withdraw", async function () {
          // We pick a random wallet as the attacker
          const attacker = (await ethers.getSigners())[1]
          const attackerConnectedContract = await fundMe.connect(attacker)
          await expect(attackerConnectedContract.withdraw()).to.be.revertedWith(
            "FundMe__NotOwner"
          )
        })
      })
    })
