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
	await next()
} 