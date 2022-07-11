import { BigNumber as BN, Contract, Wallet} from 'ethers';
import hre, { ethers } from 'hardhat';
import fetch from 'node-fetch';
import {} from '@nomiclabs/hardhat-ethers/src/internal/type-extensions';
import { getApi,getKey } from './network_config';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {providerUrls} from './network_config';
import { JsonRpcProvider } from "@ethersproject/providers";

/*
 * Module 1: Forking for multiple networks
  Provide the chain id for fork
  Can call the fork function multi time to change block number if want.
 */
export async function forkNetwork(chainid:number,blocknumber = null){
  await hre.network.provider.request({
    method: "hardhat_reset",
    params: [
      {
        forking: {
          jsonRpcUrl: providerUrls[chainid],
          blocknumber: blocknumber,
        },
      },
    ],
  });
}
/*
 * Module 2: Contract deployment & Verify
  Need to pass instant of Contract and chainid of the chain
  chain Private key in .env to change the address deployer
 */
export async function verifyContract(contract: string, constructor: any[]) {
    await hre.run('verify:verify', {
      address: contract,
      constructorArguments: constructor,
    });
}

export async function deploy(chainid:number,contractName:string,args: any[],verify?:boolean){
  console.log(`Deploying ${contractName}...`);
  const contractFactory = await hre.ethers.getContractFactory(contractName);
  const provider = new JsonRpcProvider(providerUrls[chainid]);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEYS!).connect(provider);
  const contract = await contractFactory.connect(wallet).deploy(...args);
  await contract.deployed();
  console.log(`${contractName} deployed at address: ${(contract).address}`);
  if (verify === true) {
    await verifyContract(contract.address, args);
  }
  return contract as Contract;
}
/**
 * Module 3: Some utility function on the fork
 */
export async function _impersonateAccount(address: string) {
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [address],
  });
}

export async function impersonateSomeone(user: string) {
  await _impersonateAccount(user);
  return await hre.ethers.getSigner(user);
}

export async function advanceTime(duration: number) {
  await hre.ethers.provider.send('evm_increaseTime', [duration]);
  await hre.network.provider.send('evm_mine');
}

export async function getContractByInterfaceName(contractName: string, contractAddress: string) {
  return await hre.ethers.getContractAt(contractName, contractAddress);
}

export async function getContractByAbi(abi: any[], contractAddress: string) {
  return await hre.ethers.getContractAt(abi, contractAddress);
}

/**
 * Module 4: Utility function on blockchain general
 */
export async function getAbiByAddressAndChainId(chainid: number, contractAddress: string) {
  try {
    let url = `${getApi(chainid)}&address=${contractAddress}&apikey=${getKey(chainid)}`;
    // let url = "https://api.snowtrace.io/api?module=contract&action=getabi&address=0x4Db6c78422A8CdD09d984096F68C705C7B479A58";
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    let result = await response.json();
    return result.result;
  } catch (error) {
    if (error instanceof Error) {
      console.log('error message: ', error.message);
      return error.message;
    } else {
      console.log('unexpected error: ', error);
      return 'An unexpected error occurred';
    }
  }
}
export async function getContractAt<CType extends Contract>(abiType: string, address: string) {
  return (await hre.ethers.getContractAt(abiType, address)) as CType;
}