import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// The course uses the real app's styles, so every lesson looks like the final app
import '../../../../webapp/src/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
