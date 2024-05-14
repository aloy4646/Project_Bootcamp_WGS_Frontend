import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Container, Typography, Grid, Paper, Divider } from '@mui/material'

function DetailKaryawan() {
  const { id } = useParams()
  const [detailKaryawan, setDetailKaryawan] = useState({})

  useEffect(() => {
    axios.get(`http://localhost:3001/users/${id}`).then((response) => {
      setDetailKaryawan(response.data.karyawan)
    })
  }, [id])

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Detail Karyawan
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Email Kantor:
            </Typography>
            <Typography>{detailKaryawan.email_kantor}</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Nama Lengkap:
            </Typography>
            <Typography>{detailKaryawan.nama_lengkap}</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Nama Panggilan:
            </Typography>
            <Typography>{detailKaryawan.nama_panggilan}</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Nomor Telepon:
            </Typography>
            <Typography>{detailKaryawan.nomor_telepon}</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Email Pribadi:
            </Typography>
            <Typography>{detailKaryawan.email_pribadi}</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Alamat Rumah:
            </Typography>
            <Typography>{detailKaryawan.alamat_rumah}</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Alamat Tinggal:
            </Typography>
            <Typography>{detailKaryawan.alamat_tinggal}</Typography>
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Tempat Lahir:
            </Typography>
            <Typography>{detailKaryawan.tempat_lahir}</Typography>
            <Divider sx={{ my: 2 }} />
            
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Tanggal Lahir:
            </Typography>
            <Typography>{detailKaryawan.tanggal_lahir}</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Nama Kontak Darurat:
            </Typography>
            <Typography>{detailKaryawan.nama_kontak_darurat}</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Nomor Telepon Kontak Darurat:
            </Typography>
            <Typography>
              {detailKaryawan.nomor_telepon_kontak_darurat}
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Nama Orang Tua:
            </Typography>
            <Typography>{detailKaryawan.nama_orang_tua}</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Nama Pasangan:
            </Typography>
            <Typography>{detailKaryawan.nama_pasangan}</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Nama Saudara:
            </Typography>
            <Typography>{detailKaryawan.nama_saudara}</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Tanggal Masuk:
            </Typography>
            <Typography>{detailKaryawan.tanggal_masuk}</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Tanggal Keluar:
            </Typography>
            <Typography>{detailKaryawan.tanggal_keluar}</Typography>
            <Divider sx={{ my: 2 }} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default DetailKaryawan
