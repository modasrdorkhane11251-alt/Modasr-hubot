import React from 'react';
import { createRoot } from 'react-dom/client';
import { MafiaWebApp } from './MafiaWebApp';
import '../index.css';

const container = document.getElementById('mafia-root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <MafiaWebApp />
    </React.StrictMode>
  );
}
