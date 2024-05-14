import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Button } from '@mui/material';
import Home from './pages/Home';
import AddCertificate from './pages/AddCertificate';
import DetailKaryawan from './pages/DetailKaryawan';
import Login from './pages/Login';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Company Name
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Home Page
            </Button>
            <Button color="inherit" component={Link} to="/sertifikat/form">
              Add a Certificate
            </Button>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sertifikat/form" element={<AddCertificate />} />
          <Route path="/karyawan/:id" element={<DetailKaryawan />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
