import {} from '@nomiclabs/hardhat-ethers/src/internal/type-extensions';
import {} from '@nomiclabs/hardhat-waffle/src/';
import { waffle, network, ethers } from 'hardhat';
import { deploy, getAbiByAddressAndChainId, impersonateSomeone,getContractAt,forkNetwork,advanceTime } from '../utils/util';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import fs from "fs";
import { ERC20 } from '../typechain';
import { expect } from 'chai';
// Remove skip to rerun all test
describe.skip("Test Fork", () =>{
    it("Fork Avalanche",async () =>{
        await forkNetwork(43114);
        let contract = await getContractAt<ERC20>("ERC20","0x4Db6c78422A8CdD09d984096F68C705C7B479A58");
        console.log(await contract.totalSupply());
    });
    it("Fork Mumbai",async () => {
        await forkNetwork(80001);
        let contract =await getContractAt<ERC20>("ERC20","0x0059a72A5e545F6998AF038aBBB625FC702b1a97");
        console.log(await contract.totalSupply());
    });
    // Can add more but no contract to play with
})
//Deploy on mumbai cost ~4 mins quite fast this time
describe.skip("Test deploy",()=>{
    // Deploy at 0x9D90f4ee04bF56864D6F2d3775529D348c2433Ff
    it("Deploy on Avax", async () =>{
        await deploy(43114,"ERC20",[10000000,"Shin","SHN",18]);
    });
    // Deploy at 0x002B40EED92EdB66Bd898329CC0ef6f46529c5e6
    it("Deploy on Mumbai", async () =>{
        await deploy(80001,"ERC20",[10000000,"Shin","SHN",18]);
    });
})
describe.skip('Test Util', () => { 
    // Fork one network then impersonate
    it("Test impersonate", async () => {
        await forkNetwork(43114);
        let sender:SignerWithAddress  = await impersonateSomeone("0x13A0D71FfDc9DF57efC427794ae94d0Ac6fd47EC");
        let receipt:SignerWithAddress = await impersonateSomeone("0xd9c9935f4bfac33f38fd3a35265a237836b30bd1");
        let contract = await getContractAt<ERC20>("ERC20","0x4Db6c78422A8CdD09d984096F68C705C7B479A58");
        const preBalance = await contract.connect(sender).balanceOf(receipt.address);
        await contract.connect(sender).transfer(receipt.address,5);
        const postBalance = await contract.connect(sender).balanceOf(receipt.address);
        expect(preBalance.sub(postBalance)).to.be.equal(-5);
    })
    // Why we need this ? because can fork and choose blocknumber
    it("Test advance time",async () => {
        // For safe
        await forkNetwork(43114);
        const blockNumBefore = await ethers.provider.getBlockNumber();
        const blockBefore = await ethers.provider.getBlock(blockNumBefore);
        const timestampBefore = blockBefore.timestamp;
        await advanceTime(100000);
        const blockNumAfter = await ethers.provider.getBlockNumber();
        const blockAfter = await ethers.provider.getBlock(blockNumAfter);
        const timestampAfter = blockAfter.timestamp;
        expect(timestampAfter-(timestampBefore)).to.be.equal(100000);
    })
 })
 // What to do with it ?
describe("Test general", () =>{
    it('get contract by abi', async () => {
        let result = await getAbiByAddressAndChainId(43114, '0x4Db6c78422A8CdD09d984096F68C705C7B479A58');
        fs.writeFile('test.json', result, function (err) {
            if (err) {
                console.log(err);
            }
        });
    });
})
