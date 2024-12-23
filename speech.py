import requests
import time

# Replace with your AssemblyAI API key
API_KEY = "2ec767b224244a4aa2b1fd6c4c93f963"

# Upload audio file to AssemblyAI
def upload_audio(file_path):
    headers = {'authorization': API_KEY}
    with open(file_path, 'rb') as audio_file:
        response = requests.post(
            'https://api.assemblyai.com/v2/upload',
            headers=headers,
            data=audio_file
        )
    if response.status_code == 200:
        return response.json()['upload_url']
    else:
        raise Exception("Error uploading file: " + response.text)

# Request transcription
def request_transcription(audio_url):
    headers = {'authorization': API_KEY}
    json_data = {'audio_url': audio_url}
    response = requests.post(
        'https://api.assemblyai.com/v2/transcript',
        headers=headers,
        json=json_data
    )
    if response.status_code == 200:
        return response.json()['id']
    else:
        raise Exception("Error requesting transcription: " + response.text)

# Poll transcription status
def get_transcription(transcription_id):
    headers = {'authorization': API_KEY}
    url = f'https://api.assemblyai.com/v2/transcript/{transcription_id}'
    while True:
        response = requests.get(url, headers=headers)
        result = response.json()
        if result['status'] == 'completed':
            return result['text']
        elif result['status'] == 'failed':
            raise Exception("Transcription failed: " + result['error'])
        time.sleep(5)  # Wait for 5 seconds before polling again

# Main Function
def speech_to_text(file_path):
    print("Uploading audio...")
    audio_url = upload_audio(file_path)
    print("Audio uploaded. Requesting transcription...")
    transcription_id = request_transcription(audio_url)
    print("Transcription in progress...")
    text = get_transcription(transcription_id)
    print("Transcription completed!")
    return text

# Test the Function
# if __name__ == "__main__":
#     audio_file_path = "audio3.mp3"  # Replace with your audio file path
#     try:
#         transcript = speech_to_text(audio_file_path)
#         print("Transcript:", transcript)
#     except Exception as e:
#         print("Error:", e)
