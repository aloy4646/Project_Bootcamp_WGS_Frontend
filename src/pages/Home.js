import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { checkLogin } from '../features/AuthSlice'

function Home() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isError } =  useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(checkLogin())
  }, [dispatch])
  
  useEffect(() => {
    if(isError){
      navigate('/')
    }
  }, [isError, navigate])

  return (
    <div>Home</div>
  )
}

export default Home