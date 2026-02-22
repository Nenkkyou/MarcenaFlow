import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ThemeProvider } from './context/ThemeContext'
import LandingPage from './landing/LandingPage'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import Requests from './pages/Requests'
import NewRequest from './pages/NewRequest'
import Projects from './pages/Projects'
import Teams from './pages/Teams'
import Almoxarifado from './pages/Almoxarifado'
import Historico from './pages/Historico'

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing page */}
            <Route path="/" element={<LandingPage />} />

            {/* App routes */}
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="solicitacoes" element={<Requests />} />
              <Route path="nova-solicitacao" element={<NewRequest />} />
              <Route path="obras" element={<Projects />} />
              <Route path="equipes" element={<Teams />} />
              <Route path="almoxarifado" element={<Almoxarifado />} />
              <Route path="historico" element={<Historico />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  )
}
