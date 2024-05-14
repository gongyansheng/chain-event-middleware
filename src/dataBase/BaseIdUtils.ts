
export class BaseIdUtils {
    private table: any

    private baseId: bigint = BigInt(0)
    private lastUpdateTime = 0

    constructor(talbe: any) {
        if(!talbe) throw new Error('BaseIdUtils table is not defined') 
        this.table = talbe
    }

    async getBaseId() {    
        if(this.lastUpdateTime === 0) {
            // start init
            await this.queryBaseId(20000)
            this.lastUpdateTime = Date.now()
        }
        if((Date.now() - this.lastUpdateTime) > 1000 * 60 * 60 * 2 ) {
            await this.queryBaseId(200000)
            this.lastUpdateTime = 0

        } 

        return this.baseId
    }

    private async queryBaseId(limit: number) {
        let maxId = await this.table.findFirst({
            orderBy: { id: 'desc'}
        }).then((res: any) => res?.id )
        if(!maxId) return 0
        let startId = BigInt(0)
        if(maxId > BigInt(limit+100)) {
            startId = maxId - BigInt(limit)
        }
        this.baseId = startId
        return this.baseId
    }
}