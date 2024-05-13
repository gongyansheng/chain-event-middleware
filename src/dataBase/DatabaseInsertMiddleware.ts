

export class DatabaseInsertMiddleware{

    private catchList: string[]

    constructor(catchList: string[]) {
        this.catchList = catchList
    }


    filterCatch(dataList: any, filed: string) {
        return dataList.filter((item: any) => !this.catchList.includes(item[filed]))

    }

    addCatchList(dataList: any, filed: string) {
        this.catchList.unshift(...dataList.map((item: any) => item[filed]))
        if(this.catchList.length > 8000) {
            this.catchList.splice(5000)
        }
    }
    
    async insertDataList<T>(table: any, dataList: T[], filed: 'billid'|'txhash'){
        try{

            dataList = this.filterCatch(dataList, filed)
            if(dataList.length <= 0) return
            await table.createMany({ data: dataList })
            this.addCatchList(dataList, filed)
        }catch(e: any){
            const billidIsRepeat = e.message.includes('Unique constraint failed')
            if(!billidIsRepeat) throw e

            const existList = await table.findMany({
                where: {
                    [filed]: { in: dataList.map((item: any) => item[filed]) }
                }
            })
            const existFiledList = existList.map((item: any) => item[filed])
            dataList = dataList.filter((item: any) => !existFiledList.includes(item[filed]))
            
            this.addCatchList(existList, filed)

            if(dataList.length <= 0) return

            await table.createMany({ data: dataList })
            this.addCatchList(dataList, filed)
        }
    }
    

    

    

    
}