import { ChangeEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import Header from '@/src/components/Header/Header'
import Card from '@/src/components/Card'
import BaseButton from '@/src/components/Button/BaseButton'
import CustomInput from '@/src/components/CustomInput'
import {
  basicClinicalDiagnosis,
  basicLaboratoryDiagnosis,
  last12MonthsVisit,
  symptom
} from '@/src/constants/constants'
import { useAppDispatch, useAppSelector } from '@/src/hooks/useStore'
import CustomCheckbox from '@/src/components/Checkbox'
import { formatDate, monthDiff } from '@/src/utils/formaters/dateFormat'
import {
  fetchPatientDiagnosis,
  addOrEditDiagnosis
} from '@/src/features/api/diagnosis'
import { IDiagnosis } from '../api/diagnosis/types'
import useBreadcrumbs from '@/src/hooks/useBreadcrumbs'
import AlertModal from '@/src/components/AlertModal'
import { setAlertData } from '@/src/components/AlertModal/alertSlice'
import { handleErrorTracking } from '@/src/utils/error-tracking-handler/errorTracking'
import { setSelectedTab } from '@/src/components/Modal/modalSlice'
import ToggleSwitch from '@/src/components/ToggleSwitch'

const TambahDiagnosisAwal = () => {
  const { query } = useRouter()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { auth } = useAppSelector((state) => state.auth)
  const [doctorName, setDoctorName] = useState<string>('')
  const type = query.type
  const cdicId = +query.cdicId
  const childId = +query.childId
  const parentId = +query.parentId
  const dob = query.dob

  const [dateOfBirth, setDateOfBirth] = useState<string>('')
  const [state, setState] = useState<IDiagnosis>({
    cdicId: 0,
    diagnosisDate: '',
    clinicalDiagnosisBasic: [],
    labDiagnosisBasic: [],
    diagnosisBasicNote: '',
    faskes: '',
    othersKomorbid: '',
    hba1cAwal: '',
    cPeptideAwal: '',
    kadarAutoantibodiAwal: ''
  })
  const [checkedStateClinicalDiagnosis, setCheckedStateClinicalDiagnosis] =
    useState<boolean[]>(new Array(basicClinicalDiagnosis.length).fill(false))
  const [checkedStateLabDiagnosis, setCheckedLabDiagnosis] = useState<
    boolean[]
  >(new Array(basicLaboratoryDiagnosis.length).fill(false))

  const handleOnChange = (val: HTMLInputElement) => {
    setState((prevState) => ({
      ...prevState,
      [val.name]: val.value
    }))
  }

  const handleGetPatientDiagnosis = async (cdicId: number) => {
    setState((prevState) => ({
      ...prevState,
      cdicId
    }))
    try {
      const response: IDiagnosis = await fetchPatientDiagnosis(cdicId)
      if (response) {
        setState((prevState) => ({
          ...prevState,
          diagnosisDate: formatDate(response?.diagnosisDate),
          clinicalDiagnosisBasic: response?.clinicalDiagnosisBasic,
          labDiagnosisBasic: response?.labDiagnosisBasic,
          diagnosisBasicNote: response?.diagnosisBasicNote,
          faskes: response?.faskes,
          othersKomorbid: response?.othersKomorbid
        }))
      }
    } catch (error) {
      const { message } = error as Error
      handleErrorTracking(doctorName, message, type)
      dispatch(
        setAlertData({
          isShow: true,
          type: 'error',
          message: 'Sepertinya sedang ada masalah, silakan coba lagi'
        })
      )
    }
  }

  const handleCheckboxClinicalDiagnosis = (
    event: ChangeEvent<HTMLInputElement>,
    position: number
  ): void => {
    const { value, checked } = event.target
    const updatedCheckedState = checkedStateClinicalDiagnosis.map(
      (item, index) => (index === position ? !item : item)
    )
    setCheckedStateClinicalDiagnosis(updatedCheckedState)
    if (checked) {
      setState((prevState) => ({
        ...prevState,
        clinicalDiagnosisBasic: [...state.clinicalDiagnosisBasic, value]
      }))
    } else {
      setState((prevState) => ({
        ...prevState,
        clinicalDiagnosisBasic: state.clinicalDiagnosisBasic.filter(
          (e: string) => e !== value
        )
      }))
    }
  }

  // const handleCheckboxLabDiagnosis = (
  //   event: ChangeEvent<HTMLInputElement>,
  //   position: number
  // ): void => {
  //   const { value, checked } = event.target
  //   const updatedCheckedState = checkedStateLabDiagnosis.map((item, index) =>
  //     index === position ? !item : item
  //   )
  //   setCheckedLabDiagnosis(updatedCheckedState)
  //   if (checked) {
  //     setState((prevState) => ({
  //       ...prevState,
  //       labDiagnosisBasic: [...state.labDiagnosisBasic, value]
  //     }))
  //   } else {
  //     setState((prevState) => ({
  //       ...prevState,
  //       labDiagnosisBasic: state.labDiagnosisBasic.filter(
  //         (e: string) => e !== value
  //       )
  //     }))
  //   }
  // }

  const handleSubmitDiagnosis = async () => {
    try {
      const response = await addOrEditDiagnosis(state, type)
      if (response) {
        void router.push(
          `/data-pasien/detail-pasien?cdicId=${cdicId}&parentId=${parentId}&childId=${childId}`
        )
      }
    } catch (error) {
      const { message } = error as Error
      handleErrorTracking(doctorName, message, type)
      dispatch(
        setAlertData({
          isShow: true,
          type: 'error',
          message:
            'Gagal Tambah Diagnosis Awal, hubungi admin jika masih terkendala'
        })
      )
    }
  }

  const validateSubmitButton = (): boolean => {
    return (
      state.diagnosisDate === '' ||
      state.clinicalDiagnosisBasic.length === 0 ||
      state.labDiagnosisBasic.length === 0
    )
  }

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      cdicId
    }))
    setDoctorName(auth.name)
    setDateOfBirth(String(dob))
    if (type === 'edit') {
      void handleGetPatientDiagnosis(cdicId)
    }
    void dispatch(setSelectedTab(+Cookies.get('_recentTab')))
  }, [type, query])

  const [breadcrumbs] = useBreadcrumbs(router)

  return (
    <>
      <AlertModal />
      <Header showBreadcrumb={true} dataBreadcrumbs={breadcrumbs}>
        <div className="md:pt-[18px] lg:pt-[20] xl:pt-[30px] flex flex-col">
          <h1 className="lg:text-[35px] xl:text-[40px] text-white font-bold">
            Tambah Diagnosis Awal
          </h1>
        </div>
      </Header>
      <div className="mb-20">
        <Card>
          <div className="py-6">
            <div className="px-5 pb-3 flex justify-between items-center">
              <h3 className="text-xl font-bold">Detail</h3>
              <div>
                <BaseButton
                  id="button-tambah-diagnosis-awal-simpan"
                  type="button"
                  size="md"
                  variant="primary"
                  isDisabled={validateSubmitButton()}
                  onClick={handleSubmitDiagnosis}
                >
                  Simpan
                </BaseButton>
              </div>
            </div>
            <div className="border-t-2">
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 py-4">
                <div className="col-span-1">
                  <label className="block pl-6 pb-6 w-full">
                    <div className="grid grid-cols-2 items-center">
                      <span className="text-neutral-400">
                        Tanggal Diagnosis
                      </span>
                      <div className="w-64 text-gray-500">
                        <CustomInput
                          id="input-tambah-diagnosis-awal-tanggal-diagnosis"
                          placeholder="tanggal diagnosis"
                          type="date"
                          value={state.diagnosisDate}
                          name="diagnosisDate"
                          onChangeInput={handleOnChange}
                        />
                      </div>
                    </div>
                  </label>
                  <label className="block pl-6 pb-6 w-full">
                    <div className="grid grid-cols-2 items-center">
                      <span className="text-neutral-400">
                        Usia Saat Diagnosis
                      </span>
                      <div className="w-64 text-gray-500">
                        <CustomInput
                          id="input-tambah-diagnosis-awal-tanggal-diagnosis"
                          placeholder="Usia Saat Diagnosis"
                          isDisabled={true}
                          value={monthDiff(dateOfBirth)}
                          name="age"
                        />
                      </div>
                    </div>
                  </label>
                  <label className="block pl-6 pb-6 w-full">
                    <div className="grid grid-cols-2 items-center">
                      <span className="text-neutral-400">Nama Dokter</span>
                      <div className="w-64 text-gray-500">
                        <CustomInput
                          id="input-tambah-diagnosis-awal-tanggal-diagnosis"
                          placeholder="Nama Dokter"
                          isDisabled={true}
                          name="doctor"
                          value={doctorName}
                        />
                      </div>
                    </div>
                  </label>
                  <label className="block pl-6 w-full">
                    <div className="grid grid-cols-1">
                      <h3 className="text-base font-bold">
                        Kunjungan 12 Bulan Terakhir
                      </h3>
                      <label className="block col-span-3 pt-4 w-full">
                        {last12MonthsVisit.map((item, index) => (
                          <CustomCheckbox
                            key={`clinical-diagnosis-${index}`}
                            value={item}
                            label={item}
                            checked={state.clinicalDiagnosisBasic.includes(
                              item
                            )}
                            onChangeCheckbox={(e) =>
                              handleCheckboxClinicalDiagnosis(e, index)
                            }
                          />
                        ))}
                      </label>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="border-b-2 border-b-slate-200">
              <div className="grid lg:grid-cols-2">
                <div className="col-span-1">
                  <div className="pb-6 px-6 flex justify-between items-center">
                    <h3 className="text-base font-bold">
                      Tingkat HbA1c, C-Peptide, & Kadar Autoantibodi
                    </h3>
                  </div>
                  <div className="pl-6 pb-6 grid grid-cols-3 items-center">
                    <span className="text-neutral-400">HbA1C Awal</span>
                    <div className="w-64 text-gray-500">
                      <CustomInput
                        id="input-tambah-diagnosis-awal-tanggal-diagnosis"
                        placeholder="HbA1C Awal"
                        isDisabled={true}
                        name="hba1cAwal"
                        value={state.hba1cAwal}
                      />
                    </div>
                    <div className="pl-20">
                      <ToggleSwitch />
                    </div>
                  </div>
                  <div className="pl-6 pb-6 grid grid-cols-3 items-center">
                    <span className="text-neutral-400">C-Peptide Awal</span>
                    <div className="w-64 text-gray-500">
                      <CustomInput
                        id="input-tambah-diagnosis-awal-tanggal-diagnosis"
                        placeholder="C-Peptide Awal"
                        isDisabled={true}
                        name="cPeptideAwal"
                        value={state.cPeptideAwal}
                      />
                    </div>
                    <div className="pl-20">
                      <ToggleSwitch />
                    </div>
                  </div>
                  <div className="pl-6 pb-6 grid grid-cols-3 items-center">
                    <span className="text-neutral-400">
                      Kadar Autoantibodi Awal
                    </span>
                    <div className="w-64 text-gray-500">
                      <CustomInput
                        id="input-tambah-diagnosis-awal-tanggal-diagnosis"
                        placeholder="Kadar Autoantibodi Awal"
                        isDisabled={true}
                        name="KadarAutoantibodiAwal"
                        value={state.kadarAutoantibodiAwal}
                      />
                    </div>
                    <div className="pl-20">
                      <ToggleSwitch />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-b-2 border-b-slate-200">
              <div className="grid lg:grid-cols-2 xl:grid-cols-3">
                <div className="col-span-1">
                  <div className="p-6 flex justify-between items-center">
                    <h3 className="text-base font-bold">
                      Gejala/ Kondisi Awal
                    </h3>
                  </div>
                  {symptom?.map((data, index) => (
                    <label
                      key={`clinical-diagnosis-${index}`}
                      className="block pl-6 pb-6 w-full"
                    >
                      <CustomCheckbox
                        value={data}
                        label={data}
                        checked={state.clinicalDiagnosisBasic.includes(data)}
                        onChangeCheckbox={(e) =>
                          handleCheckboxClinicalDiagnosis(e, index)
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-10 grid lg:grid-cols-2 xl:grid-cols-3">
                <div className="col-span-1">
                  <label className="block pl-6 pb-6 w-full">
                    <div className="grid grid-cols-2">
                      <span className="text-neutral-400">
                        Catatan Dasar Diagnosis
                      </span>
                      <div className="w-64 text-gray-500">
                        <textarea
                          className="w-full rounded-md border-neutral-300 text-gray-500"
                          value={state.diagnosisBasicNote}
                          onChange={(e) =>
                            setState((prevState) => ({
                              ...prevState,
                              diagnosisBasicNote: e.target.value
                            }))
                          }
                        />
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-10 grid lg:grid-cols-2 xl:grid-cols-3">
              <div className="col-span-1">
                <label className="block pl-6 pb-6 w-full">
                  <div className="grid grid-cols-2 items-center">
                    <span className="text-neutral-400">
                      Faskes untuk Kontrol
                    </span>
                    <div className="w-64 text-gray-500">
                      <CustomInput
                        id="input-tambah-diagnosis-awal-tanggal-diagnosis"
                        placeholder="Faskes untuk Kontrol"
                        name="faskes"
                        value={state.faskes}
                        onChangeInput={handleOnChange}
                      />
                    </div>
                  </div>
                </label>
                <label className="block pl-6 pb-6 w-full">
                  <div className="grid grid-cols-2">
                    <span className="text-neutral-400">Komorbid Lainnya</span>
                    <div className="w-64 text-gray-500">
                      <textarea
                        className="w-full rounded-md border-neutral-300 text-gray-500"
                        value={state.othersKomorbid}
                        onChange={(e) => {
                          setState((prevState) => ({
                            ...prevState,
                            othersKomorbid: e.target.value
                          }))
                        }}
                      />
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}

export default TambahDiagnosisAwal
