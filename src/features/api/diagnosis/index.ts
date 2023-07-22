import satelite from '@/src/services/axios'
import { IDiagnosis } from './types'

export const addPatientDiagnosis = async (params: IDiagnosis) => {
  return await satelite({
    url: '/diagnosis/add',
    method: 'post',
    data: JSON.stringify(params)
  })
}

export const editPatientDiagnosis = async (params: IDiagnosis) => {
  return await satelite({
    url: '/diagnosis/edit',
    method: 'post',
    data: JSON.stringify(params)
  })
}

export const fetchPatientDiagnosis = async (cdicId: number) => {
  return await satelite({
    url: `/diagnosis/detail/${cdicId}`,
    method: 'get'
  })
}

export const addOrEditDiagnosis = async (
  params: IDiagnosis,
  type: string | string[]
) => {
  return await satelite({
    url: `diagnosis/${type === 'add' ? 'add' : 'edit'}`,
    method: 'post',
    data: JSON.stringify(params)
  })
}
