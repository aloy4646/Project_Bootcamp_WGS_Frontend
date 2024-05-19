import React, { useState, useEffect } from 'react'
import {
  Container,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider,
  Button,
  Grid,
} from '@mui/material'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { checkLogin } from '../features/AuthSlice'
import { useDispatch, useSelector } from 'react-redux'

const formatTanggal = (tanggal) => {
  //format tanggal menjadi yyyy-mm-dd
  return tanggal ? new Date(tanggal).toISOString().split('T')[0] : ''
}

const headLabel = [
  { id: 'no', label: 'No' },
  { id: 'nama', label: 'Nama Sertifikat' },
  { id: 'organisasi_penerbit', label: 'Organisasi Penerbit' },
  { id: 'tanggal_terbit', label: 'Tanggal Terbit' },
  { id: 'tanggal_expired', label: 'Tanggal Expired' },
  { id: 'action', label: 'Action' },
]

function ListSertifikat() {
  const { id } = useParams()
  const [listSertifikat, setListSertifikat] = useState([])
  const dispatch = useDispatch()
  const { isError, user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(checkLogin())
  }, [dispatch])

  useEffect(() => {
    if (isError) {
      navigate('/')
    }
  }, [isError, navigate])

  useEffect(() => {
    if(!isError && user){
      axios
        .get(`http://localhost:3001/users/documents/sertifikat/${id}`)
        .then((response) => {
          setListSertifikat(response.data.listSertifikat)
        })
    }
  }, [isError, user, id])

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
      <Typography variant="h4" component="h1" gutterBottom>
        List Sertifikat
      </Typography>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/karyawan/sertifikat/${id}/form`)}
          sx={{ marginRight: 1 }}
        >
          Tambah Sertifikat
        </Button>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Card>
        <TableContainer>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                {headLabel.map((headCell) => (
                  <TableCell key={headCell.id} align={headCell.align || 'left'}>
                    {headCell.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {listSertifikat.map((sertifikat, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell>{sertifikat.nama}</TableCell>
                  <TableCell>{sertifikat.organisasi_penerbit}</TableCell>
                  <TableCell>
                    {formatTanggal(sertifikat.tanggal_terbit)}
                  </TableCell>
                  <TableCell>
                    {formatTanggal(sertifikat.tanggal_expired)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        navigate(`/karyawan/sertifikat/${id}/${sertifikat.id}`)
                      }
                    >
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  )
}

export default ListSertifikat
