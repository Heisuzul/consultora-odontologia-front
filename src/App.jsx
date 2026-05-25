import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Dentists from './pages/Dentists'
import Services from './pages/Services'

function Home() {
  return <h1>Inicio</h1>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/dentists"
          element={<Dentists />}
        />

        <Route
          path="/services"
          element={<Services />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App