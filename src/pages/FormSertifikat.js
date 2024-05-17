import React from 'react'
import { Stack, TextField } from "@mui/material";

function addCertificate() {
  return (
    <div className="certificate-form">
      <Stack spacing={4} sx={{ margin: '20px' }}>
          <Stack direction={"column"} spacing={2}>
              <TextField variant="outlined" label="Name"/>
              <TextField variant="outlined" label="Organization Name"/>
          </Stack>
      </Stack>
    </div>
  )
}

export default addCertificate