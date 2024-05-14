import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(4),
}))

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.grey ? theme.palette.grey[200] : '#f5f5f5',
}))

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
}))

function Home() {
  const navigate = useNavigate()
  const [listKaryawan, setListKaryawan] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3001/users').then((response) => {
      console.log(response.data.listKaryawan)
      setListKaryawan(response.data.listKaryawan)
    })
  }, [])

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Daftar Karyawan
      </Typography>
      <StyledTableContainer component={Paper}>
        <Table aria-label="simple table">
          <StyledTableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Email Kantor</TableCell>
              <TableCell>Nama Lengkap</TableCell>
              <TableCell>Nama Panggilan</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {listKaryawan &&
              listKaryawan.map((karyawan, index) => (
                <TableRow key={karyawan.id}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell>{karyawan.email_kantor}</TableCell>
                  <TableCell>{karyawan.nama_lengkap}</TableCell>
                  <TableCell>{karyawan.nama_panggilan}</TableCell>
                  <TableCell>
                    <StyledButton
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/karyawan/${karyawan.id}`)}
                    >
                      Detail
                    </StyledButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Container>
  )
}

export default Home
