import React from 'react'
import { AppBar, Toolbar, Box } from '@mui/material'
import { Link } from 'react-router-dom'
import logo from '../logo_wgs.svg' // Path to your logo file

function TopNavbar() {
    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
              <img src={logo} alt="Company Logo" style={{ height: 40, marginRight: 16 }} />
            </Box>
          </Toolbar>
        </AppBar>
      )
}

export default TopNavbar