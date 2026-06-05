import pandas as pd
import tushare as ts
import akshare as ak
from datetime import datetime, timedelta
import requests
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

class DataFetcher:
    """Fetch stock data from multiple sources"""
    
    def __init__(self, tushare_token: str = ''):
        self.tushare_token = tushare_token
        if tushare_token:
            ts.set_token(tushare_token)
        self.pro = ts.pro_connect()
    
    def get_limit_up_stocks(self, date: str = None) -> pd.DataFrame:
        """
        Get stocks with limit-up (涨停板)
        """
        if date is None:
            date = datetime.now().strftime('%Y%m%d')
        
        try:
            # Try to get from tushare
            df = self.pro.query(
                'daily',
                ts_code='',
                trade_date=date,
                fields='ts_code,trade_date,close,pct_chg,limit_up'
            )
            
            # Filter limit-up stocks (pct_chg >= 10 for A-shares)
            limit_up = df[df['pct_chg'] >= 10]
            return limit_up
        except Exception as e:
            logger.error(f"Error fetching limit-up stocks: {e}")
            return pd.DataFrame()
    
    def get_stocks_under_price(self, price: float = 20.0, date: str = None) -> pd.DataFrame:
        """
        Get stocks under specific price
        """
        if date is None:
            date = datetime.now().strftime('%Y%m%d')
        
        try:
            df = self.pro.query(
                'daily',
                ts_code='',
                trade_date=date,
                fields='ts_code,trade_date,close,vol,amount'
            )
            
            # Filter stocks under price
            under_price = df[df['close'] < price]
            return under_price.sort_values('close')
        except Exception as e:
            logger.error(f"Error fetching stocks under {price}: {e}")
            return pd.DataFrame()
    
    def get_sector_data(self, date: str = None) -> pd.DataFrame:
        """
        Get sector/industry performance data
        """
        if date is None:
            date = datetime.now().strftime('%Y-%m-%d')
        
        try:
            # Using akshare to get sector data
            df = ak.stock_board_lhb_detail_sina(date=date)
            return df
        except Exception as e:
            logger.error(f"Error fetching sector data: {e}")
            return pd.DataFrame()
    
    def get_stock_info(self, ts_code: str) -> Dict:
        """
        Get detailed stock information
        """
        try:
            # Basic info
            info = self.pro.query('stock_basic', ts_code=ts_code)
            
            # Daily info
            daily = self.pro.query(
                'daily',
                ts_code=ts_code,
                fields='ts_code,trade_date,close,high,low,vol,amount,pct_chg,turnover_rate'
            )
            
            return {
                'info': info.to_dict('records')[0] if not info.empty else {},
                'daily': daily.to_dict('records') if not daily.empty else []
            }
        except Exception as e:
            logger.error(f"Error fetching stock info for {ts_code}: {e}")
            return {}
    
    def get_capital_flow(self, ts_code: str) -> pd.DataFrame:
        """
        Get capital flow data (资金流向)
        """
        try:
            df = self.pro.query(
                'moneyflow',
                ts_code=ts_code,
                fields='ts_code,trade_date,buy_sm_vol,buy_sm_amount,sell_sm_vol,sell_sm_amount'
            )
            return df
        except Exception as e:
            logger.error(f"Error fetching capital flow for {ts_code}: {e}")
            return pd.DataFrame()
    
    def get_turnover_rate(self, ts_code: str, days: int = 20) -> pd.DataFrame:
        """
        Get turnover rate (换手率) for recent days
        """
        try:
            df = self.pro.query(
                'daily',
                ts_code=ts_code,
                fields='ts_code,trade_date,close,turnover_rate,vol',
                limit=days
            )
            return df
        except Exception as e:
            logger.error(f"Error fetching turnover rate for {ts_code}: {e}")
            return pd.DataFrame()
    
    def calculate_volume_ratio(self, ts_code: str) -> Dict:
        """
        Calculate volume ratio (量比) - today's volume / average volume
        """
        try:
            # Get recent daily data
            df = self.pro.query(
                'daily',
                ts_code=ts_code,
                fields='ts_code,trade_date,vol',
                limit=20
            )
            
            if df.empty:
                return {}
            
            today_vol = df.iloc[0]['vol']
            avg_vol = df.iloc[1:].mean()['vol']  # Average of last 19 days
            volume_ratio = today_vol / avg_vol if avg_vol > 0 else 0
            
            return {
                'ts_code': ts_code,
                'today_vol': today_vol,
                'avg_vol': avg_vol,
                'volume_ratio': volume_ratio
            }
        except Exception as e:
            logger.error(f"Error calculating volume ratio for {ts_code}: {e}")
            return {}