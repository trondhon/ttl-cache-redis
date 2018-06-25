/**
 * TypeScript definition of CacheModule.js
 *
 * Remove when CacheModule is written in ts.
 */

declare class CacheModule {
	constructor(parameters: { redisConnectionString: string; cacheKeyPrefix: string })

	getStringValue(key: string): Promise<string>
	setStringValue(key: string, value: string, expires: number): Promise<void>
	clearValue(key: string): Promise<void>
	invalidate(key: string): void
	getObectValue(key: string): Promise<object>
	setObjectValue(key: string, value: object, expires: number): Promise<void>
}

export = CacheModule
