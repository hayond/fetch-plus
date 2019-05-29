import compose, { Middleware } from 'koa-compose'
import Request from './Request'
import Response from './Response' 

interface Context {
    request: Request
    response: Response
    data: any
    fetchPlus: FetchPlus
}

export interface ConstructArgs { 
    fetch?: Function
}

export default class FetchPlus {

    private fetchExec
    private fetchMiddleware = async (ctx, next) => {
        await next()
        const fetch = this.fetchExec
        const { request: { url, options }, response } = ctx
        const res = await fetch(url, options)
        response.res = res
        response.ctx = ctx
        ctx.data = res
        ctx.response = response
    }

    middlewares = []

    constructor(options?: ConstructArgs) {
        this.fetchExec = (options && options.fetch) || (typeof fetch === 'function' && fetch)
        if (!this.fetchExec) throw new TypeError('main fetch exec needed!')
    }

    fetch(url: string, options = {}): Promise<any> {
        return this.innerFetch({ url, options })
    }

    use(fn: Middleware<Context> | Middleware<Context>[], index?: number): void {
        if (Array.isArray(fn)) {
            fn.forEach(fnItem => this.use(fnItem, index))
            return
        }
        if (typeof fn !== 'function') throw new TypeError('middleware must be a function!')
        index ? this.middlewares.splice(index, 0, fn) : this.middlewares.push(fn)
    }

    async innerFetch(req: any): Promise<any> {
        const context = this.createContext(req, null)
        const composeMiddleware = compose([...this.middlewares, this.fetchMiddleware])
        await composeMiddleware(context)
        return context.data
    }

    private createContext(req, res): Context {
        const request = new Request(req)
        const response = new Response(res)
        return { request, response, data: null, fetchPlus: this }
    }

} 