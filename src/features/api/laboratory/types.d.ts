export interface ILaboratoryResponse {
  data?: ILaboratoryList[]
  count?: number
  loading?: boolean
  errorMessage?: string
}

export interface ILaboratoryList {
  id?: string
  parentId?: string
  childId?: string
  entryDate?: string
  uploadedBy?: string
  examinationResult?: string
}

export interface ILaboratoryDetailResponse {
  id?: string
  createdAt?: Date | string
  updatedAt?: Date | string
  createdBy?: null
  updatedBy?: null
  parentId?: string
  entryDate?: Date | string
  entryTime?: string
  bloodSugarType?: string
  bloodSugarResult?: string
  examinationResult?: string
  hbA1CResult?: null
  notes?: null
  foods?: null
  childImage1?: string
  labImage1?: string
}
