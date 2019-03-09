const { fetch } = require('./dist/FetchPlusPonyfill')

fetch.use(async (ctx, next) => {
	const { request } = ctx
	request.url = `https://unpkg.com/${request.url}`
	await next()
})

fetch('react', { 
	// dataType: 'json',
	search: { meta: true }
}).then(data => {
	console.log(data)
})
