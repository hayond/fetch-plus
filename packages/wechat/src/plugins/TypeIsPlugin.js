import { is as typeis } from './type-is'

export default options => async (ctx, next) => {
	const { request, response } = ctx
	const objs = [request, response]
	objs.forEach(obj => {
		obj.is = (function (...types) {
			return !!typeis(this.header('Content-Type'), types)
		}).bind(obj)
	})
	response.data = (function () {
		if (this.is('application/json')) {
			return this.json()
		} else if (this.is('text/plain')) {
			return this.text()
		} else {
			return Promise.resolve(this.res)
		}
	}).bind(response)
	await next()
} 