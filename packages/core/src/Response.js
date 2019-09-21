
export default class Response {

	res = {}

	constructor(res) {
		this.res = res
	}

	header(name) {
		return this.headers.get ? this.headers.get(name.toLowerCase()) : ''
	}

	data() {
		const contentType = this.header('Content-Type')
		if (this.is(contentType, 'application/json')) {
			return this.json()
		} else if (this.is(contentType, 'text/plain')) {
			return this.text()
		} else {
			return Promise.resolve(this.res)
		}
	}

	blob() {
		return this.res.blob()
	}

	json() {
		return this.res.json()
	}

	text() {
		return this.res.text()
	}

	get type() {
		const contentType = this.header('Content-Type')
		return contentType ? contentType.split(';', 1)[0] : ''
	}

	get headers() {
		return this.res.headers
	}

	get redirected() {
		return this.res.redirected
	}

	get status() {
		return this.res.status
	}

	get bodyUsed() {
		return this.res.bodyUsed
	}

}