import { ethers } from 'ethers'
import { SIGNING_ABI_ETHERS } from './abi'

// erc20 的 事件 event  
export class ERC20Event {

    private provider: ethers.providers.JsonRpcProvider
    private contractAddress: string

    constructor(provider: ethers.providers.JsonRpcProvider, contractAddress: string) {
        this.provider = provider
        this.contractAddress = contractAddress
    }


    // 监听充值事件
    async getEvent<T>(lastBlockNumber: number, signingInterface: ethers.utils.Interface, focusEvents: string[]): Promise<T[]> {
        const provider = this.provider
        const currentBlock = await provider.getBlockNumber()

        const blockDiff = 10
        const startBlock = Number(lastBlockNumber) - blockDiff
        const lastBlock = (Number(lastBlockNumber) + blockDiff) > currentBlock ? currentBlock : lastBlockNumber + blockDiff
        
        const filter: ethers.providers.Filter = {
            address: this.contractAddress,
            fromBlock: startBlock,
            toBlock: lastBlock,
        };
        
        let returnlogs: Array<ethers.providers.Log> = await provider.getLogs(filter);

        let logitems: any[] = []
        // console.log("returnlogs", returnlogs);
        for (let i = 0; i < returnlogs.length; i++) {
            if (focusEvents.indexOf(returnlogs[i]?.topics[0]) < 0) continue;
            let parsedEvents = signingInterface.parseLog(returnlogs[i]);
            let logitem: any = Object.assign({}, returnlogs[i], parsedEvents);
            delete logitem.eventFragment;
            logitems.push(logitem);
        }
        return logitems
    }

    
}