import { Injectable, Logger } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { Redis } from 'ioredis'

@Injectable()
export class CacheManager {
  // TODO: use external Logger package
  private readonly logger = new Logger(CacheManager.name)

  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value)
      if (ttl) {
        await this.redisClient.set(key, serializedValue, 'EX', ttl)
      } else {
        await this.redisClient.set(key, serializedValue)
      }
    } catch (error) {
      this.logger.error(`Failed to set key "${key}":`, error)
      throw error
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redisClient.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      this.logger.error(`Failed to get key "${key}":`, error)
      throw error
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redisClient.del(key)
    } catch (error) {
      this.logger.error(`Failed to delete key "${key}":`, error)
      throw error
    }
  }

  async expire(key: string, ttl: number): Promise<void> {
    try {
      await this.redisClient.expire(key, ttl)
    } catch (error) {
      this.logger.error(`Failed to set expiration for key "${key}":`, error)
      throw error
    }
  }

  async reset(): Promise<void> {
    try {
      await this.redisClient.flushall()
    } catch (error) {
      this.logger.error('Failed to reset cache:', error)
      throw error
    }
  }

  async invalidate(pattern: string): Promise<void> {
    try {
      const keys = await this.redisClient.keys(pattern)
      if (keys.length) {
        await this.redisClient.del(...keys)
      }
    } catch (error) {
      this.logger.error(`Failed to invalidate keys with pattern "${pattern}":`, error)
      throw error
    }
  }

  async extend(key: string, additionalTTL: number): Promise<void> {
    try {
      const currentTTL = await this.redisClient.ttl(key)
      if (currentTTL > 0) {
        await this.redisClient.expire(key, currentTTL + additionalTTL)
      }
    } catch (error) {
      this.logger.error(`Failed to extend TTL for key "${key}":`, error)
      throw error
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redisClient.exists(key)
      return result > 0
    } catch (error) {
      this.logger.error(`Failed to check existence of key "${key}":`, error)
      throw error
    }
  }

  async setIfNotExists(key: string, value: unknown, ttl?: number): Promise<boolean> {
    try {
      const serializedValue = JSON.stringify(value)
      if (ttl) {
        await this.redisClient.setex(key, ttl, serializedValue)
        return true
      }
      const result = await this.redisClient.setnx(key, serializedValue)
      return result === 1
    } catch (error) {
      this.logger.error(`Failed to set key "${key}" if not exists:`, error)
      throw error
    }
  }
}
