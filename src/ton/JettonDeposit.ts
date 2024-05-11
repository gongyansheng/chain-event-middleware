import { TonClient, Address, JettonMaster } from '@ton/ton'
import { jettonMasterAndWalletMap, depositEvent, jettonMasterAndWallet } from './interface'
import BigNumber from 'bignumber.js'


export class JettonDeposit {

    private client: TonClient
    private myAddress: Address
    private jettonMasterList: jettonMasterAndWallet[]
    private jettonMasterAndWalletMapList: jettonMasterAndWalletMap[] = []

    constructor(client: TonClient, jettonMasterList: jettonMasterAndWallet[], myAddress: Address) {
        this.client = client
        this.myAddress = myAddress
        this.jettonMasterList = jettonMasterList
        if(jettonMasterList.length <= 0) throw new Error('jettonMasterList is empty')
    }
    async getJettonWallet(): Promise<jettonMasterAndWalletMap[]>{
        const jettonMasterAndWalletMapList: jettonMasterAndWalletMap[] = []
        for(const jettonMasterAddress of this.jettonMasterList) {
            const jettonMaster = this.client.open(JettonMaster.create(jettonMasterAddress.jettonMasterAddress))
            const myJettonAddress = await jettonMaster.getWalletAddress(this.myAddress)
            jettonMasterAndWalletMapList.push({
                jettonMasterAddress: jettonMasterAddress.jettonMasterAddress,
                JettonWallet: myJettonAddress,
                decimal: jettonMasterAddress.decimal,
                tokenName: jettonMasterAddress.tokenName
            })
        }
        this.jettonMasterAndWalletMapList = jettonMasterAndWalletMapList
        return jettonMasterAndWalletMapList
    }

    async getDepositEvents(limit: number = 10): Promise<depositEvent[]> {

        let depositEventList: depositEvent[] = []
        const transactions = await this.client.getTransactions(this.myAddress, {
            limit,
        })
        for (const tx of transactions) {
            const inMsg = tx.inMessage
            // we only process internal messages here because they are used the most
            // for external messages some of the fields are empty, but the main structure is similar
            if(!(inMsg?.info.type == 'internal')) continue
            let comment = ''
            const sender = inMsg?.info.src
            const originalBody = inMsg?.body.beginParse()
            let body = originalBody.clone()

            if(body.remainingBits < 32) continue
            const op = body.loadUint(32)
            // check jetton transfer
            if(op != 0x7362d09c) continue

            // 
            const findSupportJetton = this.jettonMasterAndWalletMapList.find((item) => item.JettonWallet.equals(sender))
            if(!findSupportJetton) continue

            body.skip(64) // skip query_id
            const jettonAmount = body.loadCoins()
            const jettonSender = body.loadAddressAny()
            if(!jettonSender) continue
            const originalForwardPayload = body.loadBit() ? body.loadRef().beginParse() : body
            let forwardPayload = originalForwardPayload.clone()

            if (forwardPayload.remainingBits >= 32) {
                const forwardOp = forwardPayload.loadUint(32)
                if (forwardOp == 0) {
                    // if forward payload opcode is 0: it's a simple Jetton transfer with comment
                    comment = forwardPayload.loadStringTail()
                }
            }
            depositEventList.push({
                comment,
                txhash: tx.hash().toString('hex'),
                tokenName: findSupportJetton.tokenName,
                jettonAmount: BigNumber(jettonAmount.toString()).div(findSupportJetton.decimal).toString(),
                jettonSender: jettonSender.toString()
            })
        }
        return depositEventList
    }
    
}