import React, { useState, useEffect } from 'react'
import {
  Grid,
  TextField,
  Typography,
  Divider,
  Button,
} from '@mui/material'
import { styled } from '@mui/system'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import validator from 'validator'
import { checkLogin } from '../features/AuthSlice'
import { useDispatch, useSelector } from 'react-redux'
import API_URL from '../config/config'

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}))

const formatTanggal = (tanggal) => {
  //format tanggal menjadi yyyy-mm-dd
  return tanggal ? new Date(tanggal).toISOString().split('T')[0] : ''
}

function isFilePath(value) {
  return typeof value === 'string' && value.includes('\\');
}

function FormUserData() {
  const { id } = useParams()
  const [formData, setFormData] = useState({})
  const [oldData, setOldData] = useState({})
  const [selectedFile, setSelectedFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [mediaUrl, setMediaUrl] = useState({})
  const [message, setMessage] = useState(null)
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

  useEffect(() => {
    if(!isError && user){
      axios.get(`${API_URL}/users/data/${id}`).then((response) => {
        const data = response.data.user

        setFormData({
          ...data,
          tanggal_lahir: formatTanggal(data.tanggal_lahir),
          tanggal_masuk: formatTanggal(data.tanggal_masuk),
          tanggal_keluar: formatTanggal(data.tanggal_keluar),
        })
  
        setOldData({
          ...data,
          tanggal_lahir: formatTanggal(data.tanggal_lahir),
          tanggal_masuk: formatTanggal(data.tanggal_masuk),
          tanggal_keluar: formatTanggal(data.tanggal_keluar),
        })
      })
      
    }

  }, [id, isError, user])

  useEffect(() => {
    const fetchFile = async () => {
      if (isFilePath(oldData.foto)) {
        const response = await axios.get(
          `${API_URL}/file?filePath=${encodeURIComponent(
            oldData.foto
          )}`,
          {
            responseType: 'blob',
          }
        )
        const blob = new Blob([response.data], {
          type: response.headers['content-type'],
        })
        const url = URL.createObjectURL(blob)
        setMediaUrl({ url, type: response.headers['content-type'] })
      }
    }
  
    if (oldData && oldData.foto) {
      fetchFile()
    }
  }, [oldData])

  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
  }

  const handleMessageChange = (event) => {
    setMessage(event.target.value)
  }

  const handleSubmit = () => {
    // Reset errors
    setErrors({})

    // Validate required fields
    const newErrors = {}
    const requiredFields = [
      'email_kantor',
      'nama_lengkap',
      'nama_panggilan',
      'nomor_telepon',
      'email_pribadi',
      'alamat_rumah',
      'alamat_tinggal',
      'tempat_lahir',
      'tanggal_lahir',
      'nama_kontak_darurat',
      'nomor_telepon_kontak_darurat',
      'nama_orang_tua',
      'nama_pasangan',
      'nama_saudara',
      'tanggal_masuk',
    ]

    requiredFields.forEach((field) => {
      if (!formData[field] && !oldData[field]) {
        newErrors[field] = 'Field ini wajib diisi'
      }
    })

    if(!message){
      newErrors['message'] = 'Field ini wajib diisi'
    }

    // validasi email
    const emailFields = ['email_kantor', 'email_pribadi']
    emailFields.forEach((field) => {
      if (formData[field] && !validator.isEmail(formData[field])) {
        newErrors[field] = 'Format email salah'
      }
    })

    // validasi nomor telepon
    const numberFields = ['nomor_telepon', 'nomor_telepon_kontak_darurat']
    numberFields.forEach((field) => {
      if (
        formData[field] &&
        !validator.isMobilePhone(formData[field], 'id-ID')
      ) {
        newErrors[field] = 'Invalid phone number'
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const formDataToSend = new FormData()
    for (const key in formData) {
      if (formData[key] !== oldData[key]) {
        formDataToSend.append(key, formData[key])
      }
    }

    if (selectedFile) {
      formDataToSend.append('foto', selectedFile)
    }
    
    if ([...formDataToSend.entries()].length === 0) {
      alert('Tidak ada field yang diisi / diubah')
      return
    }

    formDataToSend.append('message', message)

    axios
      .put(`${API_URL}/users/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        alert(
          'Permintaan update telah dicatat, silahkan tunggu konfirmasi dari admin'
        )
        navigate(`/karyawan/${id}`)
      })
      .catch((error) => {
        alert(
          'Terjadi error, permintaan update gagal'
        )
        console.log(error)
      })
  }

  return (
    <>
      <Button
        variant="contained"
        color="inherit"
        onClick={() => navigate(-1)}
        sx={{ marginRight: 1, marginTop: -1 }}
      >
        Kembali
      </Button>
      <Divider sx={{ my: 1 }} />
      <Typography variant="h4" gutterBottom>
        Form Update Data
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={3}>
        <FormGrid item xs={12} md={6}>
          <TextField
            label="Email Kantor"
            type="email"
            name="email_kantor"
            value={formData.email_kantor || ''}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.email_kantor}
            helperText={errors.email_kantor}
            InputProps={
              user && user.role !== 'ADMIN'
                ? {
                    readOnly: true,
                    style: { backgroundColor: '#f0f0f0' },
                  }
                : {}
            }
          />
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <TextField
            label="Nama Lengkap"
            name="nama_lengkap"
            value={formData.nama_lengkap || ''}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.nama_lengkap}
            helperText={errors.nama_lengkap}
          />
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <TextField
            label="Nama Panggilan"
            name="nama_panggilan"
            value={formData.nama_panggilan || ''}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.nama_panggilan}
            helperText={errors.nama_panggilan}
          />
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <TextField
            label="Nomor Telepon"
            type="tel"
            name="nomor_telepon"
            value={formData.nomor_telepon || ''}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.nomor_telepon}
            helperText={errors.nomor_telepon}
          />
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <TextField
            label="Email Pribadi"
            type="email"
            name="email_pribadi"
            value={formData.email_pribadi || ''}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.email_pribadi}
            helperText={errors.email_pribadi}
          />
        </FormGrid>
        <FormGrid item xs={12}>
          <TextField
            label="Alamat Rumah"
            name="alamat_rumah"
            value={formData.alamat_rumah || ''}
            onChange={handleChange}
            multiline
            rows={2}
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.alamat_rumah}
            helperText={errors.alamat_rumah}
          />
        </FormGrid>
        <FormGrid item xs={12}>
          <TextField
            label="Alamat Tinggal"
            name="alamat_tinggal"
            value={formData.alamat_tinggal || ''}
            onChange={handleChange}
            multiline
            rows={2}
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.alamat_tinggal}
            helperText={errors.alamat_tinggal}
          />
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <TextField
            label="Tempat Lahir"
            name="tempat_lahir"
            value={formData.tempat_lahir || ''}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.tempat_lahir}
            helperText={errors.tempat_lahir}
          />
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <TextField
            label="Tanggal Lahir"
            type="date"
            name="tanggal_lahir"
            value={formData.tanggal_lahir || ''}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.tanggal_lahir}
            helperText={errors.tanggal_lahir}
          />
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <TextField
            label="Nama Kontak Darurat"
            name="nama_kontak_darurat"
            value={formData.nama_kontak_darurat || ''}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.nama_kontak_darurat}
            helperText={errors.nama_kontak_darurat}
          />
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <TextField
            label="Nomor Telepon Kontak Darurat"
            type="tel"
            name="nomor_telepon_kontak_darurat"
            value={formData.nomor_telepon_kontak_darurat || ''}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.nomor_telepon_kontak_darurat}
            helperText={errors.nomor_telepon_kontak_darurat}
          />
        </FormGrid>
        <FormGrid item xs={12}>
          <TextField
            label="Nama Orang Tua"
            name="nama_orang_tua"
            value={formData.nama_orang_tua || ''}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.nama_orang_tua}
            helperText={errors.nama_orang_tua}
          />
        </FormGrid>
        <FormGrid item xs={12}>
          <TextField
            label="Nama Pasangan"
            name="nama_pasangan"
            value={formData.nama_pasangan || ''}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.nama_pasangan}
            helperText={errors.nama_pasangan}
          />
        </FormGrid>
        <FormGrid item xs={12}>
          <TextField
            label="Nama Saudara"
            name="nama_saudara"
            value={formData.nama_saudara || ''}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.nama_saudara}
            helperText={errors.nama_saudara}
          />
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <TextField
            label="Tanggal Masuk"
            type="date"
            name="tanggal_masuk"
            value={formData.tanggal_masuk || ''}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.tanggal_masuk}
            helperText={errors.tanggal_masuk}
          />
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <TextField
            label="Tanggal Keluar"
            type="date"
            name="tanggal_keluar"
            value={formData.tanggal_keluar || ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <Typography variant="body1" gutterBottom>
            Foto
          </Typography>
          {mediaUrl && mediaUrl['url'] ? (
            <>
              { mediaUrl['type'].includes('image') ? (
                <img
                  src={mediaUrl['url']}
                  alt={oldData.email_kantor}
                  style={{ maxWidth: '80%' }}
                />
              ) : (
                <a
                  href={mediaUrl['url']}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download File
                </a>
              )}
            </>
          ) : (
            'No Data'
          )}
          <Divider sx={{ my: 1 }} />
          <input
            type="file"
            name="foto"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Typography variant="caption" display="block" gutterBottom>
            Tambahkan file image jika ingin merubah foto
          </Typography>
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <TextField
            label="Alasan perubahan"
            name="message"
            value={message || ''}
            onChange={handleMessageChange}
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.message}
            helperText={errors.message}
          />
        </FormGrid>
        {/* <FormGrid item xs={12}>
          <FormControlLabel
            control={<Checkbox name="saveAddress" value="yes" />}
            label="Use this address for payment details"
          />
        </FormGrid> */}
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </>
  )
}

export default FormUserData
