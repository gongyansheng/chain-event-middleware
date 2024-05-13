import { ethers } from 'ethers';
import { ERC20Event } from './src'
import { SIGNING_ABI_ETHERS } from './src/evm/abi'


(async () => {
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.mantle.xyz')

    const blocknumber = await provider.getBlockNumber()
    console.log(blocknumber, '--blocknumber--')
    
    const erc20Event = new ERC20Event(provider, '0xFDDE8C82F23000093d768146fA7Ef7aD9690aC71')


    const signingInterface = new ethers.utils.Interface(SIGNING_ABI_ETHERS);

    const onTaskSignEvent: string = signingInterface.getEventTopic("OnTaskSign");
    const onGameSignEvent: string = signingInterface.getEventTopic("OnGameSign");
    const onGameRechargeEvent: string = signingInterface.getEventTopic("OnGameRecharge");
    
    const focusEvents: string[] = [onTaskSignEvent, onGameSignEvent, onGameRechargeEvent];

    const logs = await erc20Event.getEvent<string>(63729663, signingInterface, focusEvents)
    console.log(logs, '--logs--')   

    
})()