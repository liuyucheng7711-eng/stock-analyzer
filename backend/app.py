from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from config import config
import os

def create_app(config_name=None):
    """Application factory"""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize CORS
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})
    
    # Initialize Flask-RESTful API
    api = Api(app)
    
    # Register blueprints
    from api.stocks import stocks_bp
    from api.analysis import analysis_bp
    from api.screener import screener_bp
    
    app.register_blueprint(stocks_bp)
    app.register_blueprint(analysis_bp)
    app.register_blueprint(screener_bp)
    
    # Health check endpoint
    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'message': 'Stock Analyzer API is running'}
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)