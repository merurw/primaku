const iconVariants = {
  arrow: 'arrow',
  danger: 'danger',
  user: 'user',
  phone: 'phone',
  qr: 'qr',
  search: 'search',
  edit: 'edit',
  calendar: 'calendar',
  doctor: 'doctor'
}

export enum iconVariantss {
  arrow = 'arrow',
  danger = 'danger',
  user = 'user',
  phone = 'phone',
  qr = 'qr',
  search = 'search',
  edit = 'edit',
  calendar = 'calendar',
  doctor = 'doctor'
}

const token = 'autkn'

const basicClinicalDiagnosis = [
  'KAD',
  'Obesitas',
  'Pruritus',
  'Abses Berulang',
  'Penurunan Berat Badan',
  `Gejala Hyperosmolar : Polyuria atau polydipsia atau enuresis sekunder`
]

const last12MonthsVisit = [
  'Dokter Mata',
  'Edukator Diabetes Melitus',
  'Psikolog',
  'Ahli Gizi'
]

const basicLaboratoryDiagnosis = [
  'Gula Darah Sewaktu > 200mg/dL',
  'Gula Darah Puasa > 140mg/dL',
  'OGTT > 200mg/dL ',
  'Insulin Autoantibodi positif',
  'Kadar C-peptide',
  `Ketonuria`,
  'Ketonemia (>0,5 mmol/L)',
  'HbA1c > 7% '
]

const symptom = [
  'Polidipsi',
  'Poliuri',
  'Polifagi',
  'Nokturia',
  'Penurunan BB',
  'KAD',
  'Obesitas',
  'Pruritus',
  'Abses Berulang',
  'Penurunan Berat Badan',
  'Gejala Hyperosmolar: Polyuria atau polydipsia atau enuresis sekunder'
]

const insulinType = [
  'ACTRAPID HM',
  'ACTRAPID HM',
  'ACTRAPID HM PENFILL',
  'APIDRA',
  'BASAGLAR',
  'BASALOG ONE',
  'CAPRISULIN LOG-G',
  'EZELIN',
  'FIASP',
  'GLARITUS',
  'HUMALOG KWIKPEN',
  'HUMALOG MIX25 KWIKPEN',
  'HUMALOG MIX50 KWIKPEN',
  'HUMULIN 30/70 KWIKPEN',
  'HUMULIN N KWIKPEN',
  'HUMULIN R',
  'HUMULIN R KWIKPEN',
  'INSULATARD HM',
  'INSUMAN BASAL',
  'INSUMAN COMB 25',
  'INSUMAN COMB 30',
  'INSUMAN RAPID',
  'LANTUS',
  'LANTUS XR',
  'LEVEMIR',
  'LEVEMIR FLEXPEN',
  'MIXTARD 30 HM',
  'NOVOMIX 30',
  'NOVORAPID',
  'RYZODEG',
  'SANSULIN LOG-G',
  'SCILIN M30',
  'SCILIN N',
  'SCILIN R',
  'SOLIQUA',
  'TRESIBA',
  'XULTOPHY'
]

const filterMedicalHistory = {
  doctorNote: 'Catatan Dokter',
  parentDiary: 'Diari Orang Tua'
}

export {
  iconVariants,
  token,
  basicClinicalDiagnosis,
  basicLaboratoryDiagnosis,
  filterMedicalHistory,
  insulinType,
  last12MonthsVisit,
  symptom
}
