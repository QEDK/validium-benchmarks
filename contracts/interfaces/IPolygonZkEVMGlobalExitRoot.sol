// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.22;

interface IPolygonZkEVMGlobalExitRoot {
    error OnlyAllowedContracts();

    function getLastGlobalExitRoot() external view returns (bytes32);

    function updateExitRoot(bytes32 newRollupExitRoot) external;

    function globalExitRootMap(
        bytes32 globalExitRootNum
    ) external returns (uint256);
}
