// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.22;

contract DataAvailabilityRouterMock {
    mapping(uint32 => bytes32) public roots;

    function set(uint32 blockNumber, bytes32 root) external {
        roots[blockNumber] = root;
    }
}
