const { assert, expect } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle", async function () {
          let raffle, vrfCoordinatorV2Mock, raffleEneteranceFee, deployer, interval
          const chainId = network.config.chainId

          beforeEach(async function () {
              deployer = await getNamedAccounts().deployer
              await deployments.fixture("all")
              raffle = await ethers.getContract("Raffle", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
              raffleEneteranceFee = await raffle.getEnterenceFee()
              interval = await raffle.getInterval()
          })

          describe("constructor", async function () {
              it("initalizes the raffle correctly", async function () {
                  const raffleState = await raffle.getRaffleState()
                  assert.equal(raffleState.toString(), "0")
                  assert.equal(interval.toString(), networkConfig[chainId]["interval"])
              })
          })

          describe("enter-Raffle", async function () {
              it("reverts when you don't pay enough", async function () {
                  await expect(raffle.enterRaffle()).to.be.revertedWith(
                      "Raffle__NOTEnoughETHEntered"
                  )
              })
              it("record players when they enter", async function () {
                  await raffle.enterRaffle({ value: raffleEneteranceFee })
                  const playerFromContract = await raffle.getPlayer(0)
                  assert.equal(playerFromContract, deployer)
              })
              //testing events
              it("emits event on enter", async function () {
                  await expect(raffle.enterRaffle({ value: raffleEneteranceFee })).to.be.emit(
                      raffle,
                      "RaffleEnter"
                  )
              })
              it("doesn't allow entercne when raffle is calculating", async function () {
                  await raffle.enterRaffle({ value: raffleEneteranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("eve_mine", [])
                  await raffle.performUpkeep([])
                  await expect(
                      raffle.enterRaffle({ value: raffleEneteranceFee })
                  ).to.be.revertedWith("Raffle__NotOpened")
              })
          })

          describe("check Upkeep", async function () {
              it("returns false if people haven't sent any ETH", async function () {
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([])
                  assert(!upkeepNeeded)
              })
              it("returns false if raffle isn_t opened yet", async function () {
                  await raffle.enterRaffle({ value: raffleEneteranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
                  await raffle.performUpkeep([])
                  const raffleState = await raffle.getRaffleState()
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([])
                  assert.equal(raffleState.toString(), "1")
                  assert(!upkeepNeeded)
              })
          })
      })
