import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Intro from './components/Intro.jsx'
import CursorTrail from './components/CursorTrail.jsx'
import Home from './pages/Home.jsx'
import Studio from './pages/Studio.jsx'
import Process from './pages/Process.jsx'
import Estimate from './pages/Estimate.jsx'
import Enquiry from './pages/Enquiry.jsx'
import Book from './pages/Book.jsx'
import MyAppointment from './pages/MyAppointment.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import RequireAdmin from './components/RequireAdmin.jsx'
import Projects from './pages/Projects.jsx'
import Project from './pages/Project.jsx'
import { startSmoothScroll, scrollToTop } from './lib/scroll.js'
import './styles/text.css'

export default function App() {
  const { pathname } = useLocation()
  const [intro, setIntro] = useState(() => (pathname === '/' ? 'open' : 'gone'))

  useEffect(() => startSmoothScroll(), [])
  useEffect(() => { scrollToTop() }, [pathname])

  if (pathname.startsWith('/admin')) {
    return (
      <>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
        </Routes>
        <CursorTrail />
      </>
    )
  }

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home ready={intro !== 'open'} />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/process" element={<Process />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<Project />} />
          <Route path="/estimate" element={<Estimate />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/book" element={<Book />} />
          <Route path="/my-appointment" element={<MyAppointment />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      {intro !== 'gone' && (
        <Intro
          leaving={intro === 'leaving'}
          onLeave={() => setIntro('leaving')}
          onDone={() => setIntro('gone')}
        />
      )}
      <CursorTrail />
    </>
  )
}
