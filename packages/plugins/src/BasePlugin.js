import urlJoin from 'url-join'

export default (options={}) => async (ctx, next) => {
	const { baseUrl, search: oSearch, body: oBody, method: oMethod, type: oType, dataType: oDataType } = options
	const { request } = ctx
	const { url, body, req } = request
	const { search, method, type, dataType } = req

	baseUrl && (request.url = urlJoin(baseUrl, url))
	oSearch && typeof oSearch === 'object' && (req.search = Object.assign({}, oSearch, search))
	oBody && typeof oBody === 'object' && (request.body = Object.assign({}, oBody, body))
	oMethod && !method && (req.method = oMethod)
	oType && !type && (req.type = oType)
	oDataType && !dataType && (req.dataType = oDataType)

	await next()
} 