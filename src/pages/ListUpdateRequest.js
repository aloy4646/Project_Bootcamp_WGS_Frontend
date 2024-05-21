import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Button,
  Divider,
  TablePagination,
} from '@mui/material'
import axios from 'axios'
import { format, toZonedTime } from 'date-fns-tz'
import { checkLogin } from '../features/AuthSlice'
import { useDispatch, useSelector } from 'react-redux'

function formatDateToWIB(dateString) {
  const date = new Date(dateString)
  const timeZone = 'Asia/Jakarta'
  const zonedDate = toZonedTime(date, timeZone)
  return format(zonedDate, 'yyyy-MM-dd', { timeZone })
}

const headLabel = [
  { id: 'no', label: 'No' },
  { id: 'email_kantor', label: 'Email Kantor' },
  { id: 'nama_lengkap', label: 'Nama Lengkap' },
  { id: 'date', label: 'Tanggal' },
  { id: 'message', label: 'Pesan' },
  { id: 'action', label: 'Action' },
]

export default function ListUpdateRequest() {
  const [listUpdateRequest, setListUpdateRequest] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
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
      axios.get('http://localhost:3001/admin/update-request').then((response) => {
        setListUpdateRequest(response.data.update_requests)
      })
    }
  }, [isError, user])

  const cekData = (data) => {
    if (!data) {
      return (
        <TableCell sx={{ fontStyle: 'italic', opacity: 0.8 }}>
          No Data
        </TableCell>
      )
    }
    return <TableCell>{data}</TableCell>
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        List Update Request
      </Typography>
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
              {listUpdateRequest.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((update_request, index) => (
                <TableRow key={update_request.id}>
                  <TableCell component="th" scope="row">
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell>{update_request.email_kantor}</TableCell>
                  {cekData(update_request.nama_lengkap)}
                  <TableCell>{formatDateToWIB(update_request.date)}</TableCell>
                  <TableCell>{update_request.message}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        navigate(
                          `/karyawan/update-request/${update_request.id}`
                        )
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
          count={listUpdateRequest.length}
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
