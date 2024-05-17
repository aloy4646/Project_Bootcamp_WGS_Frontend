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
} from '@mui/material';
import axios from 'axios'
import { useParams } from 'react-router-dom'

const headLabel = [
  { id: 'no', label: 'No' },
  { id: 'date', label: 'Tanggal' },
  { id: 'author_name', label: 'Author' },
  { id: 'message', label: 'Message' },
]

function ListLogs() {
  const { id } = useParams()
  const [logsKaryawan, setLogsKaryawan] = useState([])
  
  useEffect(() => {
    axios.get(`http://localhost:3001/users/logs/${id}`).then((response) => {
      setLogsKaryawan(response.data.logs)
    })
    // eslint-disable-next-line
  }, [])

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Logs Karyawan
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
              {logsKaryawan.map((log, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>{log.author}</TableCell>
                  <TableCell>{log.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  )
}

export default ListLogs
