import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Container,
  Typography,
  Grid,
  Paper,
  Divider,
  Box,
  Button,
} from '@mui/material'
import { checkLogin } from '../features/AuthSlice'
import { useDispatch, useSelector } from 'react-redux'
import API_URL from '../config/config'

function isFilePath(value) {
  return typeof value === 'string' && value.includes('\\')
}

const formatTanggal = (tanggal) => {
  //format tanggal menjadi yyyy-mm-dd
  return tanggal ? new Date(tanggal).toISOString().split('T')[0] : ''
}

function DetailSertifikat() {
  const { id, sertifikatId } = useParams()
  const [detailSertifikat, setDetailSertifikat] = useState({})
  const [fileUrls, setFileUrls] = useState({})
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
      axios
        .get(
          `${API_URL}/users/documents/sertifikat/${id}/${sertifikatId}`
        )
        .then((response) => {
          const data = response.data.sertifikat
          setDetailSertifikat({
            ...data,
            tanggal_terbit: formatTanggal(data.tanggal_terbit),
            tanggal_expired: formatTanggal(data.tanggal_expired),
          })
        })
    }

  }, [isError, user, id, sertifikatId])

  useEffect(() => {
    const fetchFiles = async (data) => {
      const urls = {}
      for (const key in data) {
        if (isFilePath(data[key])) {
          const response = await axios.get(
            `${API_URL}/file?filePath=${encodeURIComponent(
              data[key]
            )}`,
            {
              responseType: 'blob',
            }
          )
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })
          const url = URL.createObjectURL(blob)
          urls[key] = { url, type: response.headers['content-type'] }
        }
      }
      return urls
    }

    const fetchData = async () => {
      const fileUrls = await fetchFiles(detailSertifikat)
      setFileUrls(fileUrls)
    }

    if (detailSertifikat) {
      fetchData()
    }
  }, [detailSertifikat])

  const renderFile = (file) => {
    if (file.type.includes('pdf')) {
      return (
        <>
          <iframe src={file.url} width="50%" height="60%" title="PDF File" />
          <br />
          <a href={file.url} target="_blank" rel="noopener noreferrer">
            <Button
              variant="contained"
              color="inherit"
              size="small"
              sx={{ fontSize: '0.70rem', marginTop: 1 }}
            >
              Buka PDF di tab baru
            </Button>
          </a>
        </>
      )
    } else if (file.type.includes('image')) {
      return <img src={file.url} alt={file.name} style={{ maxWidth: '80%' }} />
    } else {
      return (
        <a href={file.url} target="_blank" rel="noopener noreferrer">
          Download File
        </a>
      )
    }
  }

  const renderDetails = (data) => {
    return Object.keys(data).map((key) => (
      <Box key={key} mb={2}>
        <Typography variant="subtitle1">
          {key.replace('_', ' ').toUpperCase()}:
        </Typography>
        {fileUrls[key] ? (
          renderFile(fileUrls[key])
        ) : data[key] ? (
          <Typography>{data[key]}</Typography>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No data
          </Typography>
        )}
        <Divider sx={{ my: 2 }} />
      </Box>
    ))
  }

  const handleDelete = () => {
    axios
      .delete(
        `${API_URL}/users/documents/sertifikat/${sertifikatId}`)
      .then((response) => {
        alert('Sertifikat berhasil terhapus')
        navigate(-1)
      })
      .catch((error) => {
        console.error(error)
        alert('Terjadi kesalahan saat menghapus sertifikat')
      })
  }

  if (!detailSertifikat.id) {
    return <Typography>Loading...</Typography>
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
        Detail Sertifikat
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            {renderDetails({
              nama: detailSertifikat.nama,
              organisasi_penerbit: detailSertifikat.organisasi_penerbit,
              tanggal_terbit: detailSertifikat.tanggal_terbit,
              tanggal_expired: detailSertifikat.tanggal_expired,
            })}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            {renderDetails({
              credential_id: detailSertifikat.credential_id,
              credential_url: detailSertifikat.credential_url,
              media: detailSertifikat.media,
            })}
          </Paper>
        </Grid>
        {user && user.role === 'USER' && (
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                navigate(
                  `/karyawan/sertifikat/${id}/form?sertifikatId=${sertifikatId}`
                )
              }
              sx={{ marginRight: 1 }}
            >
              Update Sertifikat
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => handleDelete()}
              sx={{ marginRight: 1 }}
            >
              Hapus Sertifikat
            </Button>
          </Grid>
        )}
      </Grid>
      <Divider sx={{ my: 2 }} />
    </Container>
  )
}

export default DetailSertifikat
