import { TonClient, Address, fromNano } from '@ton/ton'
import { depositEvent } from './interface'


export class TonDeposit {

    private client: TonClient
    private myAddress: Address
    private tokenName: string

    constructor(client: TonClient, myAddress: Address, tokenName = "TON") {
        this.client = client
        this.myAddress = myAddress
        this.tokenName = tokenName
    }
    
    async getDepositEvents(limit: number = 10): Promise<depositEvent[]> {

        let depositEventList: depositEvent[] = []
        const transactions = await this.client.getTransactions(this.myAddress, {
            limit,
        })
        for (const tx of transactions) {
            try {
                const inMsg = tx.inMessage
                // we only process internal messages here because they are used the most
                // for external messages some of the fields are empty, but the main structure is similar
                if(!(inMsg?.info.type == 'internal')) continue
                
                // we only process internal messages here because they are used the most
                // for external messages some of the fields are empty, but the main structure is similar
                const sender = inMsg?.info.src;
                const value = inMsg?.info.value.coins;

                let comment = ''
                const originalBody = inMsg?.body.beginParse();
                let body = originalBody.clone();
                if (body.remainingBits < 32) {
                    comment = ''
                } else {
                    const op = body.loadUint(32);
                    if (op != 0) continue
                    comment = body.loadStringTail();
                }
                depositEventList.push({
                    comment,
                    timestamp: tx.now,
                    txhash: tx.hash().toString('hex'),
                    tokenName: this.tokenName,
                    jettonAmount: fromNano(value),
                    jettonSender: sender.toString()
                })
            }catch(e) {
                console.log(e)
            }
            
        }
        return depositEventList
    }
    
}