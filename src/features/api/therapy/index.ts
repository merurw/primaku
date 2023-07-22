import { ITherapy } from './types'
import satelite from '@/src/services/axios'

export const postAddTherapy = async (params: ITherapy) => {
  return await satelite({
    url: '/therapy/add',
    method: 'post',
    data: JSON.stringify(params)
  })
}

export const postEditTherapy = async (params: ITherapy) => {
  return await satelite({
    url: '/therapy/edit',
    method: 'post',
    data: JSON.stringify(params)
  })
}
