import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
import { verifyOTP } from '@/src/features/api/auth'
import { token } from '@/src/constants/constants'

interface IVerifyOTPRequest {
  phone?: string
  otpCode?: string
}
interface IAuth {
  token?: string
  id?: string
  name?: string
  email?: string
  phone?: string
}

interface InitialState {
  loading: boolean
  auth: IAuth
  error: string
}

const initialState: InitialState = {
  loading: false,
  auth: {},
  error: ''
}

export const fetchVerifyOTP = createAsyncThunk(
  'auth/fetchVerifyOTP',
  async (params: IVerifyOTPRequest): Promise<unknown> => {
    const response = await verifyOTP(params)
    return response
  }
)
const inFifteenMinutes = new Date(new Date().getTime() + 720 * 60 * 1000)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initAuth: (state, action: PayloadAction<IAuth>) => {
      state.auth = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchVerifyOTP.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchVerifyOTP.fulfilled,
      (state, action: PayloadAction<IAuth>) => {
        state.loading = false
        state.auth = action.payload
        state.error = ''
        Cookies.set(token, JSON.stringify(action.payload), {
          secure: true,
          expires: inFifteenMinutes
        })
      }
    )
    builder.addCase(fetchVerifyOTP.rejected, (state, action) => {
      state.loading = false
      state.auth = {}
      state.error = action.error.message || 'Something went wrong'
    })
  }
})

export const { initAuth } = authSlice.actions
export default authSlice.reducer
