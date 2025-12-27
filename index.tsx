import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThreeElements } from '@react-three/fiber';

// Extend the global JSX namespace to include R3F elements
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

console.log('[INIT] Starting app initialization...');

const rootElement = document.getElementById('root');
console.log('[DOM] Root element found:', rootElement ? 'YES' : 'NO');

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

console.log('[REACT] Creating React root...');
const root = ReactDOM.createRoot(rootElement);

console.log('[REACT] Rendering App...');
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('[REACT] App rendered to DOM');