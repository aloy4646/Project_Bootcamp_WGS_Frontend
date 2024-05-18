import React, { useState } from 'react'
import {
  Box,
  Card,
  Stack,
  Button,
  Divider,
  TextField,
  Typography,
  Container,
} from '@mui/material'

import { useTheme } from '@mui/material/styles'
import validator from 'validator'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function AddKaryawan() {
  const theme = useTheme()
  const [error, setError] = useState(null)
  const [email_kantor, setEmailKantor] = useState('')
  const [akunBaru, setAkunBaru] = useState({})

  const navigate = useNavigate()

  const handleSubmit = () => {
    setError(null)

    if (!email_kantor) {
      setError('Field ini wajib diisi')
      return
    }

    // Validasi email
    if (email_kantor && !validator.isEmail(email_kantor)) {
      setError('Format email salah')
      return
    }

    const body = {
      email_kantor,
      idAdmin: 6,
    }

    axios
      .post(`http://localhost:3001/users`, body)
      .then((response) => {
        setAkunBaru({
            email_kantor : response.data.data.email_kantor,
            password : response.data.data.password,
        })
      })
      .catch((error) => {
        alert('Terjadi error, permintaan update gagal')
        console.log(error)
      })
  }

  const handleChange = (e) => {
    setEmailKantor(e.target.value)
    setError(null)
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        mt: -15,
      }}
    >
      <Card
        sx={{
          p: 5,
          width: '100%',
          maxWidth: 420,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Tambah Karyawan
        </Typography>
        <Divider sx={{ my: 2 }} />
        {akunBaru.email_kantor && akunBaru.password ? (
          <Container>
            <Box
              sx={{
                p: 3,
                backgroundColor: 'lightgreen',
                borderRadius: 2,
                textAlign: 'left',
              }}
            >
              <Typography variant="h6">Pembuatan akun baru berhasil. </Typography>
              <Divider sx={{ my: 0.2 }} />
              <Typography variant="h7">Email kantor: <span style={{ backgroundColor: '#ffffe0' }}>{akunBaru.email_kantor}</span></Typography>
              <Divider sx={{ my: 0.2 }} />
              <Typography variant="h7">Password: <span style={{ backgroundColor: '#ffffe0' }}>{akunBaru.password}</span></Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Button
                variant="contained"
                color="inherit"
                onClick={() => navigate(-1)}
                sx={{ marginRight: 1, marginTop: -1 }}
              >
                Kembali
              </Button>
          </Container>
        ) : (
          <>
            <Stack spacing={3}>
              <TextField
                name="email_kantor"
                label="Email kantor"
                value={email_kantor}
                onChange={handleChange}
                required
                error={!!error}
                helperText={error}
              />
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </>
        )}
      </Card>
    </Box>
  )
}

export default AddKaryawan
