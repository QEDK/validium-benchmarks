import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { faker } from '@faker-js/faker';

const etherPrice = 1850n
const gasCost = 40000000000n

describe("ZkEVM", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployZkEVM() {
    const BridgeMock = await ethers.getContractFactory("BridgeMock");
    const bridgeMock = await BridgeMock.deploy();
    const GlobalExitRootMock = await ethers.getContractFactory("GlobalExitRootMock");
    const globalExitRootMock = await GlobalExitRootMock.deploy();
    const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
    const erc20Mock = await ERC20Mock.deploy();
    const [owner] = await ethers.getSigners();

    const ZkEVM = await ethers.getContractFactory("PolygonZkEVM");
    const zkevm = await ZkEVM.deploy(await globalExitRootMock.getAddress(), await erc20Mock.getAddress(), ethers.ZeroAddress, await bridgeMock.getAddress(), 1, 5);

    await zkevm.initialize({
      admin: owner,
      trustedSequencer: owner,
      pendingStateTimeout: 1,
      trustedAggregator: owner,
      trustedAggregatorTimeout: 1,
    }, "0xd88680f1b151dd67518f9aca85161424c0cac61df2f5424a3ddc04ea25adecc7", "http://validium-sequencer.com", "validium", "v0.1.0");
    await erc20Mock.mint(owner, ethers.parseUnits("999999"));
    await erc20Mock.approve(await zkevm.getAddress(), ethers.parseUnits("999999"));

    return { zkevm, owner };
  }

  describe("Gas tests", function () {
    it("32 bytes", async function () {
      const { zkevm, owner } = await loadFixture(deployZkEVM);
      const transactions = faker.string.hexadecimal({ length: 32 * 2 });
      const gas = await zkevm.sequenceBatches.estimateGas([{ transactions, globalExitRoot: ethers.ZeroHash, timestamp: Math.trunc(Date.now()/1000) - 1, minForcedTimestamp: 0 }], owner);
      console.log(gas, "gas");
      await zkevm.sequenceBatches([{ transactions, globalExitRoot: ethers.ZeroHash, timestamp: Math.trunc(Date.now()/1000) - 1, minForcedTimestamp: 0 }], owner);
      console.log("Max transactions: ", 30000000n / gas);
      console.log("Max data included: ", (30000000n / gas) * 32n);
      const priceToFillBlock = ((30000000n / gas) * gas * etherPrice * gasCost) / 1000000000000000000n;
      console.log("Price to fill block: ", priceToFillBlock);
      console.log("Price per byte: ", Number(priceToFillBlock) / (Number(30000000n / gas) * 32.0));
    });
    it("1000 bytes", async function () {
      const { zkevm, owner } = await loadFixture(deployZkEVM);
      const transactions = faker.string.hexadecimal({ length: 1000 * 2 });
      const gas = await zkevm.sequenceBatches.estimateGas([{ transactions, globalExitRoot: ethers.ZeroHash, timestamp: Math.trunc(Date.now()/1000) - 1, minForcedTimestamp: 0 }], owner);
      console.log(gas, "gas");
      await zkevm.sequenceBatches([{ transactions, globalExitRoot: ethers.ZeroHash, timestamp: Math.trunc(Date.now()/1000) - 1, minForcedTimestamp: 0 }], owner);
      console.log("Max transactions: ", 30000000n / gas);
      console.log("Max data included: ", (30000000n / gas) * 1000n);
      const priceToFillBlock = ((30000000n / gas) * gas * etherPrice * gasCost) / 1000000000000000000n;
      console.log("Price to fill block: ", priceToFillBlock);
      console.log("Price per byte: ", Number(priceToFillBlock) / (Number(30000000n / gas) * 1000.0));
    });
    it("100000 bytes", async function () {
      const { zkevm, owner } = await loadFixture(deployZkEVM);
      const transactions = faker.string.hexadecimal({ length: 100000 * 2 });
      const gas = await zkevm.sequenceBatches.estimateGas([{ transactions, globalExitRoot: ethers.ZeroHash, timestamp: Math.trunc(Date.now()/1000) - 1, minForcedTimestamp: 0 }], owner);
      console.log(gas, "gas");
      await zkevm.sequenceBatches([{ transactions, globalExitRoot: ethers.ZeroHash, timestamp: Math.trunc(Date.now()/1000) - 1, minForcedTimestamp: 0 }], owner);
      console.log("Max transactions: ", 30000000n / gas);
      console.log("Max data included: ", (30000000n / gas) * 100000n);
      const priceToFillBlock = ((30000000n / gas) * gas * etherPrice * gasCost) / 1000000000000000000n;
      console.log("Price to fill block: ", priceToFillBlock);
      console.log("Price per byte: ", Number(priceToFillBlock) / (Number(30000000n / gas) * 100000.0));
    });
    it("120000 bytes", async function () {
      const { zkevm, owner } = await loadFixture(deployZkEVM);
      const transactions = faker.string.hexadecimal({ length: 120000 * 2 });
      const gas = await zkevm.sequenceBatches.estimateGas([{ transactions, globalExitRoot: ethers.ZeroHash, timestamp: Math.trunc(Date.now()/1000) - 1, minForcedTimestamp: 0 }], owner);
      console.log(gas, "gas");
      await zkevm.sequenceBatches([{ transactions, globalExitRoot: ethers.ZeroHash, timestamp: Math.trunc(Date.now()/1000) - 1, minForcedTimestamp: 0 }], owner);
      console.log("Max transactions: ", 30000000n / gas);
      console.log("Max data included: ", (30000000n / gas) * 120000n);
      const priceToFillBlock = ((30000000n / gas) * gas * etherPrice * gasCost) / 1000000000000000000n;
      console.log("Price to fill block: ", priceToFillBlock);
      console.log("Price per byte: ", Number(priceToFillBlock) / (Number(30000000n / gas) * 120000.0));
    });
  });
});
