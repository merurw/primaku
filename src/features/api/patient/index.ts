import { filterMedicalHistory } from '@/src/constants/constants'
import satelite from '../../../services/axios'

export interface IPayloadPatientList {
  search?: string
  limit?: number
  page?: number
}

export const fetchPatientsList = async (params: IPayloadPatientList) => {
  return await satelite({
    url:
      '/patients/cdic/list' +
      `${
        params.limit
          ? `?limit=${params.limit}&page=${params.page + 1}&search=${
              params.search === filterMedicalHistory.doctorNote ||
              params.search === filterMedicalHistory.parentDiary
                ? ''
                : params.search
            }`
          : ''
      }`,
    method: 'get'
  })
}

export const fetchPatientProfile = async (childId: number) => {
  return await satelite({
    url: `/patients/cdic/profile/${childId}`,
    method: 'get'
  })
}
