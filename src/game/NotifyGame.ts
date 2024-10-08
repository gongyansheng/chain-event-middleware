
import { StatusEnum } from '../constant/index'
import { BaseIdUtils } from '../dataBase/BaseIdUtils'


export class NotifyGame {


    private table: any
    private baseId: bigint = BigInt(0)
    private baseIdUtils: BaseIdUtils
    
    
    constructor(table: any) {
        this.table = table
        this.baseIdUtils = new BaseIdUtils(table)
        
    }


    async checkFail(chainid: number, filed: 'status' | 'notify_status') {
        if(new Date().getMinutes()%10 === 0) {
            var currentTime = new Date();
            var tenMinutesAgo = new Date(currentTime.getTime() - 10 * 60 * 1000);

            const needResetList = await this.table.findMany({
                where: { chainid, id: { gt: this.baseId }, [filed]: StatusEnum.processing, resultcode: '99', updated: { lt: tenMinutesAgo } },
                take: 50
            })
            if(needResetList.length) {
                await this.table.updateMany({
                    where: { id: { in: needResetList.map((item: any) => item.id) } },
                    data: {
                        [filed]: StatusEnum.pending,
                        resultcode: '99',
                        updated: new Date()
                    }
                })
            }
        }
    }
    
    async selectNeedNotify<T extends { id?: any, chainid?: any }, V >(whereInput: T , isCheckFail: boolean, filed: 'status' | 'notify_status' = 'status'): Promise<V> {
        this.baseId = await this.baseIdUtils.getBaseId()
        whereInput.id = { gt: this.baseId }
        const needNotifyList = await this.table.findMany({
            where: whereInput,
            take: 30
        })
        if(isCheckFail) {
            await this.checkFail(whereInput.chainid, filed)
        }

        if(needNotifyList.length <= 0) return [] as V
        await this.table.updateMany({
            where: { id: { in: needNotifyList.map((item: any) => item.id) } },
            data: { [filed]: StatusEnum.processing, updated: new Date()}
        })
        return needNotifyList as V
    }
    
}