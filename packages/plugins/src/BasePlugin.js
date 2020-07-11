import urlJoin from 'url-join'

const httpReg = /^https?:\/\//

export default (options={}) => async (ctx, next) => {
	const { baseUrl, search: oSearch, body: oBody, headers: oHeaders, credentials: oCredentials, method: oMethod, type: oType, dataType: oDataType } = options
	const { request, response } = ctx
	const { url, body, headers, credentials, req } = request
	const { search, method, type, dataType } = req

	const { pre, post, catch: catchFunc } = options

	try {
		pre && Reflect.apply(pre, null, [request, ctx, body, req])
		baseUrl && (!httpReg.test(url)) && (req.url = urlJoin(baseUrl, url))
		oSearch && typeof oSearch === 'object' && Object.keys(oSearch).length > 0 && (req.search = Object.assign({}, oSearch, search))
		oBody && typeof oBody === 'object'  && Object.keys(oBody).length > 0 && (req.body = Object.assign({}, oBody, body))
		oHeaders && typeof oHeaders === 'object'  && Object.keys(oHeaders).length > 0 && (req.headers = Object.assign({}, oHeaders, headers))
		oMethod && !method && (req.method = oMethod)
		oType && !type && (req.type = oType)
		oDataType && !dataType && (req.dataType = oDataType)
		oCredentials && !credentials && (req.credentials = oCredentials)
		await next()    
		post && Reflect.apply(post, null, [response, ctx, ctx.data, req])
	} catch (error) {
		catchFunc && Reflect.apply(catchFunc, null, [error])
		throw error
	}
} 