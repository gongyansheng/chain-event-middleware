
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms))


export async function callApi<T>(toCall: unknown, attempts = 10, delayMs = 3000): Promise<T> {
    if (typeof toCall !== 'function') {
      throw new Error('unknown input')
    }
  
    let i = 0
    let lastError: unknown
  
    while (i < attempts) {
      try {
        const res = await toCall()
        return res
      } catch (err) {
        lastError = err
        i++
        await delay(delayMs)
      }
    }
  
    throw lastError
}