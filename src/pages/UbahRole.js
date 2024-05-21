import React, { useState, useEffect } from 'react'
import {
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Container,
  Divider,
} from '@mui/material'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

function UbahRole() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [oldRole, setOldRole] = useState('')
  const [newRole, setNewRole] = useState('')
  const [open, setOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const handleRoleChange = (e, roleClicked) => {
    e.preventDefault()
    if (roleClicked !== null) {
      setNewRole(roleClicked)
    }
  }

  const handleYakin = (yakin) => {
    if (newRole === oldRole) {
      alert('Tidak ada perubahan')
      return
    }

    setOpen(true)
  }

  const handleKonfirmasi = (confirmed) => {
    setOpen(false)
    if (confirmed) {
      const body = {
        role: newRole,
      }

      axios
        .put(`http://localhost:3001/superadmin/role/${id}`, body)
        .then(() => {
          setConfirmed(true)
        })
    }
  }

  useEffect(() => {
    axios
      .get(`http://localhost:3001/superadmin/role/${id}`)
      .then((response) => {
        setOldRole(response.data.data.role)
        setNewRole(response.data.data.role)
      })
  }, [id])

  return (
    <Container>
      <Button
        variant="contained"
        color="inherit"
        onClick={() => navigate(-1)}
        sx={{ marginRight: 1, marginTop: -1 }}
      >
        Kembali
      </Button>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 2, maxWidth: 300 }}>
          {confirmed ? (
            <Container>
              <Divider sx={{ my: 1 }} />
              <Box
                sx={{
                  p: 3,
                  backgroundColor: 'lightgreen',
                  borderRadius: 2,
                  textAlign: 'left',
                }}
              >
                <Typography variant="h6">Perubahan role berhasil. </Typography>
                <Divider sx={{ my: 0.2 }} />
                <Typography variant="h7">
                  Role baru:{' '}
                  <span style={{ backgroundColor: '#ffffe0' }}>{newRole}</span>
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
            </Container>
          ) : (
            <>
              <Typography variant="h6" component="div" gutterBottom>
                Ubah Role
              </Typography>
              <ToggleButtonGroup
                value={newRole}
                exclusive
                onChange={handleRoleChange}
                aria-label="role selection"
                sx={{ marginBottom: 2 }}
              >
                <ToggleButton
                  value="USER"
                  aria-label="user"
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'lightblue',
                      color: 'black',
                      '&:hover': {
                        backgroundColor: 'lightblue',
                      },
                    },
                  }}
                >
                  USER
                </ToggleButton>
                <ToggleButton
                  value="ADMIN"
                  aria-label="admin"
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'lightblue',
                      color: 'black',
                      '&:hover': {
                        backgroundColor: 'lightblue',
                      },
                    },
                  }}
                >
                  ADMIN
                </ToggleButton>
                <ToggleButton
                  value="AUDITOR"
                  aria-label="auditor"
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'lightblue',
                      color: 'black',
                      '&:hover': {
                        backgroundColor: 'lightblue',
                      },
                    },
                  }}
                >
                  AUDITOR
                </ToggleButton>
              </ToggleButtonGroup>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleYakin}
              >
                Pilih
              </Button>
            </>
          )}

          <Dialog open={open} onClose={() => handleKonfirmasi(false)}>
            <DialogTitle>Konfirmasi perubahan role</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Apakah anda yakin ingin mengubah role menjadi {newRole}?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleKonfirmasi(false)} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => handleKonfirmasi(true)}
                color="primary"
                autoFocus
              >
                Konfirmasi
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </Container>
  )
}

export default UbahRole
