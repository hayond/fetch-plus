import FetchPlus from './core/FetchPlus'
import defaultPlugins from './plugins/DefaultPlugins'
export { basePlugin } from './plugins/DefaultPlugins'

function promisify(api) {
	return function (options = {}) {
		return new Promise((resolve, reject) => {
			options = {...options, ...{
				success: resolve, fail: reject
			}}
			Reflect.apply(api, undefined, [options])
		})
	} 
}

export const request = promisify(wx.request)

export class FetchPlusPonyfill extends FetchPlus {

     static fetchFunc = async (url, options) => {
        const requestOptions = {url, ...options}
        requestOptions.headers && (requestOptions.header = requestOptions.headers)
        requestOptions.body && (requestOptions.data = requestOptions.body)
        return await request(requestOptions)
    }
    
    constructor(options = {}) {
        options.fetch = options.fetch || FetchPlusPonyfill.fetchFunc
		options.plugins = options.plugins ? defaultPlugins.concat(options.plugins) : defaultPlugins
        super(options)
        this.fetchMiddleware = async (ctx, next) => {
            await next()
            const fetch = this.fetchExec
            const { request: { url, options, req: { dataType, responseType } }, response } = ctx
            options.dataType = dataType
            options.responseType = responseType
            const res = await fetch(url, options)
            res.headers = res.header
            response.res = res
            response.ctx = ctx
            ctx.data = res
        }
    }

}

function getFetch() {
	const instance = new FetchPlusPonyfill()
	const fetch = instance.fetch.bind(instance)
	fetch.instance = instance
	fetch.use = instance.use.bind(instance)
	return fetch
} 

export const fetch = getFetch()