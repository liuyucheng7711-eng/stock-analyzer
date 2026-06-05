from flask import Blueprint, request, jsonify
from services.data_fetcher import DataFetcher
from services.screener import StockScreener
import os

stocks_bp = Blueprint('stocks', __name__, url_prefix='/api/stocks')

# Initialize fetcher and screener
fetcher = DataFetcher(os.getenv('TUSHARE_API_KEY', ''))
screener = StockScreener(fetcher)

@stocks_bp.route('/limit-up', methods=['GET'])
def get_limit_up():
    """
    Get limit-up stocks (涨停板)
    """
    try:
        date = request.args.get('date')
        result = screener.screen_limit_up(date)
        return jsonify({
            'code': 200,
            'message': 'Success',
            'data': result
        })
    except Exception as e:
        return jsonify({
            'code': 500,
            'message': str(e),
            'data': []
        }), 500

@stocks_bp.route('/under-20', methods=['GET'])
def get_under_20():
    """
    Get stocks under 20 yuan (20元以下)
    """
    try:
        date = request.args.get('date')
        result = screener.screen_under_20(date)
        return jsonify({
            'code': 200,
            'message': 'Success',
            'data': result
        })
    except Exception as e:
        return jsonify({
            'code': 500,
            'message': str(e),
            'data': []
        }), 500

@stocks_bp.route('/info/<ts_code>', methods=['GET'])
def get_stock_info(ts_code):
    """
    Get detailed stock information
    """
    try:
        info = fetcher.get_stock_info(ts_code)
        return jsonify({
            'code': 200,
            'message': 'Success',
            'data': info
        })
    except Exception as e:
        return jsonify({
            'code': 500,
            'message': str(e),
            'data': {}
        }), 500

@stocks_bp.route('/list', methods=['GET'])
def get_stock_list():
    """
    Get basic stock list
    """
    try:
        df = fetcher.pro.query('stock_basic', fields='ts_code,name,industry,area')
        data = df.to_dict('records')
        return jsonify({
            'code': 200,
            'message': 'Success',
            'data': data,
            'total': len(data)
        })
    except Exception as e:
        return jsonify({
            'code': 500,
            'message': str(e),
            'data': []
        }), 500