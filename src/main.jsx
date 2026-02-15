import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
import './index.css'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Only use Clerk if we have a valid key
const isClerkConfigured = PUBLISHABLE_KEY && PUBLISHABLE_KEY !== 'your_publishable_key_here'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {isClerkConfigured ? (
            <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
                <App />
            </ClerkProvider>
        ) : (
            <App />
        )}
    </React.StrictMode>,
)
