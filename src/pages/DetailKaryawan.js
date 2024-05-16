import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Container, Typography, Grid, Paper, Divider, Box, Button } from '@mui/material'

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

  useEffect(() => {
    axios.get(`http://localhost:3001/users/${id}`).then((response) => {
      const data = response.data.karyawan
      setDetailKaryawan({
        ...data,
        tanggal_lahir: formatTanggal(data.tanggal_lahir),
        tanggal_masuk: formatTanggal(data.tanggal_masuk),
        tanggal_keluar: formatTanggal(data.tanggal_keluar),
      })

    })
  }, [id])

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
      return <iframe src={file.url} width="100%" height="400px" title="PDF File" />;
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
      <Typography variant="h4" gutterBottom>
        Detail Karyawan
      </Typography>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/karyawan/update/form/${detailKaryawan.id}`)}
          sx={{ marginRight: 1 }}
        >
          Update
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
              nomor_telepon_kontak_darurat: detailKaryawan.nomor_telepon_kontak_darurat,
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
