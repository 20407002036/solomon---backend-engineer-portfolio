from flask import Flask, jsonify
from flask_cors import CORS
from flask_caching import Cache
from notion_service import get_projects, get_blogs, get_blog_post

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Configure caching
cache = Cache(app, config={'CACHE_TYPE': 'SimpleCache', 'CACHE_DEFAULT_TIMEOUT': 600})

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/projects')
@cache.cached()
def projects():
    try:
        data = get_projects()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/blogs')
@cache.cached()
def blogs():
    try:
        data = get_blogs()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/blogs/<slug>')
@cache.cached()
def blog_post(slug):
    try:
        data = get_blog_post(slug)
        if not data:
            return jsonify({"error": "Blog post not found"}), 404
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
