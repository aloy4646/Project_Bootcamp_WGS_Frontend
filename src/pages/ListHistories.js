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
  Button,
  Divider,
} from '@mui/material';
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const headLabel = [
  { id: 'no', label: 'No' },
  { id: 'date', label: 'Tanggal' },
  { id: 'author_name', label: 'Author' },
  { id: 'message', label: 'Message' },
  { id: 'action', label: 'Action' },
]


function ListHistories() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [historiesKaryawan, setHistoriesKaryawan] = useState([])
  
  useEffect(() => {
    axios.get(`http://localhost:3001/users/histories/${id}`).then((response) => {
      setHistoriesKaryawan(response.data.histories)
    })
    // eslint-disable-next-line
  }, [])

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
        Histories Karyawan
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
              {historiesKaryawan.map((history, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell>{history.date}</TableCell>
                  <TableCell>{history.author}</TableCell>
                  <TableCell>{history.message}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/karyawan/histories/${id}/${index}`)}
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

export default ListHistories