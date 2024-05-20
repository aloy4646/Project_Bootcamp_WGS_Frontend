import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Container, Typography, Grid, Paper, Divider, Box, Button } from '@mui/material'
import { checkLogin } from '../features/AuthSlice'
import { useDispatch, useSelector } from 'react-redux'

function isFilePath(value) {
  return typeof value === 'string' && value.includes('\\');
}

const formatTanggal = (tanggal) => {
  //format tanggal menjadi yyyy-mm-dd
  return tanggal ? new Date(tanggal).toISOString().split('T')[0] : ''
}

function DetailKaryawan() {
  const { id } = useParams()
  const [detailKaryawan, setDetailKaryawan] = useState({})
  const [fileUrls, setFileUrls] = useState({})
  let navigate = useNavigate()
  const dispatch = useDispatch()
  const { isError, user } =  useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(checkLogin())
  }, [dispatch])
  
  useEffect(() => {
    if(isError){
      navigate('/')
    }
  }, [isError, user, navigate])


  useEffect(() => {
    if(!isError && user){
      axios.get(`http://localhost:3001/users/${id}`).then((response) => {
        const data = response.data.karyawan
        setDetailKaryawan({
          ...data,
          tanggal_lahir: formatTanggal(data.tanggal_lahir),
          tanggal_masuk: formatTanggal(data.tanggal_masuk),
          tanggal_keluar: formatTanggal(data.tanggal_keluar),
        })
      })
    }

  }, [id, isError, user])

  useEffect(() => {
    const fetchFiles = async (data) => {
      const urls = {};
      for (const key in data) {
        if (isFilePath(data[key])) {
          const response = await axios.get(`http://localhost:3001/file?filePath=${encodeURIComponent(data[key])}`, {
            responseType: 'blob',
          });
          const blob = new Blob([response.data], { type: response.headers['content-type'] });
          const url = URL.createObjectURL(blob);
          urls[key] = { url, type: response.headers['content-type'] };
        }
      }
      return urls;
    };

    const fetchData = async () => {
      const fileUrls = await fetchFiles(detailKaryawan);
      setFileUrls(fileUrls);
    };

    if (detailKaryawan) {
      fetchData();
    }
  }, [detailKaryawan]);

  const renderFile = (file) => {
    if (file.type.includes('pdf')) {
      return (
        <>
          <iframe src={file.url} width="50%" height="60%" title="PDF File" />
          <br />
          <a href={file.url} target="_blank" rel="noopener noreferrer">
            <Button variant="contained" color="inherit" size='small' sx={{ fontSize: '0.70rem', marginTop: 1}}>
              Buka PDF di tab baru
            </Button>
          </a>
        </>
      )
    } else if (file.type.includes('image')) {
      return <img src={file.url} alt={file.name} style={{ maxWidth: '80%' }} />;
    } else {
      return <a href={file.url} target="_blank" rel="noopener noreferrer">Download File</a>;
    }
  };

  const renderDetails = (data) => {
    return Object.keys(data).map((key) => (
      <Box key={key} mb={2}>
        <Typography variant="subtitle1">{key.replace('_', ' ').toUpperCase()}:</Typography>
        {fileUrls[key] ? (
          renderFile(fileUrls[key])
        ) : data[key] ? (
          <Typography>{data[key]}</Typography>
        ) : (
          <Typography variant="body2" color="textSecondary">No data</Typography>
        )}
        <Divider sx={{ my: 2 }} />
      </Box>
    ));
  };

  if (!detailKaryawan.id) {
    return <Typography>Loading...</Typography>;
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
        {detailKaryawan.nama_lengkap}
      </Typography>
      {user && user.role !== 'AUDITOR' && (
        <>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                navigate(`/karyawan/update/form/data/${detailKaryawan.id}`)
              }
              sx={{ marginRight: 1 }}
            >
              Update Data
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                navigate(`/karyawan/update/form/dokumen/${detailKaryawan.id}`)
              }
              sx={{ marginRight: 1 }}
            >
              Update Dokumen
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                navigate(`/karyawan/update/password/${detailKaryawan.id}`)
              }
              sx={{ marginRight: 1 }}
            >
              Update Password
            </Button>
          </Grid>
          <Divider sx={{ my: 1 }} />
        </>
      )}
      {user && (user.role === 'ADMIN' || user.role === 'AUDITOR') && (
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate(`/karyawan/logs/${detailKaryawan.id}`)}
            sx={{ marginRight: 1 }}
          >
            Logs
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate(`/karyawan/histories/${detailKaryawan.id}`)}
            sx={{ marginRight: 1 }}
          >
            Histories
          </Button>
        </Grid>
      )}
      <Divider sx={{ my: 1 }} />
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate(`/karyawan/sertifikat/${detailKaryawan.id}`)}
          sx={{ marginRight: 1 }}
        >
          Serifikat
        </Button>
      </Grid>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            {renderDetails({
              foto: detailKaryawan.foto,
              email_kantor: detailKaryawan.email_kantor,
              nama_lengkap: detailKaryawan.nama_lengkap,
              nama_panggilan: detailKaryawan.nama_panggilan,
              nomor_telepon: detailKaryawan.nomor_telepon,
              email_pribadi: detailKaryawan.email_pribadi,
              alamat_rumah: detailKaryawan.alamat_rumah,
            })}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            {renderDetails({
              alamat_tinggal: detailKaryawan.alamat_tinggal,
              tempat_lahir: detailKaryawan.tempat_lahir,
              tanggal_lahir: detailKaryawan.tanggal_lahir,
              nama_kontak_darurat: detailKaryawan.nama_kontak_darurat,
              nomor_telepon_kontak_darurat:
                detailKaryawan.nomor_telepon_kontak_darurat,
              nama_orang_tua: detailKaryawan.nama_orang_tua,
              nama_pasangan: detailKaryawan.nama_pasangan,
              nama_saudara: detailKaryawan.nama_saudara,
              tanggal_masuk: detailKaryawan.tanggal_masuk,
              tanggal_keluar: detailKaryawan.tanggal_keluar,
            })}
          </Paper>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h4" gutterBottom>
        Dokumen
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            {renderDetails({
              ktp: detailKaryawan.ktp,
              npwp: detailKaryawan.npwp,
              ijazah: detailKaryawan.ijazah,
            })}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            {renderDetails({
              transkrip_nilai: detailKaryawan.transkrip_nilai,
              cv_pribadi: detailKaryawan.cv_pribadi,
              cv_perusahaan: detailKaryawan.cv_perusahaan,
            })}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default DetailKaryawan
