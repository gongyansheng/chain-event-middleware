import { ethers } from 'ethers'
import { SIGNING_ABI_ETHERS } from './abi'
import { depositEvent } from './interface'
import BigNumber from 'bignumber.js'

export class EvmEvent {

    private provider: ethers.providers.JsonRpcProvider
    private contractAddress: string
    private signingInterface: ethers.utils.Interface
    private focusEvents: string[]

    constructor(provider: ethers.providers.JsonRpcProvider, contractAddress: string) {
        this.provider = provider
        this.contractAddress = contractAddress
        this.signingInterface = new ethers.utils.Interface(SIGNING_ABI_ETHERS);

        this.focusEvents = [
            this.signingInterface.getEventTopic("OnTaskSign"), 
            this.signingInterface.getEventTopic("OnGameSign"), 
            this.signingInterface.getEventTopic("OnGameRecharge")
        ];
    }


    async getEvent<T>(lastBlockNumber: number, blockDiff = 10): Promise<T[]> {
        const provider = this.provider
        const currentBlock = await provider.getBlockNumber()
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
            if (this.focusEvents.indexOf(returnlogs[i]?.topics[0]) < 0) continue;
            let parsedEvents = this.signingInterface.parseLog(returnlogs[i]);
            let logitem: any = Object.assign({}, returnlogs[i], parsedEvents);
            delete logitem.eventFragment;
            logitems.push(logitem);
        }
        return logitems
    }

    
    formatEvent(logs: any[], tokenName: string, eventName: 'OnGameRecharge' | 'OnTaskSign' | 'OnGameSign',  decimal=18): depositEvent[] {
        logs = logs.filter((item) => item.name === eventName)
        const resultList: depositEvent[] = []
        for(const log of logs) {
            const args = log.args
            resultList.push({
                comment: args.comment,
                timestamp: args.timestamp.toNumber(),
                txhash: log.transactionHash,
                tokenName,
                amount: args.amount ? BigNumber(args.amount.toString()).dividedBy(10 ** decimal).toString() : '',
                sender: args.wallet
            })
        }
        
        return resultList
    }

    // formatERC20RechargeEvent(logs: any[], eventName='OnGameRechargeERC20') {
    //     return logs.filter((item) => item.name === eventName)
    // }
    

    
}