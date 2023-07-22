import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IAlertProps {
  alertData?: IAlertDataProps
}

export interface IAlertDataProps {
  isShow?: boolean
  type?: string
  message?: string | []
}

const initialState: IAlertProps = {
  alertData: {
    isShow: false,
    type: '',
    message: ''
  }
}

export const alertSlice = createSlice({
  name: 'alertSlice',
  initialState,
  reducers: {
    setAlertData: (state, action: PayloadAction<IAlertDataProps>) => {
      state.alertData = action.payload
    }
  }
})

export default alertSlice.reducer
export const { setAlertData } = alertSlice.actions
