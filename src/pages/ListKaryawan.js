import React, { useState, useEffect, useMemo } from 'react'
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
    Grid,
  } from '@mui/material';
import axios from 'axios'
import { checkLogin } from '../features/AuthSlice'
import { useDispatch, useSelector } from 'react-redux'

export default function ListKaryawan() {
  const [listKaryawan, setListKaryawan] = useState([])
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
      axios.get('http://localhost:3001/users').then((response) => {
        setListKaryawan(response.data.listKaryawan)
      })
    }
  }, [isError, user])

  const headLabel = useMemo(() => {
    const baseLabels = [
      { id: 'no', label: 'No' },
      { id: 'nama_lengkap', label: 'Nama Lengkap' },
      { id: 'nama_panggilan', label: 'Nama Panggilan' },
      { id: 'email_kantor', label: 'Email Kantor' },
    ];
  
    if (user && user.role === 'SUPER ADMIN') {
      return [
        ...baseLabels,
        { id: 'role', label: 'Role' },
        { id: 'action', label: 'Action' }
      ];
    }
  
    return [
      ...baseLabels,
      { id: 'action', label: 'Action' }
    ];
  }, [user]);

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
      {user && user.role !== 'AUDITOR' && (
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/karyawan/add`)}
            sx={{ marginRight: 1 }}
          >
            Add New Karyawan
          </Button>
        </Grid>
      )}
      <Divider sx={{ my: 1 }} />
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
                  {user.role === 'SUPER ADMIN' ? (
                    <>
                      <TableCell>{karyawan.role}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => navigate(`/karyawan/role/${karyawan.id}`)}
                        >
                          Ubah Role
                        </Button>
                      </TableCell>
                    </>
                  ):(
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/karyawan/${karyawan.id}`)}
                      >
                        Detail
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  )
}
