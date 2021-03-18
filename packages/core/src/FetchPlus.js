import compose from 'koa-compose'
import Request from './Request'
import Response from './Response' 

export class InterruptError extends Error { }

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

    constructor(options={}) {
        this.fetchExec = options.fetch || (typeof fetch === 'function' && fetch)
        if (!this.fetchExec) throw new TypeError('main fetch exec needed!')
        options.plugins && this.use(options.plugins)
    }

    fetch(url, options={}) {
        const innerFetchPromise = this.innerFetch({ url, options })
        innerFetchPromise.catch(error => {
            if (error instanceof InterruptError) return new Promise((resolve, reject) => {})
            throw error
        })
    }

    use(fn, index) {
        if (Array.isArray(fn)) {
            fn.forEach(fnItem => this.use(fnItem, index))
            return this
        }
        if (typeof fn !== 'function') throw new TypeError('middleware must be a function!')
        index !== undefined ? this.middlewares.splice(index, 0, fn) : this.middlewares.push(fn)
        return this
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
        return { request, response, data: null, fetchPlus: this, interrupt: this.interrupt.bind(this) }
    }

    interrupt() {
        throw new InterruptError('interrupt fetch')
    }

}