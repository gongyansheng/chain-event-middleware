
import { TonClient, JettonMaster, Address } from "@ton/ton";
import { JettonDeposit } from './src/ton'

(async () => {
    
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: '1b312c91c3b691255130350a49ac5a0742454725f910756aff94dfe44858388e',
    });

    // constructor(client: TonClient, jettonMasterList: string[], myAddress: Address) {

    const jettonDeposit = new JettonDeposit(
        client, 
        [{ jettonMasterAddress: Address.parse('EQCbKMTmEAdSnzsK85LOpaDkDH3HjujEbTePMSeirvEaNq-U'), decimal: '9', tokenName: 'mc' } ], 
        Address.parse('UQDVJrXsScRIS1vvVZlxj9ogKgC39qwGimxXJsONc-pPvtn8')
    )

    await jettonDeposit.getJettonWallet()
    const res = await jettonDeposit.getDepositEvents()
    console.log(res, '--res--')
    // const jettonMaster = client.open(JettonMaster.create(Address.parse('EQCbKMTmEAdSnzsK85LOpaDkDH3HjujEbTePMSeirvEaNq-U')))

    // console.log(await jettonMaster.getWalletAddress(Address.parse('UQDVJrXsScRIS1vvVZlxj9ogKgC39qwGimxXJsONc-pPvtn8')))
})()