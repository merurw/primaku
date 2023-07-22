import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { fetchPatientProfile } from '../api/patient'
import { fetchPatientDiagnosis } from '../api/diagnosis'
import { fetchMedicalHistory } from '../api/medical_history'
import { fetchLaboratoryData } from '@/src/features/api/laboratory'
import {
  IMedicalHistory,
  IMedicalHistoryBodyReq,
  IMedicalHistoryParamReq
} from '../api/medical_history/types'
import { ILaboratoryResponse } from '../api/laboratory/types'

export interface IPatientDiagnosisResponse {
  pediatricianId?: string
  cdicId?: string
  diagnosisDate?: string | number
  clinicalDiagnosisBasic?: string[]
  labDiagnosisBasic?: string[]
  diagnosisBasicNote?: string
  faskes?: string
  othersKomorbid?: string
  errorMessage?: string
  loading?: boolean
}

interface PatientProfile {
  id?: string
  createdAt?: Date
  updatedAt?: Date
  createdBy?: string
  updatedBy?: null
  pediatricianId?: string
  cdicId?: string
  isDeleted?: boolean
  cdic?: Cdic
  errorMessage?: string
  loading?: boolean
}

interface Cdic {
  id?: string
  address?: null
  financingType?: string
  fatherName?: string
  fatherEthnic?: string
  fatherLastEducation?: string
  fatherPhone?: string
  motherName?: string
  motherEthnic?: string
  motherLastEducation?: string
  motherPhone?: string
  lastVisit?: string
  child?: Child
  parent?: Parent
}

interface Child {
  id?: string
  name?: string
  dateOfBirth?: string
  gender?: string
}

interface Parent {
  id?: string
  name?: string
  phone?: string
  email?: string
}

interface InitialState {
  patientProfile: PatientProfile
  patientDiagnosis: IPatientDiagnosisResponse
  medicalHistory: IMedicalHistory
  laboratoryData: ILaboratoryResponse
}

export interface IParams {
  paramFilterMedicalHistory?: IMedicalHistoryParamReq
  bodyReq?: IMedicalHistoryBodyReq
}

const initialState: InitialState = {
  patientProfile: {
    loading: false,
    errorMessage: ''
  },
  patientDiagnosis: {
    loading: false,
    errorMessage: ''
  },
  medicalHistory: {
    loading: false,
    errorMessage: ''
  },
  laboratoryData: {
    loading: false,
    errorMessage: ''
  }
}

export const getMedicalHistory = createAsyncThunk(
  'patient/getMedicalHistory',
  async (params: IParams): Promise<unknown> => {
    const response = await fetchMedicalHistory(
      params.paramFilterMedicalHistory,
      params.bodyReq
    )
    return response
  }
)

export const getPatientProfile = createAsyncThunk(
  'patient/getPatientProfile',
  async (params: number): Promise<unknown> => {
    const response = await fetchPatientProfile(params)
    return response
  }
)

export const getPatientDiagnosis = createAsyncThunk(
  'patient/getPatientDiagnosis',
  async (params: number): Promise<unknown> => {
    const response = await fetchPatientDiagnosis(params)
    return response
  }
)

export const getLaboratoryData = createAsyncThunk(
  'patient/getLaboratoryData',
  async (params: IParams): Promise<unknown> => {
    const response = await fetchLaboratoryData(
      params.paramFilterMedicalHistory,
      params.bodyReq
    )
    return response
  }
)

export const patientDetailSlice = createSlice({
  name: 'patientDetail',
  initialState,
  reducers: {
    resetPatientDiagnosis: (state) => {
      state.patientDiagnosis = {}
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getPatientProfile.pending, (state) => {
      state.patientProfile.loading = true
    })
    builder.addCase(
      getPatientProfile.fulfilled,
      (state, action: PayloadAction<PatientProfile>) => {
        state.patientProfile = action.payload
        state.patientProfile.loading = false
        state.patientProfile.errorMessage = ''
      }
    )
    builder.addCase(getPatientProfile.rejected, (state, action) => {
      state.patientProfile = {}
      state.patientProfile.loading = false
      state.patientProfile.errorMessage =
        action.error.message || 'Error Get Patient Detail'
    })
    builder.addCase(getPatientDiagnosis.pending, (state) => {
      state.patientDiagnosis.loading = true
    })
    builder.addCase(
      getPatientDiagnosis.fulfilled,
      (state, action: PayloadAction<PatientProfile>) => {
        state.patientDiagnosis = action.payload
        state.patientDiagnosis.loading = false
        state.patientDiagnosis.errorMessage = ''
      }
    )
    builder.addCase(getPatientDiagnosis.rejected, (state, action) => {
      state.patientDiagnosis = {}
      state.patientDiagnosis.loading = false
      state.patientDiagnosis.errorMessage =
        action.error.message || 'Error Get Patient Diagnosis'
    })
    builder.addCase(getMedicalHistory.pending, (state) => {
      state.medicalHistory.loading = true
    })
    builder.addCase(
      getMedicalHistory.fulfilled,
      (state, action: PayloadAction<IMedicalHistory>) => {
        state.medicalHistory = action.payload
        state.medicalHistory.loading = false
        state.medicalHistory.errorMessage = ''
      }
    )
    builder.addCase(getMedicalHistory.rejected, (state, action) => {
      state.medicalHistory = {}
      state.medicalHistory.loading = false
      state.medicalHistory.errorMessage =
        action.error.message || 'Error Get Patient Diagnosis'
    })
    builder.addCase(getLaboratoryData.pending, (state) => {
      state.laboratoryData.loading = true
    })
    builder.addCase(
      getLaboratoryData.fulfilled,
      (state, action: PayloadAction<IMedicalHistory>) => {
        state.laboratoryData = action.payload
        state.laboratoryData.loading = false
        state.laboratoryData.errorMessage = ''
      }
    )
    builder.addCase(getLaboratoryData.rejected, (state, action) => {
      state.laboratoryData = {}
      state.laboratoryData.loading = false
      state.laboratoryData.errorMessage =
        action.error.message || 'Error Get Patient Diagnosis'
    })
  }
})

export default patientDetailSlice.reducer
export const { resetPatientDiagnosis } = patientDetailSlice.actions
