import hre from "hardhat";
import { expect } from "chai";
import { MyToken } from "../typechain-types";
import type { Signer } from "ethers";

describe("mytoken deploy", () => {
    let myTokenC: MyToken;
    let signers: Signer[];
  before("should deploy", async () => {
    //before 이 프로그램을 시작하기 전에 시작해줘
    signers = await hre.ethers.getSigners();
    myTokenC = await hre.ethers.deployContract("MyToken", [
      "MyToken",
      "MT",
      18,
    ]);
  });
    it("should return", async () => {
    expect(await myTokenC.name()).equal("MyToken");
    });

    it("should return", async () => {
    expect(await myTokenC.symbol()).equal("MT");
    });

    it("should return", async () => {
    expect(await myTokenC.decimals()).equal(18);
    });

    it("should return 0 totalSupply", async () => {
    expect(await myTokenC.totalSupply()).equal(0);
    });
    it("should return 0 balance for signer 0", async () => {
    const signer0 = signers[0];
    expect(await myTokenC.balanceOf(signer0)).equal(0);
  });
});