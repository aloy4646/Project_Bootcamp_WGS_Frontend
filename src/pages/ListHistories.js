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
  TablePagination,
} from '@mui/material';
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { checkLogin } from '../features/AuthSlice'
import { useDispatch, useSelector } from 'react-redux'
import { format, toZonedTime } from 'date-fns-tz'
import API_URL from '../config/config';

const convertToWIB = (dateString) => {
  const timeZone = 'Asia/Jakarta'
  const zonedDate = toZonedTime(dateString, timeZone)
  return format(zonedDate, 'yyyy-MM-dd HH:mm:ss', { timeZone })
}

const headLabel = [
  { id: 'no', label: 'No' },
  { id: 'date', label: 'Tanggal' },
  { id: 'author_name', label: 'Author' },
  { id: 'message', label: 'Message' },
  { id: 'action', label: 'Action' },
]


function ListHistories() {
  const { id } = useParams()
  const [historiesKaryawan, setHistoriesKaryawan] = useState([])
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
      axios.get(`${API_URL}/users/histories/${id}`).then((response) => {
        //mengurutkan logs dimulai dari yang terbaru
        const sortedHistories = response.data.histories.reverse()
        setHistoriesKaryawan(sortedHistories)
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
            {historiesKaryawan.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((history, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {historiesKaryawan.length - (page * rowsPerPage + index)}
                  </TableCell>
                  <TableCell>{convertToWIB(history.date)}</TableCell>
                  <TableCell>{history.author}</TableCell>
                  <TableCell>{history.message}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/karyawan/histories/${id}/${historiesKaryawan.length - index - 1}`)}
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
          count={historiesKaryawan.length}
          rowsPerPage={rowsPerPage}
          page={page} 
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10))
            setPage(0)
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

export default ListHistories