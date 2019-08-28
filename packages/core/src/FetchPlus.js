import compose from 'koa-compose'
import Request from './Request'
import Response from './Response' 

export default class FetchPlus {

    static Request = Request
    static Response = Response

    fetchExec = null
    fetchMiddleware = async (ctx, next) => {
        await next()
        const fetch = this.fetchExec
        const { request: { url, options }, response } = ctx
        const res = await fetch(url, options)
        response.res = res
        ctx.data = res
    }
    middlewares = []

    constructor(options) {
        this.fetchExec = (options && options.fetch) || (typeof fetch === 'function' && fetch)
        if (!this.fetchExec) throw new TypeError('main fetch exec needed!')
    }

    fetch(url, options = {}) {
        return this.innerFetch({ url, options })
    }

    use(fn, index) {
        if (Array.isArray(fn)) {
            fn.forEach(fnItem => this.use(fnItem, index))
            return
        }
        if (typeof fn !== 'function') throw new TypeError('middleware must be a function!')
        index ? this.middlewares.splice(index, 0, fn) : this.middlewares.push(fn)
    }

    async innerFetch(req) {
        const context = this.createContext(req, null)
        const composeMiddleware = compose([...this.middlewares, this.fetchMiddleware])
        await composeMiddleware(context)
        return context.data
    }

    createContext(req, res) {
        const request = new Request(req)
        const response = new Response(res)
        return { request, response, data: null, fetchPlus: this }
    }

}