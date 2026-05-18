import React from 'react'
import { createRoot } from 'react-dom/client'
import AdminApp from './admin/AdminApp.jsx'
import LandingPage from './LandingPage.jsx'
import { adminHashPath } from './lib/supabaseClient.js'
import './index.css'

function AppRouter() {
  const [hash, setHash] = React.useState(window.location.hash)

  React.useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (hash === `#/${adminHashPath}`) {
    return <AdminApp />
  }

  return <LandingPage />
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
)
