from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from speech import speech_to_text

app = Flask(__name__)
CORS(app)  # Enable CORS

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
        return jsonify({"transcription": transcript})
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)  # Ensure the file is deleted in case of an error
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)