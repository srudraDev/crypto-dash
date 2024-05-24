import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Details from './routes/Details.jsx';
import NotFound from './routes/NotFound.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/crypto-dash">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path='/details/:id' element={<Details />} />
        <Route path="*" element={ <NotFound /> }/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
