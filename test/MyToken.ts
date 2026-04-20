import hre from "hardhat";
import { expect } from "chai";
import { MyToken } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { DECIMALS, MINTING_AMOUNT } from "./constant";
//import MyToken from "../ignition/modules/MyToken";

describe("My Token", () => {
  let myTokenC: MyToken;
  let signers: HardhatEthersSigner[];

  beforeEach("should deploy", async () => {
    //before 이 프로그램을 시작하기 전에 그룹별로 각각 시작해줘
    signers = await hre.ethers.getSigners();

    //hardhat은 기본적으로 signer0 사용
    //ethers는 편리하게 연결되어 있는 signer에 서명하고, transaction 전송하고, 영수증까지 해줌
    myTokenC = await hre.ethers.deployContract("MyToken", [
      "MyToken",
      "MT",
      DECIMALS,
      MINTING_AMOUNT
    ]);
  });

  describe("Basic state value check", () => {
    it("should return", async () => {
      expect(await myTokenC.name()).equal("MyToken");
    });

    it("should return", async () => {
      expect(await myTokenC.symbol()).equal("MT");
    });

    it("should return", async () => {
      expect(await myTokenC.decimals()).equal(18);
    });

    it("should return 100 totalSupply", async () => {
      expect(await myTokenC.totalSupply()).equal(MINTING_AMOUNT * 10n ** DECIMALS);
    });
  });

  //1MT = 1*10^18
  describe("Mint", () => {
    it("should return 1MT balance for signer 0", async () => {
      const signer0 = signers[0];
      expect(await myTokenC.balanceOf(signer0.address)).equal(MINTING_AMOUNT * 10n ** DECIMALS);
    });
  });

  //state을 읽기만 하는 함수와 건드리는 함수 어떻게 처리가 되는지 정확하게 알아야함
  describe("Transfer", () => {
    it("should have 0.5MT", async () => {
      const signer0 = signers[0];
      const signer1 = signers[1];

      await expect( //event 체크 로직에는 expect 앞에다 await
        myTokenC.transfer(
          hre.ethers.parseUnits("0.5", DECIMALS),
          signer1.address
        )
      )
        .to.emit(myTokenC, "Transfer")
        .withArgs(
          signer0.address,
          signer1.address,
          hre.ethers.parseUnits("0.5", DECIMALS)
        );

      expect(await myTokenC.balanceOf(signer1.address)).equal(
        hre.ethers.parseUnits("0.5", DECIMALS)
      );
    });

    it("should be reverted with insufficient balance error", async () => {
      const signer1 = signers[1];
      //await 위치 중요 -> expect를 테스트하는 특수한 상황
      await expect( // 따라 오는 코드를 줘서 모카 프레임워크한테 잘 실행되는지 확인해줘라고 하는 것
        myTokenC.transfer(
          hre.ethers.parseUnits((MINTING_AMOUNT + 1n).toString(), DECIMALS),
          signer1.address
        )
      ).to.be.revertedWith("insufficient balance");
    });
  });

  describe("TransferFrom", () => {
    it("shoul emit Approval event", async () => {
      const signer1 = signers[1];
      await expect(
        myTokenC.approve(signer1.address, hre.ethers.parseUnits("10", DECIMALS))
      )
        .to.emit(myTokenC, "Approval")
        .withArgs(signer1.address, hre.ethers.parseUnits("10", DECIMALS));
    });

    it("should be reverted with insuffident allowance error", async () => {
      const signer0 = signers[0];
      const signer1 = signers[1];

      await expect(
        myTokenC
          .connect(signer1)
          .transferFrom(
            signer0.address,
            signer1.address,
            hre.ethers.parseUnits("1", DECIMALS)
          )
      ).to.be.revertedWith("insufficient allowance");
    });

    it("should transfer tokens by transferFrom and check balance", async () => {
      const signer0 = signers[0];
      const signer1 = signers[1];
      const amount = hre.ethers.parseUnits("10", DECIMALS);

      await myTokenC.approve(signer1.address, amount);

      await expect(
        myTokenC
          .connect(signer1)
          .transferFrom(signer0.address, signer1.address, amount)
      )
        .to.emit(myTokenC, "Transfer")
        .withArgs(signer0.address, signer1.address, amount);

      expect(await myTokenC.balanceOf(signer1.address)).equal(amount);
    });
  });
});