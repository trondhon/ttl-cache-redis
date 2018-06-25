# ttl-cache-redis

This is a supersimple abstraction for storing strings and JSON-objects in redis.

## Installing

Using npm:

```bash
$ npm install @appfarm/ttl-cache-redis
```

## Example

```js
const Cache = require('@appfarm/ttl-cache-redis')
const myCache = new Cache({
	redisConnectionString: 'redis://localhost:6379',
	cacheKeyPrefix: 'MY-CACHE-', // prefix any key with this value
})

// Setting "foo" to MY-CACHE-newkey with a
// lifetime of 10 minutes
myCache
	.setStringValue('newkey', 'foo', 600)
	.then(() => console.log('Successfully set string value'))
	.catch(err => console.error(err))

myCache
	.setObjectValue('myobject', { foo: 'bar' }, 300)
	.then(() => console.log('Successfully set object value'))
	.catch(err => console.error(err))

// Retrieve string value from cache
myCache
	.getStringValue(key)
	.then(value => {
		console.log('Found value:', value)
	})
	.catch(err => {
		console.log('Unable to find value or key has expired')
	})

// Retrieve object value from store
myCache
	.getObectValue(key)
	.then(objectValue => {
		console.log('Found object:', objectValue)
	})
	.catch(err => {
		console.log('Unable to find value or key has expired')
	})

// Fire and forget - delete value from store immediately
// Returns nothing.
myCache.invalidate('newkey')
```
