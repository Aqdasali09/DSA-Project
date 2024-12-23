import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { gsap } from 'gsap';

function Model() {
  const { scene } = useGLTF('/assets/scene.gltf'); // Path to the GLTF file in the public directory
  const modelRef = useRef();

  useEffect(() => {
    if (modelRef.current) {
      gsap.to(modelRef.current.rotation, {
        y: "+=6.28319", 
        duration: 7,
        repeat: -1,
        ease: "linear",
      });
    }
  }, []);

  return <primitive ref={modelRef} object={scene} scale={[2.5, 2.5, 2.5]} />; // Adjust the scale as needed
}

function ModelViewer() {
  return (
    <Canvas className="w-full h-full" antialias>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </Canvas>
  );
}

export default ModelViewer;