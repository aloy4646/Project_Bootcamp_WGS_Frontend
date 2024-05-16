import React, { useState, useEffect } from 'react'
import {
  //   Checkbox,
  //   FormControlLabel,
  Grid,
  //   FormLabel,
  //   OutlinedInput,
  //   TextField,
  Typography,
  Divider,
  Button,
} from '@mui/material'
import { styled } from '@mui/system'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}))

function isFilePath(value) {
  return typeof value === 'string' && value.includes('\\')
}

function noData() {
  return (
    <Typography sx={{ fontStyle: 'italic', opacity: 0.8 }}>No Data</Typography>
  )
}

function FormUserDokumen() {
  const { id } = useParams()
  const [formData, setFormData] = useState({})
  const [oldData, setOldData] = useState({})
  const [fileUrls, setFileUrls] = useState({})
  let navigate = useNavigate()

  useEffect(() => {
    axios.get(`http://localhost:3001/users/dokumen/${id}`).then((response) => {
      const data = response.data.karyawan
      setOldData(data)
    })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const fetchFiles = async (data) => {
      const urls = {}
      for (const key in data) {
        if (isFilePath(data[key])) {
          const response = await axios.get(
            `http://localhost:3001/file?filePath=${encodeURIComponent(
              data[key]
            )}`,
            {
              responseType: 'blob',
            }
          )
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })
          const url = URL.createObjectURL(blob)
          urls[key] = { url, type: response.headers['content-type'] }
        }
      }
      return urls
    }

    const fetchData = async () => {
      const fileUrls = await fetchFiles(oldData)
      setFileUrls(fileUrls)
    }

    if (oldData) {
      fetchData()
    }
  }, [oldData])

  const handleFileChange = (e) => {
    const { name, files } = e.target
    setFormData({
      ...formData,
      [name]: files[0], // menyimpan file dalam state formData
    })
  }

  const handleSubmit = () => {
    const formDataToSend = new FormData()
    let kosong = true

    for (const key in formData) {
        
      if (formData[key] !== '' && formData[key] !== oldData[key]) {
        formDataToSend.append(key, formData[key])
        kosong = false
      }
    }

    //pengecekan formData masih kosong atau tidak
    if(kosong){
        alert('Silahkan lengkapi data terlebih dahulu')
        return
    }

    console.log("RESET");

    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}: ${value}`)
    }

    axios
      .put(`http://localhost:3001/users/documents/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        alert(
          'Permintaan update telah dicatat, silahkan tunggu konfirmasi dari admin'
        )
        navigate(`/karyawan/${id}`)
      })
  }

  const renderFile = (file) => {
    if (file.type.includes('pdf')) {
      return <iframe src={file.url} width="50%" height="60%" title="PDF File" />
    } else {
      return (
        <a href={file.url} target="_blank" rel="noopener noreferrer">
          Download File
        </a>
      )
    }
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Form Update Dokumen
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={3}>
        {/* {Object.keys(fileUrls).map((key) => (
          <FormGrid key={key} item xs={12} md={6}>
            <Typography variant="body1" gutterBottom>
              {key}
            </Typography>
            {renderFile(fileUrls[key])}
          </FormGrid>
        ))} */}
        <FormGrid item xs={12} md={6}>
          <Typography variant="body1" gutterBottom>
            KTP
          </Typography>
          {fileUrls['ktp'] ? renderFile(fileUrls['ktp']) : noData()}
          <Divider sx={{ my: 1 }} />
          <input
            type="file"
            name="ktp"
            accept=".pdf"
            onChange={handleFileChange}
          />
          <Typography variant="caption" display="block" gutterBottom>
            Tambahkan file pdf jika ingin merubah KTP
          </Typography>
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <Typography variant="body1" gutterBottom>
            NPWP
          </Typography>
          {fileUrls['npwp'] ? renderFile(fileUrls['npwp']) : noData()}
          <Divider sx={{ my: 1 }} />
          <input
            type="file"
            name="npwp"
            accept=".pdf"
            onChange={handleFileChange}
          />
          <Typography variant="caption" display="block" gutterBottom>
            Tambahkan file pdf jika ingin merubah NPWP
          </Typography>
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <Typography variant="body1" gutterBottom>
            Ijazah
          </Typography>
          {fileUrls['ijazah'] ? renderFile(fileUrls['ijazah']) : noData()}
          <Divider sx={{ my: 1 }} />
          <input
            type="file"
            name="ijazah"
            accept=".pdf"
            onChange={handleFileChange}
          />
          <Typography variant="caption" display="block" gutterBottom>
            Tambahkan file pdf jika ingin merubah Ijazah
          </Typography>
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <Typography variant="body1" gutterBottom>
            Transkrip Nilai
          </Typography>
          {fileUrls['transkrip_nilai']
            ? renderFile(fileUrls['transkrip_nilai'])
            : noData()}
          <Divider sx={{ my: 1 }} />
          <input
            type="file"
            name="transkrip_nilai"
            accept=".pdf"
            onChange={handleFileChange}
          />
          <Typography variant="caption" display="block" gutterBottom>
            Tambahkan file pdf jika ingin merubah Transkrip Nilai
          </Typography>
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <Typography variant="body1" gutterBottom>
            CV Pribadi
          </Typography>
          {fileUrls['cv_pribadi']
            ? renderFile(fileUrls['cv_pribadi'])
            : noData()}
          <Divider sx={{ my: 1 }} />
          <input
            type="file"
            name="cv_pribadi"
            accept=".pdf"
            onChange={handleFileChange}
          />
          <Typography variant="caption" display="block" gutterBottom>
            Tambahkan file pdf jika ingin merubah CV Pribadi
          </Typography>
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <Typography variant="body1" gutterBottom>
            CV Perusahaan
          </Typography>
          {fileUrls['cv_perusahaan']
            ? renderFile(fileUrls['cv_perusahaan'])
            : noData()}
          <Divider sx={{ my: 1 }} />
          <input
            type="file"
            name="cv_perusahaan"
            accept=".pdf"
            onChange={handleFileChange}
          />
          <Typography variant="caption" display="block" gutterBottom>
            Tambahkan file pdf jika ingin merubah CV Perusahaan
          </Typography>
        </FormGrid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </>
  )
}

export default FormUserDokumen
