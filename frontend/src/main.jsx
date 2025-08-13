import React from 'react' // ✅ Proper import for JSX to work
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './store/store.js';
import App from './App.jsx'
import './index.css'

const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
