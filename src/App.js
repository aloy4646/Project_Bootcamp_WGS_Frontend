import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material'
import { checkLogin, reset } from './features/AuthSlice'

import Navigation from './components/Navigation'
import TopNavbar from './components/TopNavbar'
import Home from './pages/Home'
import ListKaryawan from './pages/ListKaryawan'
import ListUpdateRequest from './pages/ListUpdateRequest'
import DetailKaryawan from './pages/DetailKaryawan'
import Login from './pages/Login'
import DetailUpdateRequest from './pages/DetailUpdateRequest'
import FormUserData from './pages/FormUserData'
import FormUserDokumen from './pages/FormUserDokumen'
import ListLogs from './pages/ListLogs'
import ListHistories from './pages/ListHistories'
import DetailHistory from './pages/DetailHistory'
import ListSertifikat from './pages/ListSertifikat'
import DetailSertifikat from './pages/DetailSertifikat'
import FormSertifikat from './pages/FormSertifikat'
import AddKaryawan from './pages/AddKaryawan'
import UpdatePassword from './pages/UpdatePassword'

const theme = createTheme()

function App() {
  const dispatch = useDispatch()
  const { user, isError } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(checkLogin())
  }, [dispatch])

  useEffect(() => {
    if (isError) {
      dispatch(reset())
    }
  }, [isError, dispatch])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <TopNavbar />
        <Box sx={{ display: 'flex', mt: 8 }}>
          
          {user && <Navigation />}
          <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
          >
            <Routes>
              <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />
              <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
              <Route path="/karyawan/list" element={user && user.role !== "USER" ? <ListKaryawan /> : <Navigate to="/" />} />
              <Route path="/karyawan/update-request" element={user && user.role === "ADMIN" ? <ListUpdateRequest /> : <Navigate to="/" />} />
              <Route path="/karyawan/update-request/:update_requestId" element={user && user.role === "ADMIN" ? <DetailUpdateRequest /> : <Navigate to="/" />} />
              <Route path="/karyawan/update/form/data/:id" element={user ? <FormUserData /> : <Navigate to="/" />} />
              <Route path="/karyawan/update/form/dokumen/:id" element={user ? <FormUserDokumen /> : <Navigate to="/" />} />
              <Route path="/karyawan/logs/:id" element={user ? <ListLogs /> : <Navigate to="/" />} />
              <Route path="/karyawan/histories/:id" element={user ? <ListHistories /> : <Navigate to="/" />} />
              <Route path="/karyawan/histories/:id/:index" element={user ? <DetailHistory /> : <Navigate to="/" />} />
              <Route path="/karyawan/sertifikat/:id" element={user ? <ListSertifikat /> : <Navigate to="/" />} />
              <Route path="/karyawan/sertifikat/:id/:sertifikatId" element={user ? <DetailSertifikat /> : <Navigate to="/" />} />
              <Route path="/karyawan/sertifikat/:id/form" element={user ? <FormSertifikat /> : <Navigate to="/" />} />
              <Route path="/karyawan/:id" element={user ? <DetailKaryawan /> : <Navigate to="/" />} />
              <Route path="/karyawan/add" element={user && user.role === "ADMIN" ? <AddKaryawan /> : <Navigate to="/" />} />
              <Route path="/karyawan/update/password/:id" element={user ? <UpdatePassword /> : <Navigate to="/" />} />
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  )
}

export default App
