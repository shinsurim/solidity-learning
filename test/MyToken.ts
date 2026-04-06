import hre from "hardhat";
import { expect } from "chai";
import { MyToken } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("mytoken deploy", () => {
    let myTokenC: MyToken;
    let signers: HardhatEthersSigner[];
  before("should deploy", async () => {
    //before 이 프로그램을 시작하기 전에 시작해줘
    signers = await hre.ethers.getSigners();

    //hardhat은 기본적으로 signer0 사용
    //ethesrs는 편리하게 연결되어 있는 signer에 서명하고, transaction 전송하고, 영수증까지 해줌
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
    expect(await myTokenC.totalSupply()).equal(1n*10n**18n);
    });

    //1MT =1*10^18
    it("should return 1MT balance for signer 0", async () => {
    const signer0 = signers[0];
    expect(await myTokenC.balanceOf(signer0)).equal(1n*10n**18n);
  });
  //state을 읽기만 하는 함수와 건드리는 함수 어떻게 처리가 되는지 정확하게 알아야함
  it("should have 0.5MT", async () => {
    const signer1 = signers[1];
    await myTokenC.transfer(hre.ethers.parseUnits("0.5", 18), signer1.address);
    expect(await myTokenC.balanceOf(signer1.address)).equal(hre.ethers.parseUnits("0.5", 18));
  });

});