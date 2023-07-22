import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IPagination {
  search?: string
  limit?: number
  totalPage?: number
  page?: number
}

const initialState: IPagination = {
  search: '',
  limit: 5,
  totalPage: 0,
  page: 0
}

export const paginationSlice = createSlice({
  name: 'paramsPagination',
  initialState,
  reducers: {
    setPageCount: (state, action: PayloadAction<number>) => {
      state.totalPage = Math.ceil(action.payload / state.limit)
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    }
  }
})

export default paginationSlice.reducer
export const { setPageCount, setLimit, setSearch, setCurrentPage } =
  paginationSlice.actions
