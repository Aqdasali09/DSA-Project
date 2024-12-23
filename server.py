from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from search import HybridSearchEngine, lexicon
from inverted_index import InvertedIndex
from speech import speech_to_text

app = Flask(__name__)
CORS(app)  # Enable CORS

# Initialize inverted index and load barrels from CSV files
inverted_index = InvertedIndex()
inverted_index.load_from_barrels(r".\barrels")  # Load barrels from folder

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

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audio']
    file_path = 'audio4.mp3'
    audio_file.save(file_path)

    try:
        transcript = speech_to_text(file_path)
        os.remove(file_path)  # Delete the file after transcription

        # Perform hybrid search using the transcription as the query
        final_results, ranked_results = hybrid_engine.search(transcript.lower())

        return jsonify({
            "transcription": transcript,
            "query": transcript,
            "final_results": list(final_results),
            "ranked_results": ranked_results
        })
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)  # Ensure the file is deleted in case of an error
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)