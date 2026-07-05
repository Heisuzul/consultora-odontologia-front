import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dentists from './pages/Dentists'
import Services from './pages/Services'

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dentists" element={<Dentists />} />
          <Route path="/services" element={<Services />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App