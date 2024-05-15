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
  } from '@mui/material';
import axios from 'axios'
import { format, toZonedTime } from 'date-fns-tz';

function formatDateToWIB(dateString) {
  const date = new Date(dateString);
  const timeZone = 'Asia/Jakarta';
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, 'yyyy-MM-dd', { timeZone });
}


const headLabel = [
  { id: 'no', label: 'No' },
  { id: 'nama_lengkap', label: 'Nama Lengkap' },
  { id: 'date', label: 'Tanggal' },
  { id: 'message', label: 'Pesan' },
  { id: 'action', label: 'Action' },
]

export default function ListUpdateRequest() {
  const navigate = useNavigate()

  const [listUpdateRequest, setListUpdateRequest] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3001/admin/update-request').then((response) => {
      console.log(response.data.update_requests)
      setListUpdateRequest(response.data.update_requests)
    })
  }, [])

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
              {listUpdateRequest.map((update_request, index) => (
                <TableRow key={update_request.id}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell>{update_request.nama_lengkap}</TableCell>
                  <TableCell>{formatDateToWIB(update_request.date)}</TableCell>
                  <TableCell>{update_request.message}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/karyawan/update-request/${update_request.id}`)}
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
