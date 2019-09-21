import { is as typeis } from './type-is'

export default options => async (ctx, next) => {
	const { request, response } = ctx
	const objs = [request, response]
	objs.forEach(obj => {
		obj.is = (function (...types) {
			const contentType = this.header('Content-Type')
			return types.some(type => !!typeis(contentType, type))
		}).bind(obj)
	})
	response.data = (function () {
		const contentType = this.header('Content-Type')
		if (this.is(contentType, 'application/json')) {
			return this.json()
		} else if (this.is(contentType, 'text/plain')) {
			return this.text()
		} else {
			return Promise.resolve(this.res)
		}
	}).bind(response)
	await next()
} 