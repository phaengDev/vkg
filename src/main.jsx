import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
// import './index.css'
import "rsuite/dist/rsuite.css";
import 'react-notifications/lib/notifications.css';
import { BrowserRouter} from "react-router-dom";
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StrictMode>
    <App />
  </StrictMode>,
  </BrowserRouter>
)
