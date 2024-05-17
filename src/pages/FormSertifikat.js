import React, { useState, useEffect } from 'react'
import {
  Grid,
  TextField,
  Typography,
  Divider,
  Button,
  Container,
} from '@mui/material'
import { styled } from '@mui/system'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

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

function FormSertifikat() {
  const { id } = useParams()
  const [formData, setFormData] = useState({})
  const [oldData, setOldData] = useState({})
  const [selectedFile, setSelectedFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [mediaUrl, setMediaUrl] = useState({})

  const navigate = useNavigate()

  const location = useLocation()
  const [sertifikatId, setSertifikatId] = useState(null)

  useEffect(() => {
    console.log('masuk sini')
    const searchParams = new URLSearchParams(location.search)
    const sertifikatIdParam = searchParams.get('sertifikatId')
    setSertifikatId(sertifikatIdParam)

    // eslint-disable-next-line
  }, [location])

  useEffect(() => {
    if (sertifikatId) {
      axios
        .get(
          `http://localhost:3001/users/documents/sertifikat/${id}/${sertifikatId}`
        )
        .then((response) => {
          const data = response.data.sertifikat
          setOldData({
            ...data,
            tanggal_terbit: formatTanggal(data.tanggal_terbit),
            tanggal_expired: formatTanggal(data.tanggal_expired),
          })

          setFormData({
            ...data,
            tanggal_terbit: formatTanggal(data.tanggal_terbit),
            tanggal_expired: formatTanggal(data.tanggal_expired),
          })
        })
    }
  }, [id, sertifikatId])

  useEffect(() => {
    const fetchFile = async () => {
      if (isFilePath(oldData.media)) {
        const response = await axios.get(
          `http://localhost:3001/file?filePath=${encodeURIComponent(
            oldData.media
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
  
    if (oldData && oldData.media) {
      fetchFile()
    }
  }, [oldData])

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
    const requiredFields = ['nama', 'organisasi_penerbit', 'tanggal_terbit']

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required'
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const formDataToSend = new FormData()
    formDataToSend.append('userId', id)

    for (const key in formData) {
      if (formData[key] !== oldData[key]) {
        formDataToSend.append(key, formData[key])
      }
    }

    if (selectedFile) {
      formDataToSend.append('media', selectedFile)
    }

    console.log('RESET')
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}: ${value}`)
    }

    let endpoint = ''
    let method = ''
    let alertMessage = ''

    if (sertifikatId) {
      endpoint = `http://localhost:3001/users/documents/sertifikat/${sertifikatId}`
      method = 'put'
      alertMessage = 'Sertifikat berhasil di-update'
    } else {
      endpoint = `http://localhost:3001/users/documents/sertifikat`
      method = 'post'
      alertMessage = 'Sertifikat berhasil ditambahkan'
    }

    axios({
      method: method,
      url: endpoint,
      data: formDataToSend,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        alert(alertMessage)
        navigate(-1)
      })
      .catch((error) => {
        console.log(error)
        alert('Terjadi error, sertifikat gagal ditambahkan')
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
      <Typography variant="h4" gutterBottom>
        Form Sertifikat
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={3}>
        <FormGrid item xs={12} md={6}>
          <TextField
            label="Nama Sertifikat"
            name="nama"
            value={formData.nama || ''}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.nama}
            helperText={errors.nama}
          />
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <TextField
            label="Organisasi Penerbit"
            name="organisasi_penerbit"
            value={formData.organisasi_penerbit || ''}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.organisasi_penerbit}
            helperText={errors.organisasi_penerbit}
          />
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <TextField
            label="Tanggal Terbit"
            type="date"
            name="tanggal_terbit"
            value={formData.tanggal_terbit || ''}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.tanggal_terbit}
            helperText={errors.tanggal_terbit}
          />
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <TextField
            label="Tanggal Expired"
            type="date"
            name="tanggal_expired"
            value={formData.tanggal_expired || ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <TextField
            label="Credential ID"
            name="credential_id"
            value={formData.credential_id || ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <TextField
            label="Credential URL"
            name="credential_url"
            value={formData.credential_url || ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <Typography variant="body1" gutterBottom>
            Media
          </Typography>
          {mediaUrl && mediaUrl['url'] ? (
            <>
              {mediaUrl['type'].includes('pdf') ? (
                <iframe
                  src={mediaUrl['url']}
                  width="50%"
                  height="60%"
                  title="PDF File"
                />
              ) : mediaUrl['type'].includes('image') ? (
                <img
                  src={mediaUrl['url']}
                  alt={oldData.nama}
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
            name="media"
            accept="image/*,.pdf"
            onChange={handleFileChange}
          />
          <Typography variant="caption" display="block" gutterBottom>
            Tambahkan file image atau pdf jika ingin{' '}
            {sertifikatId ? 'mengubah' : 'menambahkan'} file media
          </Typography>
        </FormGrid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Container>
  )
}

export default FormSertifikat
