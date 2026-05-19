import React from 'react'
import { createRoot } from 'react-dom/client'
import AdminApp from './admin/AdminApp.jsx'
import AnalyticsConsent from './components/AnalyticsConsent.jsx'
import LandingPage from './LandingPage.jsx'
import { initAnalytics, trackPageView } from './lib/analytics/ga4.js'
import { adminHashPath } from './lib/supabaseClient.js'
import './index.css'

function AppRouter() {
  const [hash, setHash] = React.useState(window.location.hash)

  React.useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  React.useEffect(() => {
    initAnalytics()
    trackPageView(`${window.location.pathname}${window.location.search}${window.location.hash}`, document.title)
  }, [hash])

  const app = hash === `#/${adminHashPath}` ? <AdminApp /> : <LandingPage />

  return (
    <>
      {app}
      <AnalyticsConsent />
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
)
