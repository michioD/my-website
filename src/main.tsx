import {StrictMode} from 'react';
// The installed react-dom package does not include declarations for this entrypoint.
// @ts-expect-error react-dom/client is available at runtime but lacks type declarations.
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
