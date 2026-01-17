
import React, { useEffect, useState, useRef } from 'react';
import { MenuItem } from '../types';
import { X, Camera, RefreshCcw, Info } from 'lucide-react';

interface ARViewerProps {
  itemId: string;
  items: MenuItem[];
  onExit: () => void;
}

/**
 * Note on MindAR Integration in React:
 * MindAR attaches to the body and creates a separate rendering context.
 * We must use standard HTML strings or direct DOM injection for <a-scene>
 * to ensure MindAR's internal logic finds the elements correctly.
 */
export const ARViewer: React.FC<ARViewerProps> = ({ itemId, items, onExit }) => {
  const item = items.find(i => i.id === itemId);
  const [status, setStatus] = useState<'LOADING' | 'READY' | 'ERROR'>('LOADING');
  const [showInstructions, setShowInstructions] = useState(true);
  const arRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!item) {
      setStatus('ERROR');
      return;
    }

    // MindAR requires a specific A-Frame setup.
    // Since we are in a SPA, we manually inject the scene to the body/container
    // to avoid React lifecycle conflicts with A-Frame's custom elements.
    const sceneContainer = document.createElement('div');
    sceneContainer.id = 'ar-scene-container';
    sceneContainer.innerHTML = `
      <a-scene 
        mindar-image="imageTargetSrc: https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.mind;" 
        color-space="sRGB" 
        renderer="colorManagement: true, physicallyCorrectLights" 
        vr-mode-ui="enabled: false" 
        device-orientation-permission-ui="enabled: false"
        embedded
      >
        <a-assets>
           <video id="arVideo" src="${item.arVideoUrl}" loop="true" crossOrigin="anonymous" playsinline></video>
        </a-assets>

        <a-camera position="0 0 0" look-controls="enabled: false" cursor="fuse: false; rayOrigin: mouse;" raycaster="far: ${Infinity}; objects: .clickable"></a-camera>

        <a-entity mindar-image-target="targetIndex: 0">
          <a-video 
            src="#arVideo" 
            position="0 0 0" 
            height="0.552" 
            width="1" 
            rotation="0 0 0"
            class="clickable"
          ></a-video>
        </a-entity>
      </a-scene>
    `;

    document.body.appendChild(sceneContainer);
    
    // Listen for AR ready
    const scene = sceneContainer.querySelector('a-scene');
    const onReady = () => setStatus('READY');
    scene?.addEventListener('renderstart', onReady);

    // Auto-play video logic when target found
    const target = sceneContainer.querySelector('[mindar-image-target]');
    const video = sceneContainer.querySelector('#arVideo') as HTMLVideoElement;
    
    target?.addEventListener('targetFound', () => {
      video.play().catch(e => console.log("Auto-play blocked", e));
    });
    
    target?.addEventListener('targetLost', () => {
      video.pause();
    });

    return () => {
      // Cleanup
      scene?.removeEventListener('renderstart', onReady);
      document.body.removeChild(sceneContainer);
      // MindAR leaves some styles on the body
      document.body.style.overflow = 'auto';
      const videos = document.querySelectorAll('video');
      videos.forEach(v => { if (v.parentElement === document.body) v.remove(); });
    };
  }, [item]);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
        <button onClick={onExit} className="bg-orange-600 px-6 py-2 rounded-xl">Back to Menu</button>
      </div>
    );
  }

  return (
    <>
      {/* UI Overlay */}
      <div className="ui-layer fixed inset-0 flex flex-col pointer-events-none">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center p-6 pointer-events-auto">
          <button 
            onClick={onExit}
            className="bg-black/50 backdrop-blur-md p-3 rounded-full text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold flex items-center gap-2">
            <Camera className="w-4 h-4 text-orange-400" />
            SavoryAR View
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-black/50 backdrop-blur-md p-3 rounded-full text-white"
          >
            <RefreshCcw className="w-6 h-6" />
          </button>
        </div>

        {/* Loading / Scanning Indicator */}
        <div className="flex-1 flex flex-col items-center justify-center">
           {status === 'LOADING' && (
             <div className="bg-black/80 p-8 rounded-3xl flex flex-col items-center gap-4 text-white">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold">Opening Lens...</p>
             </div>
           )}

           {status === 'READY' && (
             <div className="relative w-64 h-64 border-2 border-white/30 rounded-3xl">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-orange-500 -mt-1 -ml-1 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-orange-500 -mt-1 -mr-1 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-orange-500 -mb-1 -ml-1 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-orange-500 -mb-1 -mr-1 rounded-br-lg"></div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                   <p className="text-white text-sm font-medium drop-shadow-md">Point camera at the {item.name}</p>
                </div>
             </div>
           )}
        </div>

        {/* Bottom Info Sheet */}
        <div className="p-6 pointer-events-auto">
          <div className="bg-white rounded-3xl p-6 shadow-2xl flex items-center justify-between gap-4">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0">
                  <img src={item.targetImageUrl} className="w-full h-full object-cover" />
                </div>
                <div>
                   <h2 className="text-xl font-bold text-slate-900 leading-tight">{item.name}</h2>
                   <p className="text-slate-500 text-sm line-clamp-1">{item.description}</p>
                </div>
             </div>
             <button 
              onClick={() => setShowInstructions(true)}
              className="p-3 bg-slate-100 rounded-2xl text-slate-600"
             >
                <Info className="w-6 h-6" />
             </button>
          </div>
        </div>

        {/* Help Modal */}
        {showInstructions && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-8 pointer-events-auto z-[10000]">
             <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Camera className="w-10 h-10 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">How it works</h3>
                <ul className="text-left space-y-4 mb-8 text-slate-600">
                   <li className="flex gap-3">
                      <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-bold">1</span>
                      <span>Allow camera permissions if prompted.</span>
                   </li>
                   <li className="flex gap-3">
                      <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-bold">2</span>
                      <span>Find the <strong>{item.name}</strong> on the physical menu.</span>
                   </li>
                   <li className="flex gap-3">
                      <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-bold">3</span>
                      <span>Steady your phone. The AR content will appear over the image.</span>
                   </li>
                </ul>
                <button 
                  onClick={() => setShowInstructions(false)}
                  className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg"
                >
                  Start Scanning
                </button>
             </div>
          </div>
        )}
      </div>
    </>
  );
};
