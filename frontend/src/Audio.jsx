import { useState } from 'react';
import ModelViewer from './ModelViewer';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function AudioSearch() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

        setIsLoading(true);
        const response = await fetch('http://localhost:5000/transcribe', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        setIsLoading(false);
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
    <div className="min-h-screen flex flex-col items-center bg-black p-4">
      <h1 className="text-4xl font-bold mb-6 text-white mt-4">Audio Search</h1>
      {!results && (
        <div className="flex flex-col items-center justify-center flex-grow w-full h-[50vh]">
          <div className="w-full h-full">
            <ModelViewer />
          </div>
          <div className='flex flex-row items-center justify-between gap-x-[4vh]'>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-4 rounded-lg mt-8 ${
                isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              } text-white transition-colors mb-4`}
              disabled={isLoading}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            <button
              onClick={() => window.history.back()}
              className={`bg-blue-600 hover:bg-blue-700 p-4 rounded-lg mt-8 text-white transition-colors mb-4`}
            >
              Go Back
            </button>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="flex items-center justify-center mt-4">
          <DotLottieReact
            src="/assets/load.lottie"
            loop
            autoplay
            className="w-24 h-24"
          />
          <p className="ml-4 text-lg text-gray-300">Processing...</p>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {transcription && (
        <div className="mt-6 w-full max-w-2xl bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-blue-500">You Searched:</h2>
          <pre className="mt-2 text-gray-300 whitespace-pre-wrap">{transcription}</pre>
        </div>
      )}
      {results && (
        <div className="w-full max-w-4xl mt-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-500">Results for "{results.query}":</h2>
          
          <h3 className="text-lg font-semibold text-blue-400">Final Results:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.final_results.map((result, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg text-gray-300">
                {result}
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-blue-400 mt-4">Ranked Results:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.ranked_results.map(([doc_id, score], index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg text-gray-300">
                <p>Document ID: {doc_id}</p>
                <p>Score: {score}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <footer className="text-xs text-gray-500 mt-8">
        This 3d model based on <a href="https://sketchfab.com/3d-models/a-windy-day-fb78f4cc938144e6902dd5cff354d525" className="underline">"A Windy Day"</a> by <a href="https://sketchfab.com/norgeotloic" className="underline">Loïc Norgeot</a> licensed under <a href="http://creativecommons.org/licenses/by/4.0/" className="underline">CC-BY-4.0</a>
      </footer>
    </div>
  );
}

export default AudioSearch;