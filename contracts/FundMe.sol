// License
// SPDX-License-Identifier: MIT

// Pragma statements
pragma solidity ^0.8.8;

// Import statements
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";
import "hardhat/console.sol"; // for debugging stuff

// Error Codes
error FundMe__NotOwner();

// Interfaces
// Libraries
// Contracts

/// @title A contract for crowd funding
/// @author Gianelli Marco
/// @notice This Contract is only studying purposes and therefore have only basic operations
/// @dev This implements only fund and withdraw operation
contract FundMe {
  // Type declarations
  using PriceConverter for uint256;

  // State variables
  mapping(address => uint256) private s_addressToAmountFunded;
  address[] private s_funders;
  address private immutable i_owner;
  uint256 public constant MINIMUM_USD = 50 * 10**18;
  AggregatorV3Interface private s_priceFeed;

  // Events
  // Modifiers
  modifier onlyOwner() {
    // require(msg.sender == owner);
    if (msg.sender != i_owner) revert FundMe__NotOwner();
    _;
  }

  // Function
  constructor(address priceFeedAddress) {
    i_owner = msg.sender;
    s_priceFeed = AggregatorV3Interface(priceFeedAddress);
  }

  receive() external payable {
    fund();
  }

  fallback() external payable {
    fund();
  }

  /// @notice This Contract is only studying purposes and therefore have only basic operations
  /// @dev This implements only fund and withdraw operation
  function fund() public payable {
    require(
      msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
      "You need to spend more ETH!"
    );
    // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
    s_addressToAmountFunded[msg.sender] += msg.value;
    s_funders.push(msg.sender);
    // --- debug inside solidity ---
    // console.log("Address of the funder: ", msg.sender);
  }

  function withdraw() public payable onlyOwner {
    for (
      uint256 funderIndex = 0;
      funderIndex < s_funders.length;
      funderIndex++
    ) {
      address funder = s_funders[funderIndex];
      s_addressToAmountFunded[funder] = 0;
    }
    s_funders = new address[](0);

    (bool callSuccess, ) = payable(msg.sender).call{
      value: address(this).balance
    }("");
    require(callSuccess, "Call failed");
  }

  // Explainer from: https://solidity-by-example.org/fallback/
  // Ether is sent to contract
  //      is msg.data empty?
  //          /   \
  //         yes  no
  //         /     \
  //    receive()?  fallback()
  //     /   \
  //   yes   no
  //  /        \
  //receive()  fallback()

  function cheaperWithdraw() public payable onlyOwner {
    address[] memory funders = s_funders;
    // mappings can't be in memory, sorry!

    for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
      address funder = funders[funderIndex];
      s_addressToAmountFunded[funder] = 0;
    }
    s_funders = new address[](0);

    (bool callSuccess, ) = payable(msg.sender).call{
      value: address(this).balance
    }("");
    require(callSuccess, "Call failed");
  }

  /// @notice Gets the amount that an address has funded
  ///  @param fundingAddress the address of the funder
  ///  @return the amount funded
  function getAddressToAmountFunded(address fundingAddress)
    public
    view
    returns (uint256)
  {
    return s_addressToAmountFunded[fundingAddress];
  }

  function getVersion() public view returns (uint256) {
    return s_priceFeed.version();
  }

  function getFunder(uint256 index) public view returns (address) {
    return s_funders[index];
  }

  function getOwner() public view returns (address) {
    return i_owner;
  }

  function getPriceFeed() public view returns (AggregatorV3Interface) {
    return s_priceFeed;
  }
}
