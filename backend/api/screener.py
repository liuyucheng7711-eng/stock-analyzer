from flask import Blueprint, request, jsonify
from services.data_fetcher import DataFetcher
from services.screener import StockScreener
import os

screener_bp = Blueprint('screener', __name__, url_prefix='/api/screener')

fetcher = DataFetcher(os.getenv('TUSHARE_API_KEY', ''))
screener = StockScreener(fetcher)

@screener_bp.route('/triple-volume', methods=['GET'])
def get_triple_volume():
    """
    Screen for 3x volume stocks (3倍量股票)
    """
    try:
        threshold = request.args.get('threshold', 3.0, type=float)
        result = screener.screen_triple_volume(threshold)
        return jsonify({
            'code': 200,
            'message': 'Success',
            'data': result,
            'total': len(result)
        })
    except Exception as e:
        return jsonify({
            'code': 500,
            'message': str(e),
            'data': [],
            'total': 0
        }), 500

@screener_bp.route('/high-turnover', methods=['GET'])
def get_high_turnover():
    """
    Screen for high turnover rate stocks (高换手率)
    """
    try:
        min_rate = request.args.get('min_rate', 5.0, type=float)
        result = screener.screen_by_turnover_rate(min_rate)
        return jsonify({
            'code': 200,
            'message': 'Success',
            'data': result,
            'total': len(result)
        })
    except Exception as e:
        return jsonify({
            'code': 500,
            'message': str(e),
            'data': [],
            'total': 0
        }), 500

@screener_bp.route('/by-sector', methods=['GET'])
def get_by_sector():
    """
    Screen stocks by sector (按板块筛选)
    """
    try:
        sector = request.args.get('sector', '')
        if not sector:
            return jsonify({
                'code': 400,
                'message': 'Sector parameter required',
                'data': []
            }), 400
        result = screener.screen_by_sector(sector)
        return jsonify({
            'code': 200,
            'message': 'Success',
            'data': result,
            'total': len(result)
        })
    except Exception as e:
        return jsonify({
            'code': 500,
            'message': str(e),
            'data': [],
            'total': 0
        }), 500