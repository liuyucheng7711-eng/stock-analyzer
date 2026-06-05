import pandas as pd
from typing import List, Dict
from .data_fetcher import DataFetcher
import logging

logger = logging.getLogger(__name__)

class StockScreener:
    """Screen stocks based on various criteria"""
    
    def __init__(self, data_fetcher: DataFetcher):
        self.fetcher = data_fetcher
    
    def screen_limit_up(self, date: str = None) -> List[Dict]:
        """
        Screen for limit-up stocks (涨停板)
        """
        try:
            df = self.fetcher.get_limit_up_stocks(date)
            result = []
            for _, row in df.iterrows():
                result.append({
                    'ts_code': row['ts_code'],
                    'date': row['trade_date'],
                    'close': row['close'],
                    'pct_change': row['pct_chg']
                })
            return result
        except Exception as e:
            logger.error(f"Error screening limit-up stocks: {e}")
            return []
    
    def screen_under_20(self, date: str = None) -> List[Dict]:
        """
        Screen for stocks under 20 yuan (20元以下)
        """
        try:
            df = self.fetcher.get_stocks_under_price(20.0, date)
            result = []
            for _, row in df.iterrows():
                result.append({
                    'ts_code': row['ts_code'],
                    'date': row['trade_date'],
                    'close': row['close'],
                    'volume': row['vol'],
                    'amount': row['amount']
                })
            return result
        except Exception as e:
            logger.error(f"Error screening stocks under 20: {e}")
            return []
    
    def screen_triple_volume(self, threshold: float = 3.0) -> List[Dict]:
        """
        Screen for stocks with triple volume (3倍量股票)
        Volume ratio >= 3.0
        """
        try:
            # Get all stocks
            all_stocks = self.fetcher.pro.query(
                'stock_basic',
                fields='ts_code,name,area,industry'
            )
            
            result = []
            for _, stock in all_stocks.iterrows():
                ts_code = stock['ts_code']
                try:
                    vol_ratio = self.fetcher.calculate_volume_ratio(ts_code)
                    if vol_ratio and vol_ratio.get('volume_ratio', 0) >= threshold:
                        result.append({
                            'ts_code': ts_code,
                            'name': stock['name'],
                            'volume_ratio': vol_ratio['volume_ratio'],
                            'today_vol': vol_ratio['today_vol'],
                            'avg_vol': vol_ratio['avg_vol']
                        })
                except Exception as e:
                    logger.debug(f"Error processing {ts_code}: {e}")
                    continue
            
            return sorted(result, key=lambda x: x['volume_ratio'], reverse=True)
        except Exception as e:
            logger.error(f"Error screening triple volume stocks: {e}")
            return []
    
    def screen_by_turnover_rate(self, min_rate: float = 5.0) -> List[Dict]:
        """
        Screen for high turnover rate stocks (换手率)
        """
        try:
            all_stocks = self.fetcher.pro.query(
                'stock_basic',
                fields='ts_code,name'
            )
            
            result = []
            for _, stock in all_stocks.iterrows():
                ts_code = stock['ts_code']
                try:
                    turnover_df = self.fetcher.get_turnover_rate(ts_code, 1)
                    if not turnover_df.empty:
                        rate = turnover_df.iloc[0]['turnover_rate']
                        if rate and rate >= min_rate:
                            result.append({
                                'ts_code': ts_code,
                                'name': stock['name'],
                                'turnover_rate': rate
                            })
                except Exception as e:
                    logger.debug(f"Error processing {ts_code}: {e}")
                    continue
            
            return sorted(result, key=lambda x: x['turnover_rate'], reverse=True)
        except Exception as e:
            logger.error(f"Error screening by turnover rate: {e}")
            return []
    
    def screen_by_sector(self, sector: str) -> List[Dict]:
        """
        Screen stocks by sector/industry
        """
        try:
            df = self.fetcher.pro.query(
                'stock_basic',
                fields='ts_code,name,industry',
                industry=sector
            )
            
            result = []
            for _, row in df.iterrows():
                result.append({
                    'ts_code': row['ts_code'],
                    'name': row['name'],
                    'industry': row['industry']
                })
            return result
        except Exception as e:
            logger.error(f"Error screening by sector {sector}: {e}")
            return []