export interface IMedicalHistoryParamReq {
  search: string
  limit: number
  page: number
}

export interface IMedicalHistoryBodyReq {
  childId: number
  parentId: number
}

export interface IBodyMedicalDetailHistoryReq {
  id: number
  type: string | string[]
}

export interface IMedicalDetailHistoryExaminationResponse {
  id?: string
  createdAt?: Date
  updatedAt?: Date
  createdBy?: null
  updatedBy?: null
  pediatricianId?: string
  cdicId?: string
  examinationDate?: Date
  examinationTime?: string
  complaint?: string
  weight?: number
  height?: number
  otherPhysicalExamination?: string
  bloodSugarTime?: string
  bloodSugarType?: string
  bloodSugarResult?: string
  hba1cResult?: string
  otherFindings?: string
  examinationResult?: string
}

export interface IMedicalDetailHistoryTerapiResponse {
  id?: string
  pediatricianId?: string
  cdicId?: string
  therapyDate?: Date
  therapyTime?: string
  dailyCalorieCount?: number
  dietNote?: string
  insulinTypeBreakfast?: null
  insulinTypeBreakfastDosis?: null
  insulinTypeLunch?: null
  insulinTypeLunchDosis?: null
  insulinTypeDinner?: null
  insulinTypeDinnerDosis?: null
  insulinTypeBeforeSleep?: null
  insulinTypeBeforeSleepDosis?: null
  regimenInsulinNote?: null
  doctorNote?: null
  nextVisitSchedule?: string
}

export interface IDiariOrtuResponse {
  id?: string
  createdAt?: Date
  updatedAt?: Date
  createdBy?: null
  updatedBy?: null
  parentId?: string
  entryDate?: string
  entryTime?: string
  bloodSugarType?: string
  bloodSugarResult?: string
  hbA1CResult?: string
  notes?: string
  foods?: string
  childImage1?: string
  labImage1?: string
}

export interface IMedicalHistory {
  data?: IMedicalDetailHistoryResponseList[]
  count?: number
  loading?: boolean
  errorMessage?: string
}
export interface IMedicalDetailHistoryResponseList {
  id?: string
  parentId?: string
  childId?: string
  pediatricianId?: string
  date?: string
  type?: string
  result?: string
}
