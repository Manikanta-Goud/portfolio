import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
import './index.css'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Check if Clerk is configured
const isClerkConfigured = PUBLISHABLE_KEY && PUBLISHABLE_KEY !== ''

// App component with conditional Clerk wrapper
const AppWithAuth = () => {
    if (!isClerkConfigured) {
        console.warn('⚠️ Clerk not configured - authentication features disabled')
        return <App />
    }
    
    return (
        <ClerkProvider 
            publishableKey={PUBLISHABLE_KEY}
            afterSignOutUrl="/"
        >
            <App />
        </ClerkProvider>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AppWithAuth />
    </React.StrictMode>,
)
