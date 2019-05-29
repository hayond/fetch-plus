
const dataTypeMethods = ['json', 'text', 'blob']

export default (options?) => async (ctx, next) => {
	await next()
	const { request: { req: { dataType } }, response } = ctx
	let responseData
	if (dataType) {
		if (dataTypeMethods.some(method => method === dataType)) {
			const data = await response[dataType].call(response)
			responseData = data
		}
	}
	ctx.data = responseData || await response.data()
} 