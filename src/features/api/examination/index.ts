import { IExamination } from './types'
import satelite from '@/src/services/axios'

export const postAddExamination = async (params: IExamination) => {
  return await satelite({
    url: '/examination/add',
    method: 'post',
    data: JSON.stringify(params)
  })
}

export const postEditExamination = async (params: IExamination) => {
  return await satelite({
    url: '/examination/edit',
    method: 'post',
    data: JSON.stringify(params)
  })
}

export const getDetailExamination = async (id: number) => {
  return await satelite({
    url: `/examination/detail/${id}`,
    method: 'get'
  })
}
