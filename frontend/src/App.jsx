import React from 'react'
import { Route } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import Landingpages from './pages/shared/landingpages.jsx'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Landingpages />} />
      </Routes>
    </div>
  )
}

export default App
