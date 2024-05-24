import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import API_URL from "../config/config"

const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

export const LoginUser = createAsyncThunk("user/LoginUser", async (user, thunkAPI) => {
    try {
        const response = await axios
          .post(`${API_URL}/auth/login`, {
            email_kantor: user.email_kantor,
            password: user.password,
          }).catch((error) => {
              alert(error.response.data.error)
          })
        return response.data.data
    } catch (error) {
        if(error.response) {
            const message = error.response.data.error
            return thunkAPI.rejectWithValue(message)
        }
    }
})

export const checkLogin = createAsyncThunk("user/check", async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${API_URL}/auth/check`)
        return response.data.data
    } catch (error) {
        if(error.response) {
            const message = error.response.data.error
            return thunkAPI.rejectWithValue(message)
        }
    }
})

export const logOut = createAsyncThunk("user/logOut", async () => {
    const response = await axios.delete(`${API_URL}/auth/logout`)
    return response.data
})


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        //login
        builder.addCase(LoginUser.pending, (state) =>{
            state.isLoading = true
        })
        builder.addCase(LoginUser.fulfilled, (state, action) =>{
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
        })
        builder.addCase(LoginUser.rejected, (state, action) =>{
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })

        //check
        builder.addCase(checkLogin.pending, (state) =>{
            state.isLoading = true
        })
        builder.addCase(checkLogin.fulfilled, (state, action) =>{
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
        })
        builder.addCase(checkLogin.rejected, (state, action) =>{
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
    }
})

export const {reset} = authSlice.actions
export default authSlice.reducer