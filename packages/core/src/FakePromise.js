
export default class FakePromise {

	thenCallback
	catchCallback
	finallyCallback

	constructor(promise, options = {}) {
		this.promise = promise
		this.options = options

		this.resultPromise = promise.then(data => {
			if (options.then) {
				data = Reflect.apply(options.then, this, [data])
				if (data === false) return
			}
			return this.thenCallback ? Reflect.apply(this.thenCallback, this, [data]) : undefined
		}).catch(data => {
			if (options.catch) {
				data = Reflect.apply(options.catch, this, [data])
				if (data === false) return
			}
			if (this.catchCallback) {
				return Reflect.apply(this.catchCallback, this, [data])
			} else if (data instanceof Error) {
				throw data
			}
		})
		// 兼容finally
		if (this.resultPromise.finally) {
			this.resultPromise.finally(data => {
				if (options.finally) {
					data = Reflect.apply(options.finally, this, [data])
					if (data === false) return
				}
				return this.finallyCallback ? Reflect.apply(this.finallyCallback, this, [data]) : undefined
			})
		}
	} 

	then(thenCallback) {
		this.thenCallback = thenCallback
		return this.resultPromise
	}

	catch(catchCallback) {
		this.catchCallback = catchCallback
		return this.resultPromise
	}

	finally(finallyCallback) {
		this.finallyCallback = finallyCallback
		return this.resultPromise
	}

}

