import { ethers } from 'ethers';
import { EvmEvent } from './src'


(async () => {
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.mantle.xyz')

    const blocknumber = await provider.getBlockNumber()
    console.log(blocknumber, '--blocknumber--')
    
    const evmEvent = new EvmEvent(provider, '0xFDDE8C82F23000093d768146fA7Ef7aD9690aC71')

    const logs = await evmEvent.getEvent<string>(63807147)
    const formatInfo = evmEvent.formatEvent(logs, 'MNT', 'OnGameRecharge')
    console.log(formatInfo)
    
})()