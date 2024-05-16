import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

function ListLogs() {
  const { id } = useParams()
  const [listLogsKaryawan, setListLogsKaryawan] = useState([])

  useEffect(() => {
    axios.get(`http://localhost:3001/users/logs/${id}`).then((response) => {
      setListLogsKaryawan(response.data.logs)
      console.log(response.data.logs)
    })
    // eslint-disable-next-line
  }, [])

  return <div>ListLogs</div>
}

export default ListLogs
