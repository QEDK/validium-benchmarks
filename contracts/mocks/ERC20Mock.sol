// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20("Test Avail", "Avail") {
    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
}
