import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  // Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  // ListItemIcon,
  // Divider,
  Box,
} from '@mui/material'
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

const theme = createTheme()

const drawerWidth = 240

function Navigation() {
  const location = useLocation();

  const linkItems = [
    { to: '/', text: 'Home Page' },
    { to: '/karyawan/list', text: 'List Karyawan' },
    { to: '/karyawan/update-request', text: 'List Update Request' },
    // { to: '/sertifikat/form', text: 'Add a Certificate' },
    { to: '/login', text: 'Login' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {linkItems.map((item, index) => (
            <ListItem
              key={index}
              button
              component={Link}
              to={item.to}
              sx={{
                backgroundColor:
                  location.pathname === item.to
                    ? 'rgba(0, 0, 0, 0.08)'
                    : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
          >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
            <Navigation />
            </Box>
          </Drawer>
          <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
          >
            <AppBar
              position="fixed"
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
              <Toolbar>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ flexGrow: 1 }}
                >
                  Company Name
                </Typography>
              </Toolbar>
            </AppBar>
            <Toolbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/karyawan/list" element={<ListKaryawan />} />
              <Route
                path="/karyawan/update-request"
                element={<ListUpdateRequest />}
              />
              <Route
                path="/karyawan/update-request/:update_requestId"
                element={<DetailUpdateRequest />}
              />
              <Route
                path="/karyawan/update/form/data/:id"
                element={<FormUserData />}
              />
              <Route
                path="/karyawan/update/form/dokumen/:id"
                element={<FormUserDokumen />}
              />
              <Route path="/karyawan/logs/:id" element={<ListLogs />} />
              <Route
                path="/karyawan/histories/:id"
                element={<ListHistories />}
              />
              <Route
                path="/karyawan/histories/:id/:index"
                element={<DetailHistory />}
              />
              <Route
                path="/karyawan/sertifikat/:id"
                element={<ListSertifikat />}
              />
               <Route
                path="/karyawan/sertifikat/:id/:sertifikatId"
                element={<DetailSertifikat />}
              />
              <Route path="/karyawan/sertifikat/:id/form" element={<FormSertifikat />} />
              <Route path="/karyawan/:id" element={<DetailKaryawan />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  )
}

export default App
