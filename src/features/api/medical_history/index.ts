import satelite from '@/src/services/axios'
import {
  IMedicalHistoryParamReq,
  IMedicalHistoryBodyReq,
  IBodyMedicalDetailHistoryReq
} from './types'

export const fetchMedicalHistory = async (
  params: IMedicalHistoryParamReq,
  data: IMedicalHistoryBodyReq
) => {
  return await satelite({
    url:
      '/medical-history/list' +
      `${params.limit ? `?limit=${params.limit}&page=${params.page + 1}` : ''}${
        params.search ? `&filterBy=${params.search}` : ''
      }`,
    method: 'post',
    data: JSON.stringify(data)
  })
}

export const fetchMedicalDetailHistory = async (
  bodyReq: IBodyMedicalDetailHistoryReq
) => {
  return await satelite({
    url: '/medical-history/detail',
    method: 'post',
    data: JSON.stringify(bodyReq)
  })
}
