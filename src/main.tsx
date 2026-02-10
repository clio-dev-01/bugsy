import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import CollageOverlay from './components/CollageOverlay.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <CollageOverlay onProposalReady={() => { }} onHidden={() => { }} /> */}
  </StrictMode>,
)
