import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import AdminPage from './pages/AdminPage.tsx';
import './index.css';

const hash = window.location.hash.replace(/^#\/?/, '');
const isAdmin = hash === 'admin' || hash === 'admin/';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdmin ? <AdminPage /> : <App />}
  </StrictMode>
);
