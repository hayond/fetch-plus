# fetch-plus

koa style middleware for Fetch API on browser and nodejs

### Install

```
npm install @fetch-plus/ponyfill --save
```

### Usage

```js
import { fetch } from '@fetch-plus/ponyfill'

fetch.use(async (ctx, next) => {
	const { request } = ctx
	request.url = `https://unpkg.com/${request.url}`
	await next()
})

fetch('react', { 
	// method: 'GET'
	// dataType: 'json', // default response return json, ['json', 'text', 'blob']
	// type: 'json', // default request content-type is json, ['json', 'form', 'multipart']
	search: { meta: true } // query params append to url, ex: '?meta=true' 
	// body: {}, // when method is ['POST', 'PUT', 'PATCH'], the body be submited
	// headers: {}, // request headers
	// credentials: 'include', // cors cookie 
}).then(data => {
	console.log(data)
})

// or use base plugin
fetch.base({
	baseUrl: 'https://unpkg.com/',
	search: { meta: true },
	// body: {},
	// headers: {},
	// credentials: 'include',
	// method: 'GET',
	// type: '', // ['json', 'form', 'multipart']
	// dataType: '', // ['json', 'text', 'blob'] 
	// pre(request, ctx, body, req) {  },
	// post(response, ctx, data, req) {  },
	// catch(error) {  }
})

fetch('react').then(data => console.log(data))
```

### Methods

#### fetch(url, options)
```js
fetch('https://unpkg.com/react', { dataType: 'text' })
```

#### fetch.base(options)
```js
fetch.base({
	baseUrl: '/',
	search: {},
	body: {},
	headers: {},
	credentials: 'include',
	method: 'GET',
	type: '', // ['json', 'form', 'multipart']
	dataType: '', // ['json', 'text', 'blob'] 
	pre(request, ctx, body, req) { 
		// const { url, options } = req // request arguments

	},
	post(response, ctx, data, req) { 
		// const { url, options } = req // request arguments
		// ctx.data = data.data // change all response data
		// ctx.interrupt() interrupt promise then or catch invoke
	},
	catch(error) {  }
})
```

#### fetch.use(middleware, index)
```js
fetch.use(async (ctx, next) => {
	...
	await next()
	...
}, 0)
```
index is the order in the middleware list, default will push to the end

### Classes

#### FetchPlusPonyfill
```js
import FetchPlusPonyfill, { fetch } from  '@fetch-plus/ponyfill'

const fetchPlus = new FetchPlusPonyfill()

// use basePlugin to add baseUrl, baseSearch, baseBody and so on.
fetchPlus.base({
	baseUrl: 'https://unpkg.com',
	search: {} 
})

fetchPlus.fetch('react', { dataType: 'text' })
```
method fetch is the shortcut of the FetchPlusPonyfill instance, with default inner plugins:
- BasePlugin
- DataTypePlugin
- TypeIsPlugin
- SearchBodyPlugin

#### FetchPlus
```js
import FetchPlus from '@fetch-plus/core'
```
base FetchPlus class without [fetch-ponyfill](https://github.com/qubyte/fetch-ponyfill) and [DefaultPlugins](https://github.com/touwaka/fetch-plus/blob/master/packages/plugins/src/DefaultPlugins.js)

