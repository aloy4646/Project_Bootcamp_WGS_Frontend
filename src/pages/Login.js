import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { useTheme } from '@mui/material/styles'
import validator from 'validator'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function LoginView() {
  const theme = useTheme()
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [body, setBody] = useState({})

  const navigate = useNavigate()

  const handleLogin = () => {
    const newErrors = {}

    const requiredFields = ['email_kantor', 'password']

    requiredFields.forEach((field) => {
      if (!body[field]) {
        newErrors[field] = 'Field ini wajib diisi'
      }
    })

    // validasi email
    if (body["email_kantor"] && !validator.isEmail(body["email_kantor"])) {
      newErrors["email_kantor"] = 'Format email salah'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    axios
      .post(`http://localhost:3001/users/login`, body)
      .then((response) => {
        alert('Login Berhasil')
        navigate('/')
      })
      .catch((error) => {
        console.log(error.response)
        if(error.response && error.response.data && error.response.data.error === 'wrong email kantor or password') {
          alert('Email Kantor atau Password Salah')
        }else{
          alert('Terjadi error, proses login gagal')
        }
      })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setBody({
      ...body,
      [name]: value,
    })

    setErrors({
      ...errors,
      [name]: null,
    })
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
          Sign In
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={3}>
          <TextField 
            name="email_kantor" 
            label="Email kantor" 
            onChange={handleChange}
            error={!!errors.email_kantor}
            helperText={errors.email_kantor}
          />
          <TextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleLogin}
        >
          Login
        </Button>
      </Card>
    </Box>
  )
}
