import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import authReducer from '@/src/features/login/authSlice'
import patientReducer from '@/src/features/data_pasien/patientsSlice'
import paginationReducer from '@/src/components/Datatable/paginationSlice'
import patientDetailReducer from '@/src/features/detail_data_pasien/patientDetailSlice'
import modalReducer from '@/src/components/Modal/modalSlice'
import alertReducer from '@/src/components/AlertModal/alertSlice'

const reducers = combineReducers({
  auth: authReducer,
  patients: patientReducer,
  patientDetail: patientDetailReducer,
  paginations: paginationReducer,
  dataModals: modalReducer,
  dataAlert: alertReducer
})

const store = configureStore({
  reducer: reducers,
  devTools: process.env.NEXT_PUBLIC_ENV === 'development'
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
