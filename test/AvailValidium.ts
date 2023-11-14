import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { faker } from '@faker-js/faker';

const etherPrice = 2000n
const gasCost = 40000000000n

describe("Validium", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployValidium() {
    const BridgeMock = await ethers.getContractFactory("BridgeMock");
    const bridgeMock = await BridgeMock.deploy();
    const DataAvailabilityRouterMock = await ethers.getContractFactory("DataAvailabilityRouterMock");
    const dataAvailabilityRouterMock = await DataAvailabilityRouterMock.deploy();
    const GlobalExitRootMock = await ethers.getContractFactory("GlobalExitRootMock");
    const globalExitRootMock = await GlobalExitRootMock.deploy();
    const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
    const erc20Mock = await ERC20Mock.deploy();
    const [owner] = await ethers.getSigners();

    const Validium = await ethers.getContractFactory("AvailValidium");
    const validium = await Validium.deploy(await globalExitRootMock.getAddress(), await erc20Mock.getAddress(), ethers.ZeroAddress, await bridgeMock.getAddress(), 1, 5);

    await validium.initialize({
      admin: owner,
      trustedSequencer: owner,
      pendingStateTimeout: 1,
      trustedAggregator: owner,
      trustedAggregatorTimeout: 1,
      daBridgeRouter: await dataAvailabilityRouterMock.getAddress(),
    }, "0xd88680f1b151dd67518f9aca85161424c0cac61df2f5424a3ddc04ea25adecc7", "http://validium-sequencer.com", "validium", "v0.1.0");
    await erc20Mock.mint(owner, ethers.parseUnits("999999"));
    await erc20Mock.approve(await validium.getAddress(), ethers.parseUnits("999999"));

    return { validium, dataAvailabilityRouterMock, owner };
  }

  describe("Gas tests", function () {
    it("32 bytes", async function () {
      const { validium, dataAvailabilityRouterMock, owner } = await loadFixture(deployValidium);
      const batchHash = faker.string.hexadecimal({ length: 32 * 2 });
      await dataAvailabilityRouterMock.set(1, batchHash);
      const gas = await validium.sequenceBatches.estimateGas([{ batchHash, globalExitRoot: ethers.ZeroHash, timestamp: Math.trunc(Date.now()/1000) - 1, minForcedTimestamp: 0 }], [{
        blockNumber: 1,
        proof: [],
        width: 0,
        index: 0,
      }], owner);
      console.log(gas, "gas");
      await validium.sequenceBatches([{ batchHash, globalExitRoot: ethers.ZeroHash, timestamp: Math.trunc(Date.now()/1000) - 1, minForcedTimestamp: 0 }], [{
        blockNumber: 1,
        proof: [],
        width: 0,
        index: 0,
      }], owner);
      console.log("Max transactions: ", 30000000n / gas);
      console.log("Max data included: ", (30000000n / gas) * 32n);
      const priceToFillBlock = ((30000000n / gas) * gas * etherPrice * gasCost) / 1000000000000000000n;
      console.log("Price to fill block: ", priceToFillBlock);
      console.log("Price per byte: ", Number(priceToFillBlock) / (Number(30000000n / gas) * 32.0));
    });
    it("1000 bytes", async function () {
      const { validium, dataAvailabilityRouterMock, owner } = await loadFixture(deployValidium);
      const batchHash = faker.string.hexadecimal({ length: 32 * 2 });
      await dataAvailabilityRouterMock.set(1, batchHash);
      const gas = await validium.sequenceBatches.estimateGas([{ batchHash, globalExitRoot: ethers.ZeroHash, timestamp: Math.trunc(Date.now()/1000) - 1, minForcedTimestamp: 0 }], [{
        blockNumber: 1,
        proof: [],
        width: 0,
        index: 0,
      }], owner);
      console.log(gas, "gas");
      await validium.sequenceBatches([{ batchHash, globalExitRoot: ethers.ZeroHash, timestamp: Math.trunc(Date.now()/1000) - 1, minForcedTimestamp: 0 }], [{
        blockNumber: 1,
        proof: [],
        width: 0,
        index: 0,
      }], owner);
      console.log("Max transactions: ", 30000000n / gas);
      console.log("Max data included: ", (30000000n / gas) * 1000n);
      const priceToFillBlock = ((30000000n / gas) * gas * etherPrice * gasCost) / 1000000000000000000n;
      console.log("Price to fill block: ", priceToFillBlock);
      console.log("Price per byte: ", Number(priceToFillBlock) / (Number(30000000n / gas) * 1000.0));
    });
    it("100000 bytes", async function () {
      const { validium, dataAvailabilityRouterMock, owner } = await loadFixture(deployValidium);
      const batchHash = faker.string.hexadecimal({ length: 32 * 2 });
      await dataAvailabilityRouterMock.set(1, batchHash);
      const gas = await validium.sequenceBatches.estimateGas([{ batchHash, globalExitRoot: ethers.ZeroHash, timestamp: Math.trunc(Date.now()/1000) - 1, minForcedTimestamp: 0 }], [{
        blockNumber: 1,
        proof: [],
        width: 0,
        index: 0,
      }], owner);
      console.log(gas, "gas");
      await validium.sequenceBatches([{ batchHash, globalExitRoot: ethers.ZeroHash, timestamp: Math.trunc(Date.now()/1000) - 1, minForcedTimestamp: 0 }], [{
        blockNumber: 1,
        proof: [],
        width: 0,
        index: 0,
      }], owner);
      console.log("Max transactions: ", 30000000n / gas);
      console.log("Max data included: ", (30000000n / gas) * 100000n);
      const priceToFillBlock = ((30000000n / gas) * gas * etherPrice * gasCost) / 1000000000000000000n;
      console.log("Price to fill block: ", priceToFillBlock);
      console.log("Price per byte: ", Number(priceToFillBlock) / (Number(30000000n / gas) * 100000.0));
    });
    it("120000 bytes", async function () {
      const { validium, dataAvailabilityRouterMock, owner } = await loadFixture(deployValidium);
      const batchHash = faker.string.hexadecimal({ length: 32 * 2 });
      await dataAvailabilityRouterMock.set(1, batchHash);
      const gas = await validium.sequenceBatches.estimateGas([{ batchHash, globalExitRoot: ethers.ZeroHash, timestamp: Math.trunc(Date.now()/1000) - 1, minForcedTimestamp: 0 }], [{
        blockNumber: 1,
        proof: [],
        width: 0,
        index: 0,
      }], owner);
      console.log(gas, "gas");
      await validium.sequenceBatches([{ batchHash, globalExitRoot: ethers.ZeroHash, timestamp: Math.trunc(Date.now()/1000) - 1, minForcedTimestamp: 0 }], [{
        blockNumber: 1,
        proof: [],
        width: 0,
        index: 0,
      }], owner);
      console.log("Max transactions: ", 30000000n / gas);
      console.log("Max data included: ", (30000000n / gas) * 120000n);
      const priceToFillBlock = ((30000000n / gas) * gas * etherPrice * gasCost) / 1000000000000000000n;
      console.log("Price to fill block: ", priceToFillBlock);
      console.log("Price per byte: ", Number(priceToFillBlock) / (Number(30000000n / gas) * 120000.0));
    });
    it("1000000 bytes", async function () {
      const { validium, dataAvailabilityRouterMock, owner } = await loadFixture(deployValidium);
      const batchHash = faker.string.hexadecimal({ length: 32 * 2 });
      await dataAvailabilityRouterMock.set(1, batchHash);
      const gas = await validium.sequenceBatches.estimateGas([{ batchHash, globalExitRoot: ethers.ZeroHash, timestamp: Math.trunc(Date.now()/1000) - 1, minForcedTimestamp: 0 }], [{
        blockNumber: 1,
        proof: [],
        width: 0,
        index: 0,
      }], owner);
      console.log(gas, "gas");
      await validium.sequenceBatches([{ batchHash, globalExitRoot: ethers.ZeroHash, timestamp: Math.trunc(Date.now()/1000) - 1, minForcedTimestamp: 0 }], [{
        blockNumber: 1,
        proof: [],
        width: 0,
        index: 0,
      }], owner);
      console.log("Max transactions: ", 30000000n / gas);
      console.log("Max data included: ", (30000000n / gas) * 1000000n);
      const priceToFillBlock = ((30000000n / gas) * gas * etherPrice * gasCost) / 1000000000000000000n;
      console.log("Price to fill block: ", priceToFillBlock);
      console.log("Price per byte: ", Number(priceToFillBlock) / (Number(30000000n / gas) * 1000000.0));
    });
  });
});
