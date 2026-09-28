import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/marcellus';
import '@fontsource-variable/hanken-grotesk';
import './styles/global.css';
import './styles/pages.css';
import './styles/admin.css';
import App from './App';
import { StoreProvider } from './store/StoreContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <App />
      </StoreProvider>
    </BrowserRouter>
  </StrictMode>,
);
