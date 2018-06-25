const redis = require('redis')
const isString = require('lodash/isString')
const isInteger = require('lodash/isInteger')

class CacheModule {
	constructor({ redisConnectionString, cacheKeyPrefix }) {
		this.redisClient = redis.createClient(redisConnectionString, {
			retry_strategy: options => Math.min(options.attempt * 500, 10000),
		})

		this.cacheKeyPrefix = cacheKeyPrefix || ''
	}

	/**
	 *
	 * @param {string} key Cache Key
	 */
	getStringValue(key) {
		return new Promise((resolve, reject) => {
			if (!isString(key)) return reject('Key must be a string')

			this.redisClient.get(this.cacheKeyPrefix + key, (err, value) => {
				if (err) return reject(err)
				if (!value) return reject('No value')
				resolve(value)
			})
		})
	}

	/**
	 *
	 * @param {string} key Cache Key
	 * @param {any} value Value to be cached
	 * @param {number} expires TTL in seconds
	 */
	setStringValue(key, value, expires) {
		return new Promise((resolve, reject) => {
			if (!isString(key)) return reject('Key must be a string')
			if (!isString(value)) return reject('Value must be a sting')
			if (!isInteger(expires)) expires = 60 * 10 // Defaults to 10 minutes

			// Allow max 1 week
			if (expires > 604800) expires = 604800

			this.redisClient.set(this.cacheKeyPrefix + key, value, 'EX', expires, err => {
				if (err) return reject(err)
				if (!value) return reject('Cache miss')
				resolve()
			})
		})
	}

	/**
	 * Will remove an entry from cache
	 * @param {string} key Cache key
	 */
	clearValue(key) {
		return new Promise((resolve, reject) => {
			if (!isString(key)) return reject('Key must be a string')
			this.redisClient.del(this.cacheKeyPrefix + key, err => {
				if (err) return reject(err)
				resolve()
			})
		})
	}

	invalidate(key) {
		this.clearValue(key)
			.then(() => {})
			.catch(err => console.log('Error clearing value from cache: ', err))
	}

	/**
	 * Will get value from cache and deserialize it
	 * before returning it to
	 * @param {string} key Cache key
	 */
	getObectValue(key) {
		return new Promise((resolve, reject) => {
			this.getStringValue(key)
				.then(result => {
					const parsedResult = JSON.parse(result)
					resolve(parsedResult)
				})
				.catch(reject)
		})
	}

	/**
	 * Will store an object in cache. Value can be retrieveed
	 * by using getObjectValue
	 * @param {string} key
	 * @param {Object} value
	 * @param {integer} expires
	 */
	setObjectValue(key, value, expires) {
		return new Promise((resolve, reject) => {
			const valueForStore = JSON.stringify(value)
			this.setStringValue(key, valueForStore, expires)
				.then(resolve)
				.catch(reject)
		})
	}
}

module.exports = CacheModule
