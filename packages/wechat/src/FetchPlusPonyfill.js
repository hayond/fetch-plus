import FetchPlus from './core/FetchPlus'
import defaultPlugins from './plugins/DefaultPlugins'
import { basePlugin } from './plugins/DefaultPlugins'

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
            Object.assign(response, {
                header(name) {
                    return res.header[name] || ''
                },
                json() {
                    return res.data
                },
                blob() {
                    return res.data
                },
                text() {
                    return res.data
                }
            })
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
    fetch.base = options => {
		instance.use(basePlugin(options), 0)
		return fetch
	}
	return fetch
} 

export const fetch = getFetch()