
export default class Response {

	res = {}

	constructor(res) {
		this.res = res
	}

	header(name) {
		return this.headers.get ? this.headers.get(name.toLowerCase()) : ''
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