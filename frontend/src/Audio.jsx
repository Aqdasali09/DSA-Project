import { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Navbar from './components/navbar'; // Import the Navbar component

function AudioSearch() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.54/build/spline-viewer.js';
    script.type = 'module';
    document.body.appendChild(script);
  }, []);

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
    <div className="min-h-screen flex flex-col justify-center items-center bg-black p-4 relative">
      <Navbar /> {/* Include the Navbar component */}
      <h1 className="text-4xl font-semibold mb-6 text-white mt-4" style={{ fontFamily: 'Zen Antique Soft, serif' }}>Audio Search</h1>
      {!results && (
        <div className="flex flex-col items-center justify-center flex-grow w-full h-[50vh]">
          <div className="w-[50vw] h-[65vh] relative">
            <spline-viewer loading-anim-type="spinner-small-light" interaction-prompt="none" url="https://prod.spline.design/ZVPXbznt8G-AWbk9/scene.splinecode" className="absolute inset-0 w-full h-full"></spline-viewer>
            <div className="absolute inset-0 w-full h-full transform scale-75"></div>
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
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
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
                <h4 className="text-xl font-bold text-white mb-2">{result.name}</h4>
                <p className="text-sm text-gray-400">Artists: {result.artists}</p>
                <p className="text-sm text-gray-400">Album: {result.album_name}</p>
                {details.spotify_id && (
                  <div className="mt-4">
                    <iframe
                      src={`https://open.spotify.com/embed/track/${details.spotify_id.replace(/['"]+/g, '').trim()}`}
                      width="100%"
                      height="380"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      className="rounded-md"
                    ></iframe>
                  </div>
                )}\
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-blue-400 mt-4">Ranked Results:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.ranked_results.map(([details], index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg text-gray-300">
                <h4 className="text-xl font-bold text-white mb-2">{details.name}</h4>
                <p className="text-sm text-gray-400">Artists: {details.artists}</p>
                <p className="text-sm text-gray-400">Album: {details.album_name}</p>
                {details.spotify_id && (
                  <div className="mt-4">
                    <iframe
                      src={`https://open.spotify.com/embed/track/${details.spotify_id.replace(/['"]+/g, '').trim()}`}
                      width="100%"
                      height="380"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      className="rounded-md"
                    ></iframe>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AudioSearch;