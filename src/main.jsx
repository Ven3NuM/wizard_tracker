import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/app.css'

// React 18+ uses createRoot instead of render
// This enables Concurrent Features like automatic batching
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
