import URLSearchParams from '@ungap/url-search-params'
import urlJoin from 'url-join'

const TYPE_JSON = 'application/json'
const TYPE_FORM = 'application/x-www-form-urlencoded'
const TYPE_MULTIPART = 'multipart/form-data'

export default (options?) => async (ctx, next) => {
	const { request } = ctx
	const { url, method, body, req: { search, type } } = request
	if (search) {
		const searchString = `?${new URLSearchParams(search)}`
		request.url = urlJoin(url, searchString)
	}
	if (type) {
		const contentType = type === 'json' ? TYPE_JSON 
			: type === 'form' ? TYPE_FORM 
			: type === 'multipart' ? TYPE_MULTIPART : ''
		contentType && (request.header('Content-Type', contentType))
	}
	if ((method === 'POST' || method === 'PUT') 
		&& typeof body === 'object' && Object.getPrototypeOf(body) === Object.prototype) {
		if (!request.header('Content-Type') || request.is(TYPE_JSON)) {
			request.body = JSON.stringify(body)
		} else if (request.is(TYPE_FORM)) {
			request.body = new URLSearchParams(body).toString()
		} else if (request.is(TYPE_MULTIPART) && typeof FormData === 'function') {
			const formData = new FormData()
			Object.entries(body).forEach(([key, value]: [string, string | Blob]) => formData.append(key, value))
			request.body = formData
		}
	}
	await next()
}