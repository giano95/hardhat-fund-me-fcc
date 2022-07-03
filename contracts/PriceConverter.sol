// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// A library in Solidity is a different type of smart contract that contains reusable code.
// Once deployed on the blockchain (only once), it is assigned a specific address and it
// can be reused many times by other contracts.
// It is helpful to think of a library as a singleton in the EVM, a piece of code that can be
// Called from any contract without the need to deploy it again.
//
library PriceConverter {
  // We could make this public, but then we'd have to deploy it
  function getPrice(AggregatorV3Interface priceFeed)
    internal
    view
    returns (uint256)
  {
    (, int256 answer, , , ) = priceFeed.latestRoundData();
    // ETH/USD rate in 18 digit
    return uint256(answer * 10000000000);
  }

  // 1000000000
  function getConversionRate(uint256 ethAmount, AggregatorV3Interface priceFeed)
    internal
    view
    returns (uint256)
  {
    uint256 ethPrice = getPrice(priceFeed);
    uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1000000000000000000;
    // the actual ETH/USD conversion rate, after adjusting the extra 0s.
    return ethAmountInUsd;
  }
}
