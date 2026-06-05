from flask import Blueprint, request, jsonify
from services.data_fetcher import DataFetcher
import os

analysis_bp = Blueprint('analysis', __name__, url_prefix='/api/analysis')

fetcher = DataFetcher(os.getenv('TUSHARE_API_KEY', ''))

@analysis_bp.route('/capital-flow/<ts_code>', methods=['GET'])
def get_capital_flow(ts_code):
    """
    Get capital flow data (资金流向)
    """
    try:
        df = fetcher.get_capital_flow(ts_code)
        data = df.to_dict('records') if not df.empty else []
        return jsonify({
            'code': 200,
            'message': 'Success',
            'data': data
        })
    except Exception as e:
        return jsonify({
            'code': 500,
            'message': str(e),
            'data': []
        }), 500

@analysis_bp.route('/turnover-rate/<ts_code>', methods=['GET'])
def get_turnover_rate(ts_code):
    """
    Get turnover rate data (换手率)
    """
    try:
        days = request.args.get('days', 20, type=int)
        df = fetcher.get_turnover_rate(ts_code, days)
        data = df.to_dict('records') if not df.empty else []
        return jsonify({
            'code': 200,
            'message': 'Success',
            'data': data
        })
    except Exception as e:
        return jsonify({
            'code': 500,
            'message': str(e),
            'data': []
        }), 500

@analysis_bp.route('/volume-ratio/<ts_code>', methods=['GET'])
def get_volume_ratio(ts_code):
    """
    Get volume ratio (量比)
    """
    try:
        data = fetcher.calculate_volume_ratio(ts_code)
        return jsonify({
            'code': 200,
            'message': 'Success',
            'data': data
        })
    except Exception as e:
        return jsonify({
            'code': 500,
            'message': str(e),
            'data': {}
        }), 500

@analysis_bp.route('/sector-performance', methods=['GET'])
def get_sector_performance():
    """
    Get sector performance data (板块强度)
    """
    try:
        date = request.args.get('date')
        df = fetcher.get_sector_data(date)
        data = df.to_dict('records') if not df.empty else []
        return jsonify({
            'code': 200,
            'message': 'Success',
            'data': data
        })
    except Exception as e:
        return jsonify({
            'code': 500,
            'message': str(e),
            'data': []
        }), 500