export interface IExamination {
  id?: number
  cdicId?: number
  examinationDate?: string
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
