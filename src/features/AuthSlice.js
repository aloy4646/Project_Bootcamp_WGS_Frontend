import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

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
          .post(`http://localhost:3001/auth/login`, {
            email_kantor: user.email_kantor,
            password: user.password,
          })
        return response.data
    } catch (error) {
        if(error.response) {
            const message = error.response.data.error
            return thunkAPI.rejectWithValue(message)
        }
    }
})

export const checkLogin = createAsyncThunk("user/check", async (_, thunkAPI) => {
    try {
        const response = await axios.get(`http://localhost:3001/auth/check`)
        return response.data
    } catch (error) {
        if(error.response) {
            const message = error.response.data.error
            return thunkAPI.rejectWithValue(message)
        }
    }
})

export const logOut = createAsyncThunk("user/logOut", async () => {
    const response = await axios.delete(`http://localhost:3001/auth/logout`)
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