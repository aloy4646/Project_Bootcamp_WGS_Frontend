import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Container, Grid, Paper, Typography, Divider, Box } from '@mui/material'

function isFilePath(value) {
  return typeof value === 'string' && value.includes('\\')
}

function DetailHistory() {
  const { id, index } = useParams()
  const [detailHistory, setDetailHistory] = useState({})
  const [fileUrls, setFileUrls] = useState({})

  useEffect(() => {
    axios
      .get(`http://localhost:3001/users/histories/${id}`)
      .then((response) => {
        setDetailHistory(response.data.histories[index])
      })
      // eslint-disable-next-line
  }, [])

  //meminta data berupa file ke server
  useEffect(() => {
    const fetchFiles = async (data, type) => {
      const urls = {}
      //mengecek semua data update-request apakah ada yang berupa file path
      for (const key in data) {
        if (isFilePath(data[key])) {
          //jika ada maka data file akan diminta ke server
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
      const oldUrls = await fetchFiles(detailHistory.old || {}, 'old')
      const newUrls = await fetchFiles(detailHistory.new || {}, 'new')
      setFileUrls({ old: oldUrls, new: newUrls })
    }

    if (detailHistory.old || detailHistory.new) {
      fetchData()
    }
  }, [detailHistory])

  const renderFile = (file) => {
    if (file.type.includes('pdf')) {
      return (
        <iframe src={file.url} width="100%" height="400px" title="PDF File" />
      )
    } else if (file.type.includes('image')) {
      return <img src={file.url} alt={file.name} style={{ maxWidth: '100%' }} />
    } else {
      return (
        <a href={file.url} target="_blank" rel="noopener noreferrer">
          Download File
        </a>
      )
    }
  }

  const renderDetails = (data, type) => {

    return Object.keys(data).map((key) => (
      <Box key={key} mb={2}>
        <Typography variant="subtitle1">
          {key.replace('_', ' ').toUpperCase()}:
        </Typography>
        {fileUrls[type] && fileUrls[type][key] ? (
          renderFile(fileUrls[type][key])
        ) : data[key] ? (
          <Typography>{data[key]}</Typography>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No data
          </Typography>
        )}
        <Divider sx={{ my: 2 }} />
      </Box>
    ))
  }

  if (!detailHistory.date) {
    return <Typography>Loading...</Typography>
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Detail history
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Date:
            </Typography>
            <Typography>{detailHistory.date}</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Author:
            </Typography>
            <Typography>{detailHistory.author}</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Message:
            </Typography>
            <Typography>{detailHistory.message}</Typography>
            <Divider sx={{ my: 2 }} />

          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Old Data
            </Typography>
            {renderDetails(detailHistory.old, 'old')}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              New Data
            </Typography>
            {renderDetails(detailHistory.new, 'new')}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default DetailHistory