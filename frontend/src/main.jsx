import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthPorvider } from './context/authcontext'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthPorvider>
      <App/>
    </AuthPorvider>
  </BrowserRouter>
  
)
