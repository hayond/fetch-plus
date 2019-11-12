
export default class FakePromise {

	thenCallback = () => {}
	catchCallback = () => {}
	finallyCallback = () => {}

	constructor(promise, options = {}) {
		this.promise = promise
		this.options = options

		this.resultPromise = promise.then(data => {
			if (options.then) {
				data = Reflect.apply(options.then, this, [data])
				if (data === false) return
			}
			return Reflect.apply(this.thenCallback, this, [data])
		}).catch(data => {
			if (options.catch) {
				data = Reflect.apply(options.catch, this, [data])
				if (data === false) return
			}
			return Reflect.apply(this.catchCallback, this, [data])
		}).finally(data => {
			if (options.finally) {
				data = Reflect.apply(options.finally, this, [data])
				if (data === false) return
			}
			return Reflect.apply(this.finallyCallback, this, [data])
		})
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

