import os
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_caching import Cache
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from notion_service import get_projects, get_blogs, get_blog_post
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Security: Enable CORS with restricted origins
allowed_origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
CORS(app, resources={r"/api/*": {"origins": allowed_origins}})

# Configure caching
cache = Cache(app, config={'CACHE_TYPE': 'SimpleCache', 'CACHE_DEFAULT_TIMEOUT': 600})

# Rate Limiting
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
)

# Centralized Error Handler
@app.errorhandler(Exception)
def handle_exception(e):
    """Log the full error and return a generic message to the client."""
    # Log the full traceback server-side
    logger.exception("An unhandled exception occurred")
    
    # Generic error message for the client
    response = {
        "error": "Internal Server Error",
        "message": "An unexpected error occurred. Please try again later.",
        "code": "INTERNAL_SERVER_ERROR"
    }
    
    # Return 500 for unhandled exceptions
    return jsonify(response), 500

@app.errorhandler(404)
def resource_not_found(e):
    return jsonify({
        "error": "Not Found",
        "message": "The requested resource was not found.",
        "code": "NOT_FOUND"
    }), 404

@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({
        "error": "Too Many Requests",
        "message": "Rate limit exceeded. Please try again later.",
        "code": "RATE_LIMIT_EXCEEDED"
    }), 429

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/projects')
@cache.cached()
def projects():
    data = get_projects()
    return jsonify(data)

@app.route('/api/blogs')
@cache.cached()
def blogs():
    data = get_blogs()
    return jsonify(data)

@app.route('/api/blogs/<slug>')
@cache.cached()
def blog_post(slug):
    # Basic input validation for slug
    if not slug or not slug.isalnum() and '-' not in slug and '_' not in slug:
        return jsonify({
            "error": "Bad Request",
            "message": "Invalid slug format.",
            "code": "INVALID_INPUT"
        }), 400
        
    data = get_blog_post(slug)
    if not data:
        return jsonify({
            "error": "Not Found",
            "message": f"Blog post '{slug}' not found.",
            "code": "BLOG_NOT_FOUND"
        }), 404
        
    return jsonify(data)

if __name__ == '__main__':
    # Validate critical environment variables
    required_env = ["NOTION_API_KEY", "NOTION_PROJECTS_DATABASE_ID", "NOTION_BLOGS_DATABASE_ID"]
    missing = [env for env in required_env if not os.environ.get(env)]
    
    if missing:
        logger.error(f"Missing required environment variables: {', '.join(missing)}")
        # In a real production app, we might exit(1) here
    
    port = int(os.environ.get('PORT', 5000))
    # Security: Never run with debug=True in production
    debug_mode = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
