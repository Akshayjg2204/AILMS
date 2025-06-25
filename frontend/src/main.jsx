import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { Auth0Provider } from '@auth0/auth0-react'
import { getConfig } from './utils/auth-config'

const config = getConfig();

const providerConfig = {
  domain: config.domain,
  clientId: config.clientId,
  authorizationParams: {
    redirect_uri: "https://ailms1.netlify.app",
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider {...providerConfig}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>,
)
