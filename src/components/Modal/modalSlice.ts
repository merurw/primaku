import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface InitialState {
  isShowModal?: boolean
  message?: string
  href?: string
  selectedTab?: number
}

interface IPayload {
  message?: string
  href?: string
}

const initialState: InitialState = {
  isShowModal: false,
  message: '',
  href: '',
  selectedTab: 1
}

export const modalSlice = createSlice({
  name: 'modalSlice',
  initialState,
  reducers: {
    setIsShowModal: (state, action: PayloadAction<boolean>) => {
      state.isShowModal = action.payload
      state.selectedTab = null
    },
    setSelectedTab: (state, action: PayloadAction<number>) => {
      state.selectedTab = action.payload
    },
    setDataModal: (state, action: PayloadAction<IPayload>) => {
      state.message = action.payload.message
      state.href = action.payload.href
    }
  }
})

export default modalSlice.reducer
export const { setIsShowModal, setDataModal, setSelectedTab } =
  modalSlice.actions
