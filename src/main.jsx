import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
import './index.css'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || ''

// Always provide ClerkProvider with fallback to prevent useUser errors
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ClerkProvider 
            publishableKey={PUBLISHABLE_KEY}
            afterSignOutUrl="/"
        >
            <App />
        </ClerkProvider>
    </React.StrictMode>,
)
