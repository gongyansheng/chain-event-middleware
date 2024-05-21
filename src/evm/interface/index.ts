

export interface depositEvent {
    comment: string,
    timestamp: number,
    txhash: string,
    tokenName: string,
    amount: string,
    sender: string
}


export interface depositERC20Event extends depositEvent{
    tokenid: number
}