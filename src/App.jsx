import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Dentists from './pages/Dentists'

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
      </Routes>
    </BrowserRouter>
  )
}

export default App