import {} from '@nomiclabs/hardhat-ethers/src/internal/type-extensions';
import {} from '@nomiclabs/hardhat-waffle/src/';
import { waffle, network } from 'hardhat';
import { deploy, getAbiByAddressAndChainId, impersonateSomeone } from '../utils/util';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import fs from "fs";
// describe('Test Deploy', () => {
//   const [admin] = waffle.provider.getWallets();
//   it('Deploy erc20', async () => {
//     await deploy(admin, "ERC20", [100000000, 'Shiro', 'SRO', '18']);
//   });
// });
import {describe} from "mocha";
describe('Test get abi', () => {
  it('get abi', async () => {
    let result = await getAbiByAddressAndChainId(43114, '0x4Db6c78422A8CdD09d984096F68C705C7B479A58');
    
    fs.writeFile("test.json", result, function(err) {
        if (err) {
            console.log(err);
        }
    });
  });
});
// describe('Test impersonate', () => {
//   it('impersonate', async () => {
//     let impersonatePpl = '0x13A0D71FfDc9DF57efC427794ae94d0Ac6fd47EC';
//     await network.provider.send('hardhat_setBalance', [impersonatePpl, '0x56bc75e2d63100000000000000']);
//     let receipt: SignerWithAddress = await impersonateSomeone(impersonatePpl);
//     await deploy(receipt, "ERC20", [100000000, 'Shiro', 'SRO', '18']);
//   });
// });

