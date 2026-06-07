"""
Cache module for Stock Analyzer
Provides Redis-based and in-memory caching solutions
"""

import redis
import json
import hashlib
from datetime import datetime, timedelta
from functools import wraps
import os
import logging
from typing import Any, Callable, Optional

logger = logging.getLogger(__name__)

class CacheManager:
    """Unified cache management interface"""
    
    def __init__(self, redis_url: Optional[str] = None):
        """Initialize cache manager
        
        Args:
            redis_url: Redis connection URL, if None uses in-memory cache
        """
        self.use_redis = False
        self.redis_client = None
        self.memory_cache = {}
        
        if redis_url:
            try:
                self.redis_client = redis.from_url(redis_url)
                self.redis_client.ping()
                self.use_redis = True
                logger.info("Redis cache enabled")
            except Exception as e:
                logger.warning(f"Failed to connect to Redis: {e}, falling back to memory cache")
                self.use_redis = False
    
    def set(self, key: str, value: Any, expire_time: int = 3600) -> bool:
        """Set cache value
        
        Args:
            key: Cache key
            value: Value to cache
            expire_time: Expiration time in seconds
            
        Returns:
            bool: Success status
        """
        try:
            serialized_value = json.dumps(value)
            
            if self.use_redis:
                self.redis_client.setex(key, expire_time, serialized_value)
            else:
                self.memory_cache[key] = {
                    'value': serialized_value,
                    'expire': datetime.now() + timedelta(seconds=expire_time)
                }
            return True
        except Exception as e:
            logger.error(f"Cache set error for key {key}: {e}")
            return False
    
    def get(self, key: str) -> Optional[Any]:
        """Get cache value
        
        Args:
            key: Cache key
            
        Returns:
            Cached value or None
        """
        try:
            if self.use_redis:
                value = self.redis_client.get(key)
                if value:
                    return json.loads(value)
            else:
                if key in self.memory_cache:
                    item = self.memory_cache[key]
                    if item['expire'] > datetime.now():
                        return json.loads(item['value'])
                    else:
                        del self.memory_cache[key]
            return None
        except Exception as e:
            logger.error(f"Cache get error for key {key}: {e}")
            return None
    
    def delete(self, key: str) -> bool:
        """Delete cache value
        
        Args:
            key: Cache key
            
        Returns:
            bool: Success status
        """
        try:
            if self.use_redis:
                self.redis_client.delete(key)
            else:
                if key in self.memory_cache:
                    del self.memory_cache[key]
            return True
        except Exception as e:
            logger.error(f"Cache delete error for key {key}: {e}")
            return False
    
    def clear(self) -> bool:
        """Clear all cache
        
        Returns:
            bool: Success status
        """
        try:
            if self.use_redis:
                self.redis_client.flushdb()
            else:
                self.memory_cache.clear()
            return True
        except Exception as e:
            logger.error(f"Cache clear error: {e}")
            return False
    
    @staticmethod
    def generate_key(*args, **kwargs) -> str:
        """Generate cache key from arguments
        
        Returns:
            str: Generated cache key
        """
        key_str = str(args) + str(sorted(kwargs.items()))
        return hashlib.md5(key_str.encode()).hexdigest()


# Global cache manager instance
_cache_manager = None

def get_cache_manager() -> CacheManager:
    """Get or create global cache manager"""
    global _cache_manager
    if _cache_manager is None:
        redis_url = os.getenv('REDIS_URL')
        _cache_manager = CacheManager(redis_url)
    return _cache_manager


def cached(expire_time: int = 3600):
    """Decorator for caching function results
    
    Args:
        expire_time: Cache expiration time in seconds
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            cache = get_cache_manager()
            cache_key = f"{func.__name__}:{CacheManager.generate_key(*args, **kwargs)}"
            
            # Try to get from cache
            cached_value = cache.get(cache_key)
            if cached_value is not None:
                logger.debug(f"Cache hit for {cache_key}")
                return cached_value
            
            # Call function and cache result
            result = func(*args, **kwargs)
            cache.set(cache_key, result, expire_time)
            logger.debug(f"Cache set for {cache_key}")
            return result
        
        return wrapper
    return decorator
