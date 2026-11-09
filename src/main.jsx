import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/anton/latin-400.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import 'antd/dist/antd.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/app.css';
import App from './app/App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
