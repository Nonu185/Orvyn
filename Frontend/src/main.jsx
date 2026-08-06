import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/index.css'
import App from './app/App.jsx'
import { AuthProvider } from './features/auth/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <App />
    </AuthProvider>

)
