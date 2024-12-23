import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Splash() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((error) => {
        console.error("Error attempting to play", error);
      });
      video.onended = () => {
        navigate('/main');
      };
    }
  }, [navigate]);

  return (
    <div className="fixed inset-0 overflow-hidden flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/assets/splash.mp4"
        type="video/mp4"
        muted
        autoPlay
        playsInline
      />
    </div>
  );
}

export default Splash;