import fetchPonyfill from 'fetch-ponyfill'
import FetchPlus from '@fetch-plus/core'
import defaultPlugins from '@fetch-plus/plugins'
export { basePlugin } from '@fetch-plus/plugins'

export default class FetchPlusPonyfill extends FetchPlus {

	constructor(options={}) {
		options.fetch = options.fetch || fetchPonyfill().fetch
		options.plugins = options.plugins ? defaultPlugins.concat(options.plugins) : defaultPlugins
		super(options)
	}

} 

function getFetch() {
	const instance = new FetchPlusPonyfill()
	const fetch = instance.fetch.bind(instance)
	fetch.instance = instance
	fetch.use = instance.use.bind(instance)
	return fetch
} 

export const fetch = getFetch()

