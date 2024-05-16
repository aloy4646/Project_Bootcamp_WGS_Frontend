import React, { useState, useEffect } from 'react'
import {
  //   Checkbox,
  //   FormControlLabel,
  Grid,
  //   FormLabel,
  //   OutlinedInput,
  TextField,
  Typography,
  Divider,
  Button,
} from '@mui/material'
import { styled } from '@mui/system'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import validator from 'validator'

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}))

const formatTanggal = (tanggal) => {
  //format tanggal menjadi yyyy-mm-dd
  return tanggal ? new Date(tanggal).toISOString().split('T')[0] : ''
}

function FormUserData() {
  const { id } = useParams()
  const [formData, setFormData] = useState({})
  const [oldData, setOldData] = useState({})
  const [selectedFile, setSelectedFile] = useState(null)
  const [errors, setErrors] = useState({})
  let navigate = useNavigate()

  useEffect(() => {
    axios.get(`http://localhost:3001/users/data/${id}`).then((response) => {
      const data = response.data.karyawan
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
    // eslint-disable-next-line
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
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
      if (!formData[field]) {
        newErrors[field] = 'This field is required'
      }
    })

    // validasi email
    const emailFields = ['email_kantor', 'email_pribadi']
    emailFields.forEach((field) => {
      if (formData[field] && !validator.isEmail(formData[field])) {
        newErrors[field] = 'Invalid email'
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

    // for (let [key, value] of formDataToSend.entries()) {
    //   console.log(`${key}: ${value}`)
    // }

    axios
      .put(`http://localhost:3001/users/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response.data)
        alert(
          'Permintaan update telah dicatat, silahkan tunggu konfirmasi dari admin'
        )
        navigate(`/karyawan/${id}`)
      })
  }

  return (
    <>
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
            InputProps={{
              readOnly: true,
              style: { backgroundColor: '#f0f0f0' }, // Warna latar belakang lebih gelap
            }}
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
        <FormGrid item xs={12}>
          <Typography variant="body1" gutterBottom>
            Foto
          </Typography>

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
