const { fetch } = require('./dist/FetchPlusPonyfill')

const res = fetch('https://unpkg.com/react', { 
	// dataType: 'json',
	search: { meta: true }
})

res.then(data => {
	console.log(data)
})