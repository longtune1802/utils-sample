import { JsonRpcProvider } from '@ethersproject/providers';
import { config } from 'dotenv';
import { inspect } from 'util';
import {CHAIN_ID} from './constants/chainid';

config();
//key
let apikeyName = new Map<number, string>();

// Add more key
apikeyName.set(CHAIN_ID.ETHEREUM,process.env.ETHERSCAN_KEY!);
apikeyName.set(CHAIN_ID.AVALANCHE, process.env.SNOWTRACE_KEY!);
apikeyName.set(CHAIN_ID.AURORA,process.env.AURORA_KEY!);

export const providerUrls = {
    //Main net
    [CHAIN_ID.ETHEREUM]: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
    [CHAIN_ID.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
    [CHAIN_ID.AURORA]: 'https://mainnet.aurora.dev/',
    //Test net
    [CHAIN_ID.FUJI]: 'https://api.avax-test.network/ext/bc/C/rpc',
    [CHAIN_ID.MUMBAI]: 'https://matic-mumbai.chainstacklabs.com',
    [CHAIN_ID.AURORABETA]: 'https://betanet.aurora.dev',
    [CHAIN_ID.ROPSTEN]: `https://ropsten.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
    [CHAIN_ID.RINKERBY]: `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
    [CHAIN_ID.GOERLI]: `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
    [CHAIN_ID.KOVAN]: `https://kovan.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,

};

export const apiEndpoint = {
    //Main net
    [CHAIN_ID.ETHEREUM]: 'https://api.etherscan.io/api?module=contract&action=getabi',
    [CHAIN_ID.AVALANCHE]: 'https://api.snowtrace.io/api?module=contract&action=getabi' ,
    [CHAIN_ID.AURORA]: 'https://api.aurorascan.dev/api?module=contract&action=getabi',
    //Test net
    [CHAIN_ID.FUJI]: 'https://api-testnet.snowtrace.io/api?module=contract&action=getabi',
    [CHAIN_ID.MUMBAI]: 'https://api-testnet.polygonscan.com/api?module=contract&action=getabi',
    [CHAIN_ID.AURORABETA]: 'https://api-testnet.aurorascan.dev/api?module=contract&action=getabi',
    [CHAIN_ID.ROPSTEN]: 'https://api-ropsten.etherscan.io/api?module=contract&action=getabi',
    [CHAIN_ID.RINKERBY]: 'https://api-rinkerby.etherscan.io/api?module=contract&action=getabi',
    [CHAIN_ID.GOERLI]: 'https://api-goerli.etherscan.io/api?module=contract&action=getabi',
    [CHAIN_ID.KOVAN]: 'https://api-kovan.etherscan.io/api?module=contract&action=getabi',

}
export function getApi(chainid: number) {
    return apiEndpoint[chainid];
  }
export function getKey(chainid: number) {
    return apikeyName.get(chainid);
}
  
export function getProvider(chain_id:number){
    return new JsonRpcProvider(providerUrls[chain_id]);
}
