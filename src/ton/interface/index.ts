
import { Address } from '@ton/ton'


export interface jettonMasterAndWallet { 
    jettonMasterAddress: Address, 
    decimal: string|number, 
    tokenName: string 
}

export interface jettonMasterAndWalletMap extends jettonMasterAndWallet{ 
    JettonWallet: Address, 
}



export interface depositEvent {
    comment: string,
    txhash: string,
    tokenName: string,
    jettonAmount: string,
    jettonSender: string
}