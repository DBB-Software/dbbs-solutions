import { describe, beforeEach, jest, it, expect } from '@jest/globals'
import { Test, TestingModule } from '@nestjs/testing'
import { CacheManager } from '../app.service.js'
import { Redis } from 'ioredis'

jest.mock('@nestjs-modules/ioredis', () => ({
  InjectRedis: () => jest.fn()
}))

describe('CacheManager', () => {
  let cacheManager: CacheManager
  let redisClientMock: jest.Mocked<Redis>

  beforeEach(async () => {
    redisClientMock = {
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
      expire: jest.fn(),
      flushall: jest.fn(),
      keys: jest.fn(),
      ttl: jest.fn(),
      setnx: jest.fn(),
      setex: jest.fn(),
      exists: jest.fn()
    } as unknown as jest.Mocked<Redis>

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheManager,
        {
          provide: Redis,
          useValue: redisClientMock
        }
      ]
    }).compile()

    cacheManager = module.get<CacheManager>(CacheManager)
  })

  describe('set', () => {
    it.each([
      {
        name: 'should set a value in Redis with TTL',
        serviceMethodArgs: ['key', { data: 'value' }, 3600],
        expectedParams: ['key', JSON.stringify({ data: 'value' }), 'EX', 3600],
        setupMocks: () => jest.spyOn(redisClientMock, 'set').mockResolvedValue('OK')
      },
      {
        name: 'should set a value in Redis without TTL',
        serviceMethodArgs: ['key', { data: 'value' }],
        expectedParams: ['key', JSON.stringify({ data: 'value' })],
        setupMocks: () => jest.spyOn(redisClientMock, 'set').mockResolvedValue('OK')
      },
      {
        name: 'should throw an error if Redis operation fails',
        serviceMethodArgs: ['key', { data: 'value' }],
        expectedError: new Error('Redis error'),
        setupMocks: () => jest.spyOn(redisClientMock, 'set').mockRejectedValue(new Error('Redis error'))
      }
    ])('$name', async ({ serviceMethodArgs, expectedParams, expectedError, setupMocks }) => {
      setupMocks()

      const pendingResult = cacheManager.set(...(serviceMethodArgs as [string, unknown, number?]))

      if (expectedParams) {
        await expect(pendingResult).resolves.toBeUndefined()
        expect(redisClientMock.set).toHaveBeenCalledWith(...expectedParams)
      } else {
        await expect(pendingResult).rejects.toThrow(expectedError)
      }
    })
  })

  describe('get', () => {
    it.each([
      {
        name: 'should get a value from Redis',
        serviceMethodArgs: 'key',
        expectedResult: { data: 'value' },
        setupMocks: () => jest.spyOn(redisClientMock, 'get').mockResolvedValue(JSON.stringify({ data: 'value' }))
      },
      {
        name: 'should return null if key does not exist',
        serviceMethodArgs: 'key',
        expectedResult: null,
        setupMocks: () => jest.spyOn(redisClientMock, 'get').mockResolvedValue(null)
      },
      {
        name: 'should throw an error if Redis operation fails',
        serviceMethodArgs: 'key',
        expectedError: new Error('Redis error'),
        setupMocks: () => jest.spyOn(redisClientMock, 'get').mockRejectedValue(new Error('Redis error'))
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedError, setupMocks }) => {
      setupMocks()

      const pendingResult = cacheManager.get(serviceMethodArgs as string)

      if (expectedResult !== undefined) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toThrow(expectedError)
      }
    })
  })

  describe('delete', () => {
    it.each([
      {
        name: 'should delete a key from Redis',
        serviceMethodArgs: 'key',
        expectedParams: ['key'],
        setupMocks: () => jest.spyOn(redisClientMock, 'del').mockResolvedValue(1)
      },
      {
        name: 'should throw an error if Redis operation fails',
        serviceMethodArgs: 'key',
        expectedError: new Error('Redis error'),
        setupMocks: () => jest.spyOn(redisClientMock, 'del').mockRejectedValue(new Error('Redis error'))
      }
    ])('$name', async ({ serviceMethodArgs, expectedParams, expectedError, setupMocks }) => {
      setupMocks()

      const pendingResult = cacheManager.delete(serviceMethodArgs as string)

      if (expectedParams) {
        await expect(pendingResult).resolves.toBeUndefined()
        expect(redisClientMock.del).toHaveBeenCalledWith(...expectedParams)
      } else {
        await expect(pendingResult).rejects.toThrow(expectedError)
      }
    })
  })

  describe('invalidate', () => {
    it.each([
      {
        name: 'should delete keys matching a pattern',
        serviceMethodArgs: 'key*',
        expectedKeys: ['key1', 'key2'],
        setupMocks: () => {
          jest.spyOn(redisClientMock, 'keys').mockResolvedValue(['key1', 'key2'])
          jest.spyOn(redisClientMock, 'del').mockResolvedValue(2)
        }
      },
      {
        name: 'should do nothing if no keys match the pattern',
        serviceMethodArgs: 'key*',
        expectedKeys: [],
        setupMocks: () => jest.spyOn(redisClientMock, 'keys').mockResolvedValue([])
      }
    ])('$name', async ({ serviceMethodArgs, expectedKeys, setupMocks }) => {
      setupMocks()

      await cacheManager.invalidate(serviceMethodArgs)

      expect(redisClientMock.keys).toHaveBeenCalledWith(serviceMethodArgs)
      if (expectedKeys.length > 0) {
        expect(redisClientMock.del).toHaveBeenCalledWith(...expectedKeys)
      } else {
        expect(redisClientMock.del).not.toHaveBeenCalled()
      }
    })
  })

  describe('expire', () => {
    it('should set expiration time for a key', async () => {
      redisClientMock.expire.mockResolvedValue(1)
      await expect(cacheManager.expire('key', 3600)).resolves.toBeUndefined()
      expect(redisClientMock.expire).toHaveBeenCalledWith('key', 3600)
    })

    it('should throw an error if Redis operation fails', async () => {
      redisClientMock.expire.mockRejectedValue(new Error('Redis error'))
      await expect(cacheManager.expire('key', 3600)).rejects.toThrow('Redis error')
    })
  })

  describe('reset', () => {
    it('should flush all keys in Redis', async () => {
      redisClientMock.flushall.mockResolvedValue('OK')
      await expect(cacheManager.reset()).resolves.toBeUndefined()
      expect(redisClientMock.flushall).toHaveBeenCalled()
    })

    it('should throw an error if Redis operation fails', async () => {
      redisClientMock.flushall.mockRejectedValue(new Error('Redis error'))
      await expect(cacheManager.reset()).rejects.toThrow('Redis error')
    })
  })

  describe('extend', () => {
    it('should extend TTL for a key', async () => {
      redisClientMock.ttl.mockResolvedValue(3600)
      redisClientMock.expire.mockResolvedValue(1)
      await expect(cacheManager.extend('key', 3600)).resolves.toBeUndefined()
      expect(redisClientMock.ttl).toHaveBeenCalledWith('key')
      expect(redisClientMock.expire).toHaveBeenCalledWith('key', 7200)
    })

    it('should throw an error if TTL cannot be retrieved', async () => {
      redisClientMock.ttl.mockRejectedValue(new Error('Redis error'))
      await expect(cacheManager.extend('key', 3600)).rejects.toThrow('Redis error')
    })
  })

  describe('exists', () => {
    it('should return true if key exists in Redis', async () => {
      redisClientMock.exists.mockResolvedValue(1)
      await expect(cacheManager.exists('key')).resolves.toBe(true)
      expect(redisClientMock.exists).toHaveBeenCalledWith('key')
    })

    it('should return false if key does not exist in Redis', async () => {
      redisClientMock.exists.mockResolvedValue(0)
      await expect(cacheManager.exists('key')).resolves.toBe(false)
    })

    it('should throw an error if Redis operation fails', async () => {
      redisClientMock.exists.mockRejectedValue(new Error('Redis error'))
      await expect(cacheManager.exists('key')).rejects.toThrow('Redis error')
    })
  })

  describe('setIfNotExists', () => {
    it('should set key if not exists with TTL', async () => {
      redisClientMock.setex.mockResolvedValue('OK')
      await expect(cacheManager.setIfNotExists('key', { data: 'value' }, 3600)).resolves.toBe(true)
      expect(redisClientMock.setex).toHaveBeenCalledWith('key', 3600, JSON.stringify({ data: 'value' }))
    })

    it('should set key if not exists without TTL', async () => {
      redisClientMock.setnx.mockResolvedValue(1)
      await expect(cacheManager.setIfNotExists('key', { data: 'value' })).resolves.toBe(true)
      expect(redisClientMock.setnx).toHaveBeenCalledWith('key', JSON.stringify({ data: 'value' }))
    })

    it('should throw an error if Redis operation fails', async () => {
      redisClientMock.setnx.mockRejectedValue(new Error('Redis error'))
      await expect(cacheManager.setIfNotExists('key', { data: 'value' })).rejects.toThrow('Redis error')
    })
  })
})
