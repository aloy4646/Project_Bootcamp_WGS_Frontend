import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Grid, Paper, Typography, Divider, Box } from '@mui/material';
import { format, toZonedTime } from 'date-fns-tz';

function formatDateToWIB(dateString) {
  const date = new Date(dateString);
  const timeZone = 'Asia/Jakarta';
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, 'yyyy-MM-dd', { timeZone });
}

function isFilePath(value) {
  return typeof value === 'string' && value.includes('\\');
}

function DetailUpdateRequest() {
  const { id } = useParams();
  const [detailUpdateRequest, setDetailUpdateRequest] = useState({});
  const [fileUrls, setFileUrls] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:3001/admin/update-request/${id}`).then((response) => {
      setDetailUpdateRequest(response.data.update_request);
    });
  }, [id]);

  useEffect(() => {
    const fetchFiles = async (data, type) => {
      const urls = {};
      for (const key in data) {
        if (isFilePath(data[key])) {
          const response = await axios.get(`http://localhost:3001/file?filePath=${encodeURIComponent(data[key])}`, {
            responseType: 'blob',
          });
          const blob = new Blob([response.data], { type: response.headers['content-type'] });
          const url = URL.createObjectURL(blob);
          urls[key] = { url, type: response.headers['content-type'] };
        }
      }
      return urls;
    };

    const fetchData = async () => {
      const oldUrls = await fetchFiles(detailUpdateRequest.old || {}, 'old');
      const newUrls = await fetchFiles(detailUpdateRequest.new || {}, 'new');
      setFileUrls({ old: oldUrls, new: newUrls });
    };

    if (detailUpdateRequest.old || detailUpdateRequest.new) {
      fetchData();
    }
  }, [detailUpdateRequest]);

  const renderFile = (file) => {
    if (file.type.includes('pdf')) {
      return <iframe src={file.url} width="100%" height="400px" title="PDF File" />;
    } else if (file.type.includes('image')) {
      return <img src={file.url} alt="Image File" style={{ maxWidth: '100%' }} />;
    } else {
      return <a href={file.url} target="_blank" rel="noopener noreferrer">Download File</a>;
    }
  };

  const renderDetails = (data, type) => {
    return Object.keys(data).map((key) => (
      <Box key={key} mb={2}>
        <Typography variant="subtitle1">{key.replace('_', ' ').toUpperCase()}:</Typography>
        {fileUrls[type] && fileUrls[type][key] ? (
          renderFile(fileUrls[type][key])
        ) : data[key] ? (
          <Typography>{data[key]}</Typography>
        ) : (
          <Typography variant="body2" color="textSecondary">No data</Typography>
        )}
        <Divider sx={{ my: 2 }} />
      </Box>
    ));
  };

  if (!detailUpdateRequest.id) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Detail Update Request
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              ID User:
            </Typography>
            <Typography>{detailUpdateRequest.idUser}</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Date:
            </Typography>
            <Typography>{formatDateToWIB(detailUpdateRequest.date)}</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Message:
            </Typography>
            <Typography>{detailUpdateRequest.message}</Typography>
            <Divider sx={{ my: 2 }} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Old Data
            </Typography>
            {renderDetails(detailUpdateRequest.old, 'old')}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              New Data
            </Typography>
            {renderDetails(detailUpdateRequest.new, 'new')}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DetailUpdateRequest;