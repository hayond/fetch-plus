# fetch-plus

koa style middleware for Fetch API on browser and nodejs

### Install

```
npm install fetch-p --save
```

### Usage

```js
import { fetch } from  'fetch-p'

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
import FetchPlusPonyfill, { fetch } from  'fetch-p'
import searchBodyPlugin from 'fetch-p/dist/plugins/SearchBodyPlugin'

const FetchPlus = new FetchPlusPonyfill()
FetchPlus.use(searchBodyPlugin())
FetchPlus.fetch('https://unpkg.com/react', { dataType: 'text' })
```
method fetch is the shortcut of the FetchPlusPonyfill instance, with default inner plugins [[DataTypePlugin], [SearchBodyPlugin]]

#### FetchPlus
```
import FetchPlus from 'fetch-p/dist/FetchPlus'
```
base FetchPlus class without [fetch-ponyfill](https://github.com/qubyte/fetch-ponyfill)


