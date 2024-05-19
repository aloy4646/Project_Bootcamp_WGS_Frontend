import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { List, ListItem, ListItemText, Toolbar, Box, Drawer, Button } from '@mui/material'
import { useDispatch } from 'react-redux'
import { logOut, reset } from '../features/AuthSlice'

const drawerWidth = 240

function Navigation() {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
  
    const linkItems = [
      { to: '/', text: 'Login' },
      { to: '/home', text: 'Home Page' },
      { to: '/karyawan/list', text: 'List Karyawan' },
      { to: '/karyawan/update-request', text: 'List Update Request' },
    ]

    const handleLogout = () => {
        dispatch(logOut())
        dispatch(reset())
        navigate('/')
    }
  
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
          <Box sx={{ padding: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Drawer>
    )
  }

export default Navigation