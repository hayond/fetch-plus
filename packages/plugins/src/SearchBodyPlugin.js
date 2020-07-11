import URLSearchParams from '@ungap/url-search-params'
import urlJoin from 'url-join'
import URL from 'url-parse'
import { parse, compile } from 'path-to-regexp'

const TYPE_JSON = 'application/json'
const TYPE_FORM = 'application/x-www-form-urlencoded'
const TYPE_MULTIPART = 'multipart/form-data'

function toURLSearchParamsString(params) {
	const searchParams = new URLSearchParams()
	Object.entries(params).forEach(([key, value]) => {
		if (typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
			Object.entries(value).forEach(([vKey, vValue]) => { 
				searchParams.append(key, [vKey, vValue].join(','))
			})
		} else if (Array.isArray(value)) {
			value.length > 0 && searchParams.append(key, value.join(','))
		} else {
			searchParams.append(key, value)
		} 
	})
	return searchParams.toString()  
}

export default options => async (ctx, next) => {
	const { request } = ctx
	const { url, method, body, req: { search, type } } = request
	const clonedSearch = Object.assign({}, search)

	// 新版本兼容‘http(s)://’及兼容端口
	const { origin, pathname } = new URL(url)
	url = pathname

	const matchs = parse(url).map(token => typeof token.name === 'string' && token.name || '').filter(v => v)
	// 兼容端口
	// matchs = matchs.filter(match => {
	// 	if (Number(match)) {
	// 		url = url.replace(`:${match}`, `\\:${match}`)
	// 		return false
	// 	}
	// 	return true
	// })
	if (matchs.length > 0) {
		const toPath = compile(url, { encode: encodeURIComponent })
		const matchObject = {}
		matchs.forEach(match => {
			matchObject[match] = clonedSearch[match]
			delete clonedSearch[match]
		})
		request.url = urlJoin(origin, toPath(matchObject))
	}
	if (Object.keys(clonedSearch).length > 0) {
		const searchParamsString = toURLSearchParamsString(clonedSearch)
		request.url = urlJoin(request.url, `?${searchParamsString}`)
	}

	if ((method === 'POST' || method === 'PUT') && type) {
		const contentType = type === 'json' ? TYPE_JSON 
			: type === 'form' ? TYPE_FORM 
			: type === 'multipart' ? TYPE_MULTIPART : ''
		contentType && (request.header('Content-Type', contentType))
	}
	if ((method === 'POST' || method === 'PUT') 
		&& typeof request.is === 'function'
		&& typeof body === 'object' && Object.getPrototypeOf(body) === Object.prototype) {
		if (request.is(TYPE_JSON)) {
			request.body = JSON.stringify(body)
		} else if (request.is(TYPE_FORM)) {
			request.body = toURLSearchParamsString(body)
		} else if (request.is(TYPE_MULTIPART) && typeof FormData === 'function') {
			const formData = new FormData()
			Object.entries(body).forEach(([key, value]) => formData.append(key, value))
			request.body = formData
		} else if (!request.header('Content-Type')) {
			request.header('Content-Type', TYPE_JSON)
			request.body = JSON.stringify(body)
		}
	}
	await next()
}