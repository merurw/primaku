import satelite from '@/src/services/axios'
import {
  IMedicalHistoryParamReq,
  IMedicalHistoryBodyReq,
  IBodyMedicalDetailHistoryReq
} from '@/src/features/api/medical_history/types'

export const fetchLaboratoryData = async (
  params: IMedicalHistoryParamReq,
  data: IMedicalHistoryBodyReq
) => {
  return await satelite({
    url:
      '/lab-data/list' +
      `${params.limit ? `?limit=${params.limit}&page=${params.page + 1}` : ''}${
        params.search ? `&filterBy=${params.search}` : ''
      }`,
    method: 'post',
    data: JSON.stringify(data)
  })
}

export const fetchLaboratoryDetail = async (
  bodyReq: IBodyMedicalDetailHistoryReq
) => {
  return await satelite({
    url: '/lab-data/detail',
    method: 'post',
    data: JSON.stringify(bodyReq)
  })
}
