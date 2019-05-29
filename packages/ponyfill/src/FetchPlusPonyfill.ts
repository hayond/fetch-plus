import fetchPonyfill from 'fetch-ponyfill'
import FetchPlus, { ConstructArgs } from '@fetch-plus/core'
import defaultPlugins from '@fetch-plus/plugins'

export default class FetchPlusPonyfill extends FetchPlus {

	constructor(options:ConstructArgs = {}) {
		options.fetch = (options && options.fetch) || fetchPonyfill().fetch
		super(options)
	}

} 

function getFetch() {
	const instance = new FetchPlusPonyfill()
	instance.use(defaultPlugins)
	const fetch = instance.fetch.bind(instance)
	fetch.instance = instance
	fetch.use = instance.use.bind(instance)
	return fetch
}

export const fetch = getFetch()