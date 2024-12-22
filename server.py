from flask import Flask, request, jsonify
from flask_cors import CORS
from search import HybridSearchEngine, inverted_index, lexicon

app = Flask(__name__)
CORS(app)  # Enable CORS

# Initialize hybrid search engine
hybrid_engine = HybridSearchEngine(inverted_index, lexicon)

@app.route('/search')
def search():
    query = request.args.get('query', '')
    if not query:
        return jsonify({"error": "No query provided"}), 400

    # Perform hybrid search
    final_results, ranked_results = hybrid_engine.search(query.lower())

    # Return results as JSON
    return jsonify({
        "query": query,
        "final_results": list(final_results),
        "ranked_results": ranked_results
    })

if __name__ == '__main__':
    app.run(debug=True)