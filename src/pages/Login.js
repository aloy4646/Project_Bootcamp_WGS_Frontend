import React, { useEffect, useState } from 'react'
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
// import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LoginUser, reset } from '../features/AuthSlice'

export default function LoginView() {
  const theme = useTheme()
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [data, setData] = useState({})
  const dispatch = useDispatch()
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  )

  const navigate = useNavigate()

  useEffect(() => {
    if (user || isSuccess) {
      navigate('/home')
    }
    dispatch(reset())
  }, [user, isSuccess, dispatch, navigate])

  const handleLogin = (e) => {
    e.preventDefault()
    const newErrors = {}

    const requiredFields = ['email_kantor', 'password']

    requiredFields.forEach((field) => {
      if (!data[field]) {
        newErrors[field] = 'Field ini wajib diisi'
      }
    })

    // validasi email
    if (data["email_kantor"] && !validator.isEmail(data["email_kantor"])) {
      newErrors["email_kantor"] = 'Format email salah'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    dispatch(LoginUser(data))
  }

  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setData({
      ...data,
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
          Login
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
        <Divider sx={{ my: 1 }} />
        {isError && <Typography color="error">{message}</Typography>}
        <Divider sx={{ my: 1 }} />
        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleLogin}
        >
          {isLoading ? 'Loading...' : 'Login'}
        </Button>
      </Card>
    </Box>
  )
}
