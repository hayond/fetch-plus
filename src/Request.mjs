
export default class Request {

	static fetchOptionNames = ['method', 'headers', 'body', 'mode', 'credentials',
		'cache', 'redirect', 'referrer', 'integrity']

	req = {}

	constructor(originalReq) {
		if (originalReq) {
			this.originalReq = originalReq
			const { url, options } = originalReq
			const req = Object.assign({}, options)
			req.url = url
			this.req = req
		}
	}

	header(name, value) {
		const headers = this.headers || {}
		if (!value) {
			let headerValue
			Object.keys(headers).some(headerName => {
				if (headerName.toLowerCase() === name.toLowerCase()) {
					headerValue = headers[headerName]
					return true
				}
			})
			return headerValue
		} else {
			Object.keys(headers).some(headerName => {
				if (headerName.toLowerCase() === name.toLowerCase()) {
					headers[headerName] = value
					return true
				}
			}) || (headers[name] = value)
		}
	}

	is(...types) {
		const contentType = this.header('Content-Type')
		return types.some(type => typeis(contentType, type))
	}

	get options() {
		const options = {} 
		this.constructor.fetchOptionNames.forEach(optionName => (options[optionName] = this.req[optionName]))
		return options
	}

	get url() {
		return this.req.url
	}

	set url(value) {
		this.req.url = value
	}

	get method() {
		return this.req.method ? this.req.method.toUpperCase() : 'GET'
	}

	set method(value) {
		this.req.method = value
	}

	get headers() {
		return this.req.headers
	}

	set headers(value) {
		this.req.headers = value
	}

	get body() {
		return this.req.body
	}

	set body(value) {
		this.req.body = body
	}

	get mode() {
		return this.req.mode
	}

	set mode(value) {
		this.req.mode = value
	}

	get credentials() {
		return this.req.credentials
	}

	set credentials(value) {
		this.req.credentials = value
	}

	get cache() {
		return this.req.cache
	}

	set cache(value) {
		this.req.cache = value
	}	

	get redirect() {
		return this.req.redirect
	}

	set redirect(value) {
		this.req.redirect = value
	}

	get referrer() {
		return this.req.referrer
	}

	set referrer(value) {
		this.req.referrer = value
	}

	get integrity() {
		return this.req.integrity
	}

	set integrity(value) {
		this.req.integrity = value
	}

}