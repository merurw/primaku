import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import {
  fetchPatientsList,
  IPayloadPatientList
} from '@/src/features/api/patient'
import { handleErrorTracking } from '@/src/utils/error-tracking-handler/errorTracking'
export interface IPatientResponse {
  data?: Datum[]
  count?: number
}
export interface Datum {
  id?: string
  createdAt?: Date
  updatedAt?: Date
  createdBy?: string
  updatedBy?: null
  pediatricianId?: string
  cdicId?: string
  isDeleted?: boolean
  cdic?: Cdic
  parentId?: string
  childId?: string
  entryDate?: string
  type?: string
  uploadedBy?: string
}
export interface Cdic {
  fatherName?: string
  motherName?: string
  child?: Child
  parent?: Parent
}
export interface Child {
  id?: string
  name?: string
  gender?: string
  dateOfBirth?: string | number | Date
}
export interface Parent {
  id?: string
  name?: string
}

interface InitialState {
  loading: boolean
  patients: IPatientResponse
  error: string
}

const initialState: InitialState = {
  loading: false,
  patients: {},
  error: ''
}

export const getPatientsList = createAsyncThunk(
  'patients/getPatientsList',
  async (params: IPayloadPatientList): Promise<unknown> => {
    try {
      if (params.search.length === 1) {
        params.search = ''
      }
      const response = await fetchPatientsList(params)
      return response
    } catch (error) {
      const { message } = error as Error
      handleErrorTracking('', message)
    }
  }
)

export const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPatientsList.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      getPatientsList.fulfilled,
      (state, action: PayloadAction<IPatientResponse>) => {
        state.loading = false
        state.patients = action.payload
        state.error = ''
      }
    )
    builder.addCase(getPatientsList.rejected, (state, action) => {
      state.loading = false
      state.patients = {}
      state.error = action.error.message || 'Error Get Patients List'
      handleErrorTracking('', action.error.message, 'get')
    })
  }
})

export default patientsSlice.reducer
