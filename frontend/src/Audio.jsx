import { useState } from 'react';

function AudioSearch() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      setMediaRecorder(recorder);

      const audioChunks = [];
      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'audio.webm');

        const response = await fetch('http://localhost:5000/transcribe', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          setTranscription(data.transcription);
          setResults(data);
          setError(null);
        } else {
          console.error('Error transcribing audio:', data.error);
          setError(data.error);
          setResults(null);
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Audio Search</h1>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`p-4 rounded ${
          isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        } text-white transition-colors`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {transcription && (
        <div className="mt-6 w-full max-w-2xl bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Transcription:</h2>
          <pre className="mt-2 text-gray-800 whitespace-pre-wrap">{transcription}</pre>
        </div>
      )}
      {results && (
        <div className="w-full max-w-4xl mt-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Results for "{results.query}":</h2>
          
          <h3 className="text-lg font-semibold text-gray-800">Final Results:</h3>
          <ul className="list-disc pl-5">
            {results.final_results.map((result, index) => (
              <li key={index} className="text-gray-700">{result}</li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">Ranked Results:</h3>
          <ul className="list-disc pl-5">
            {results.ranked_results.map(([doc_id, score], index) => (
              <li key={index} className="text-gray-700">
                Document ID: {doc_id}, Score: {score}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AudioSearch;