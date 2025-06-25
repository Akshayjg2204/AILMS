import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from "react-router-dom"
import { getConfig } from './utils/auth-config'

const config = getConfig();

createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain={config.domain}
    clientId={config.clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
      ...(config.audience ? { audience: config.audience } : {})
    }}
    cacheLocation="localstorage"
    useRefreshTokens={true}
  >
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </Auth0Provider>
)
