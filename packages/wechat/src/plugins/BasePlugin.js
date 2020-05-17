import urlJoin from 'url-join'

export default (options={}) => async (ctx, next) => {
	const { baseUrl, search: oSearch, body: oBody, method: oMethod, type: oType, dataType: oDataType } = options
	const { request } = ctx
	const { url, body, req } = request
	const { search, method, type, dataType } = req

	const { pre, post } = options

	pre && Reflect.apply(pre, null, [request, ctx, body, req])
	baseUrl && (request.url = urlJoin(baseUrl, url))
	oSearch && typeof oSearch === 'object' && Object.keys(oSearch).length > 0 && (req.search = Object.assign({}, oSearch, search))
	oBody && typeof oBody === 'object'  && Object.keys(oBody).length > 0 && (request.body = Object.assign({}, oBody, body))
	oMethod && !method && (req.method = oMethod)
	oType && !type && (req.type = oType)
	oDataType && !dataType && (req.dataType = oDataType)
	await next()    
	post && Reflect.apply(post, null, [response, ctx, ctx.data, req])
} 