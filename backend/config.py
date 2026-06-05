import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration"""
    DEBUG = False
    TESTING = False
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///stock_analyzer.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # API Keys
    TUSHARE_API_KEY = os.getenv('TUSHARE_API_KEY', '')
    AKSHARE_API_KEY = os.getenv('AKSHARE_API_KEY', '')
    
    # Data Sources
    DATA_SOURCES = ['tushare', 'akshare', 'eastmoney']
    
    # Cache
    CACHE_TIMEOUT = 3600  # 1 hour
    
    # CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}