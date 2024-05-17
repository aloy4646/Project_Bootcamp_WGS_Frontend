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

const headLabel = [
  { id: 'no', label: 'No' },
  { id: 'nama_lengkap', label: 'Nama Lengkap' },
  { id: 'nama_panggilan', label: 'Nama Panggilan' },
  { id: 'email_kantor', label: 'Email Kantor' },
  { id: 'action', label: 'Action' },
]

export default function ListKaryawan() {
  const navigate = useNavigate()

  const [listKaryawan, setListKaryawan] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3001/users').then((response) => {
      setListKaryawan(response.data.listKaryawan)
    })
  }, [])

  const cekData = (data) => {
    if (!data){
      return <TableCell sx={{ fontStyle: 'italic', opacity: 0.8 }}>No Data</TableCell>
    }
    return <TableCell>{data}</TableCell>
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        List Karyawan
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
              {listKaryawan.map((karyawan, index) => (
                <TableRow key={karyawan.id}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  {cekData(karyawan.nama_lengkap)}
                  {cekData(karyawan.nama_panggilan)}
                  <TableCell>{karyawan.email_kantor}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/karyawan/${karyawan.id}`)}
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
