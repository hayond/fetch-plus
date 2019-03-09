import compose from 'koa-compose'
import Request from './Request'
import Response from './Response'

export default class FetchPlus {

	middlewares = []
	fetchMiddleware = async (ctx, next) => {
		await next()
		const fetch = this.fetchExec
		const { request: { url, options }, response } = ctx
		const res = await fetch(url, options)
		response.res = res
		response.ctx = ctx
		ctx.data = res
		ctx.response = response
	}

	constructor(options) {
		this.fetchExec = (options && options.fetch) || (typeof fetch === 'function' && fetch)
		if (!this.fetchExec) throw new TypeError('main fetch exec needed!')
	}

	fetch(url, options = {}) { 
		return this._fetch({ url, options })
	}

	_fetch(req) {
		const context = this.createContext(req, null)
		const composeMiddleware = compose([...this.middlewares, this.fetchMiddleware])
		return composeMiddleware(context).then(() => context.data)
	}

	createContext(req, res) {
		const request = new Request(req)
		const response = new Response(res)
		return { request, response, data: null, fetchPlus: this }
	}

	use(fn, index) {
		if (Array.isArray(fn)) {
			fn.forEach(fnItem => this.use(fnItem, index))
			return
		} 
		if (typeof fn !== 'function') throw new TypeError('middleware must be a function!')
		index ? this.middlewares.splice(index, 0, fn) : this.middlewares.push(fn)
	}

}