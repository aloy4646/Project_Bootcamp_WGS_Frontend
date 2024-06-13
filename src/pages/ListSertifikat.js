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
  TablePagination,
} from '@mui/material'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { checkLogin } from '../features/AuthSlice'
import { useDispatch, useSelector } from 'react-redux'
import API_URL from '../config/config'

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
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
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
        .get(`${API_URL}/users/documents/sertifikat/${id}`)
        .then((response) => {
          setListSertifikat(response.data.data.listSertifikat)
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
      {/* eslint-disable-next-line */}
      {user && user.id == id && (
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
      )}
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
            {listSertifikat.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((sertifikat, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                  {page * rowsPerPage + index + 1}
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={listSertifikat.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          sx={{ 
            mt: 2, 
            mb: 2, 
            display: 'flex', 
            justifyContent: 'center'
          }}
        />
      </Card>
    </Container>
  )
}

export default ListSertifikat
