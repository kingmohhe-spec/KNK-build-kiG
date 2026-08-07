import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import AdminPage from './pages/AdminPage.tsx';
import './index.css';

const path = window.location.pathname;
const isAdmin = path === '/admin' || path === '/admin/' || path.startsWith('/admin?');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdmin ? <AdminPage /> : <App />}
  </StrictMode>
);
