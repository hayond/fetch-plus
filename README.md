# fetch-plus

koa style middleware for Fetch API on browser and nodejs

### Install

```
npm install @fetch-plus/ponyfill --save
// for browser
// npm install @fetch-plus/web --save
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
	// dataType: 'json',
	search: { meta: true }
}).then(data => {
	console.log(data)
})

```

### Methods

#### fetch(url, options)
```js
fetch('https://unpkg.com/react', { dataType: 'text' })
```

#### fetch.use(middleware, index)
```js
fetch(async (ctx, next) => {
	...
	await next()
	...
}, 0)
```
index is the order in the middleware list, default will push to the end

### Classes

#### FetchPlusPonyfill
```js
import FetchPlusPonyfill, { fetch, basePlugin } from  '@fetch-plus/ponyfill'
// import searchBodyPlugin from '@fetch-plus/plugins/lib/SearchBodyPlugin'

const fetchPlus = new FetchPlusPonyfill()

// use basePlugin to add baseUrl, baseSearch, baseBody and so on.
fetchPlus.use(basePlugin({
	baseUrl: 'https://unpkg.com',
	search: {},
	body: {}
}), 0)

fetch.use(async (ctx, next) => {
	const { request } = ctx
	// some middleware logic
	await next()
})

// FetchPlus.use(searchBodyPlugin()) // Aleady in FetchPlusPonyfill!
fetchPlus.fetch('react', { dataType: 'text' })
```
method fetch is the shortcut of the FetchPlusPonyfill instance, with default inner plugins:
- DataTypePlugin
- TypeIsPlugin
- SearchBodyPlugin

#### FetchPlus
```js
import FetchPlus from '@fetch-plus/core'
```
base FetchPlus class without [fetch-ponyfill](https://github.com/qubyte/fetch-ponyfill) and [DefaultPlugins](https://github.com/touwaka/fetch-plus/blob/master/packages/plugins/src/DefaultPlugins.js)


