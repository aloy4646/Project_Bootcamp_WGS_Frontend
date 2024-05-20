import React, { useState, useEffect } from 'react'
import {
  Container,
  Box,
  Card,
  Stack,
  Button,
  Divider,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { checkLogin } from '../features/AuthSlice'
import { useDispatch, useSelector } from 'react-redux'

function PasswordField({
  name,
  label,
  value,
  onChange,
  error,
  helperText,
  showPassword,
  onToggleShowPassword,
}) {
  return (
    <TextField
      name={name}
      label={label}
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={helperText}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={onToggleShowPassword} edge="end">
              {showPassword ? '🙈' : '👁️'}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}

function UpdatePassword() {
  const { id } = useParams()
  const theme = useTheme()
  const [showPasswords, setShowPasswords] = useState([false, false, false])
  const [newPasswordByAdmin, setNewPasswordByAdmin] = useState(null)
  const [errors, setErrors] = useState({})
  const [body, setBody] = useState({
    old_password: '',
    new_password: '',
    confirm_new_password: '',
  })

  const dispatch = useDispatch()
  const { isError, user } =  useSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(checkLogin())
  }, [dispatch])
  
  useEffect(() => {
    if(isError){
      navigate('/')
    }
  }, [isError, navigate])


  const handleToggleShowPassword = (index) => {
    setShowPasswords((prev) => {
      const newShowPasswords = [...prev]
      newShowPasswords[index] = !newShowPasswords[index]
      return newShowPasswords
    })
  }

  const handleSubmit = () => {
    const newErrors = {}

    const requiredFields = [
      'old_password',
      'new_password',
      'confirm_new_password',
    ]

    requiredFields.forEach((field) => {
      if (!body[field]) {
        newErrors[field] = 'Field ini wajib diisi'
      }
    })

    if (body.new_password !== body.confirm_new_password) {
      newErrors.confirm_new_password = 'Password baru tidak cocok'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const bodyToSend = {
      old_password: body.old_password,
      new_password: body.new_password,
    }

    axios
      .put(`http://localhost:3001/users/password/${id}`, bodyToSend)
      .then((response) => {
        alert('Update Password Berhasil')
        navigate('/')
      })
      .catch((error) => {
        console.log(error.response)
        if(error.response && error.response.data && error.response.data.error === 'wrong old password') {
          alert('Old Password Salah')
        }else{
          alert('Terjadi error, proses update password gagal')
        }
      })
  }

  const handleSubmitByAdmin = () => {
    axios
      .put(`http://localhost:3001/admin/password/${id}`)
      .then((response) => {
        alert('Update Password Berhasil')
        setNewPasswordByAdmin(response.data.data.new_password)
      })
      .catch((error) => {
        console.log(error.response)
        alert('Terjadi error, proses update password gagal')
      })
  }

  const handleChange = (e) => {
    e.preventDefault()
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
          mt: -10,
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
            Update Password
          </Typography>
          <Divider sx={{ my: 2 }} />
          {user && user.role === 'ADMIN' ? (
            <>
              {newPasswordByAdmin ? (
                <Container>
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: 'lightgreen',
                      borderRadius: 2,
                      textAlign: 'left',
                    }}
                  >
                    <Typography variant="h6">
                      Perubahan password berhasil.{' '}
                    </Typography>
                    <Divider sx={{ my: 0.2 }} />
                    <Typography variant="h7">
                      New Password:{' '}
                      <span style={{ backgroundColor: '#ffffe0' }}>
                        {newPasswordByAdmin}
                      </span>
                    </Typography>
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
                  <Divider sx={{ my: 2 }} />
                  <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitByAdmin}
                  >
                    Generate Password Baru
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <Stack spacing={3}>
                <PasswordField
                  name="old_password"
                  label="Old Password"
                  value={body.old_password}
                  onChange={handleChange}
                  error={errors.old_password}
                  helperText={errors.old_password}
                  showPassword={showPasswords[0]}
                  onToggleShowPassword={() => handleToggleShowPassword(0)}
                />
                <PasswordField
                  name="new_password"
                  label="New Password"
                  value={body.new_password}
                  onChange={handleChange}
                  error={errors.new_password}
                  helperText={errors.new_password}
                  showPassword={showPasswords[1]}
                  onToggleShowPassword={() => handleToggleShowPassword(1)}
                />
                <PasswordField
                  name="confirm_new_password"
                  label="Confirm New Password"
                  value={body.confirm_new_password}
                  onChange={handleChange}
                  error={errors.confirm_new_password}
                  helperText={errors.confirm_new_password}
                  showPassword={showPasswords[2]}
                  onToggleShowPassword={() => handleToggleShowPassword(2)}
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

export default UpdatePassword
