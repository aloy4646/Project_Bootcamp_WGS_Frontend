import React, { useState, useEffect } from 'react'
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
import { checkLogin } from '../features/AuthSlice'
import { useDispatch, useSelector } from 'react-redux'
import API_URL from '../config/config'

function AddKaryawan() {
  const theme = useTheme()
  const [error, setError] = useState(null)
  const [email_kantor, setEmailKantor] = useState('')
  const [akunBaru, setAkunBaru] = useState({})
  const dispatch = useDispatch()
  const { isError } =  useSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(checkLogin())
  }, [dispatch])
  
  useEffect(() => {
    if(isError){
      navigate('/')
    }
  }, [isError, navigate])

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
    }

    axios
      .post(`${API_URL}/users`, body)
      .then((response) => {
        setAkunBaru({
            email_kantor : response.data.data.email_kantor,
            password : response.data.data.password,
        })
      })
      .catch((error) => {
        console.log(error)
        if(error.response && error.response.data && error.response.data.error) {
          alert(error.response.data.error)
        }else{
          alert('Terjadi error, proses pembuatan akun baru gagal')
        }
      })
  }

  const handleChange = (e) => {
    e.preventDefault()
    setEmailKantor(e.target.value)
    setError(null)
  }

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
      <Divider sx={{ my: 1 }} />
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
    </Container>
  )
}

export default AddKaryawan
