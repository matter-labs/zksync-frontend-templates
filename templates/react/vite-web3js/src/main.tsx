import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import './styles/globals.css';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
