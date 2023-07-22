import { ChangeEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import Header from '@/src/components/Header/Header'
import Card from '@/src/components/Card'
import BaseButton from '@/src/components/Button/BaseButton'
import CustomInput from '@/src/components/CustomInput'
import Accordion from '@/src/components/Accordion'
import useBreadcrumbs from '@/src/hooks/useBreadcrumbs'
import { useAppDispatch, useAppSelector } from '@/src/hooks/useStore'
import { IExamination } from '../api/examination/types'
import { postAddExamination, postEditExamination } from '../api/examination'
import { fetchMedicalDetailHistory } from '../api/medical_history'
import {
  setIsShowModal,
  setDataModal,
  setSelectedTab
} from '@/src/components/Modal/modalSlice'
import AlertModal from '@/src/components/AlertModal'
import { setAlertData } from '@/src/components/AlertModal/alertSlice'
import { handleErrorTracking } from '@/src/utils/error-tracking-handler/errorTracking'
import { formatDate } from '@/src/utils/formaters/dateFormat'
import { IMedicalDetailHistoryExaminationResponse } from '../api/medical_history/types'
import Cookies from 'js-cookie'

const TambahDataPemeriksaan = () => {
  const { query } = useRouter()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const cdicId = +query.cdicId
  const childId = +query.childId
  const parentId = +query.parentId
  const idMedical = +query.id
  const group = query.group
  const { auth } = useAppSelector((state) => state.auth)

  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false)
  const [state, setState] = useState<IExamination>({
    id: 0,
    cdicId: 0,
    examinationDate: '',
    examinationTime: '',
    complaint: '',
    weight: null,
    height: null,
    otherPhysicalExamination: '',
    bloodSugarTime: '',
    bloodSugarType: 'Puasa',
    bloodSugarResult: '',
    hba1cResult: '',
    otherFindings: '',
    examinationResult: ''
  })
  const [bmi, setBmi] = useState<number>(0)

  const handleOnChange = (val: HTMLInputElement) => {
    setState((prevState) => ({
      ...prevState,
      [val.name]: val.type === 'number' ? val.valueAsNumber : val.value
    }))
  }

  const validateSubmitButton = (): boolean => {
    return (
      state.examinationDate === '' ||
      (state.complaint === '' &&
        state.weight === null &&
        state.height === null &&
        state.otherPhysicalExamination === '' &&
        state.bloodSugarTime === '' &&
        state.bloodSugarType === 'GDP' &&
        state.bloodSugarResult === '' &&
        state.hba1cResult === '' &&
        state.otherFindings === '' &&
        state.examinationResult === '')
    )
  }

  const handleOnChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setState((prevState) => ({
      ...prevState,
      bloodSugarType: e.target.value
    }))
  }

  const handleOnChangeTextarea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value, name } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleAddExamination = async () => {
    try {
      const response = await postAddExamination(state)
      const href = `/data-pasien/detail-pasien/tambah-data-terapi?cdicId=${cdicId}&parentId=${parentId}&childId=${childId}`
      if (response) {
        void dispatch(setIsShowModal(true))
        void dispatch(setDataModal({ message: 'Data Pemeriksaan', href }))
        void dispatch(setSelectedTab(+Cookies.get('_recentTab')))
        void router.push(
          `/data-pasien/detail-pasien?cdicId=${cdicId}&parentId=${parentId}&childId=${childId}`
        )
      }
    } catch (error) {
      const { message } = error as Error
      handleErrorTracking(auth.name, message)
      void dispatch(
        setAlertData({
          isShow: true,
          type: 'error',
          message: 'Gagal tambah Data Pemeriksaan'
        })
      )
    }
  }

  const handleEditExamination = async () => {
    try {
      const response = await postEditExamination(state)
      if (response) {
        void dispatch(
          setAlertData({
            isShow: true,
            type: 'success',
            message: 'Sukses Edit Data Pemeriksaan'
          })
        )
        void router.push(
          `/data-pasien/detail-pasien?cdicId=${cdicId}&parentId=${parentId}&childId=${childId}`
        )
      }
    } catch (error) {
      const { message } = error as Error
      handleErrorTracking(auth.name, message)
      void dispatch(
        setAlertData({
          isShow: true,
          type: 'error',
          message: 'Gagal Edit Data Pemeriksaan'
        })
      )
    }
  }

  const handleGetExamination = async () => {
    try {
      const response: IMedicalDetailHistoryExaminationResponse =
        await fetchMedicalDetailHistory({
          id: +idMedical,
          type: group
        })
      if (response) {
        setState((prevState) => ({
          ...prevState,
          examinationDate: formatDate(response?.examinationDate),
          examinationTime: response?.examinationTime,
          complaint: response?.complaint,
          weight: response?.weight,
          height: response?.height,
          otherPhysicalExamination: response?.otherPhysicalExamination,
          bloodSugarTime: response?.bloodSugarTime,
          bloodSugarType: response?.bloodSugarType,
          bloodSugarResult: response?.bloodSugarResult,
          hba1cResult: response?.hba1cResult,
          otherFindings: response?.otherFindings,
          examinationResult: response?.examinationResult
        }))
      }
    } catch (error) {
      const { message } = error as Error
      handleErrorTracking(auth.name, message)
      dispatch(
        setAlertData({
          isShow: true,
          type: 'error',
          message: 'Gagal Menampilkan Data Pemeriksaan'
        })
      )
    }
  }

  const handleIMT = () => {
    setBmi(state.weight / ((state.height / 100) * (state.height / 100)))
  }

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      id: idMedical,
      cdicId
    }))
    void dispatch(setSelectedTab(+Cookies.get('_recentTab')))
  }, [query.cdicId])

  useEffect(() => {
    if (query.type === 'edit') {
      void handleGetExamination()
      setIsInputDisabled(true)
      setState((prevState) => ({
        ...prevState,
        id: idMedical
      }))
    }
  }, [query.type])

  useEffect(() => {
    if (state.weight && state.height) {
      handleIMT()
    }
  }, [state.weight, state.height])

  const [breadcrumbs] = useBreadcrumbs(router)
  return (
    <>
      <AlertModal />
      <Header showBreadcrumb={true} dataBreadcrumbs={breadcrumbs}>
        <div className="md:pt-[18px] lg:pt-[30px] flex flex-col">
          <h1 className="lg:text-[35px] xl:text-[40px] text-white font-bold">
            Tambah Data Pemeriksaan
          </h1>
        </div>
      </Header>
      <div className="mb-10">
        <Card>
          <div className="py-6">
            <div className="px-5 pb-3 flex justify-between items-center">
              <h3 className="text-xl font-bold">Detail</h3>
              <div className="flex gap-x-2">
                {query.type === 'edit' && (
                  <div>
                    <BaseButton
                      id="button-tambah-diagnosis-awal-simpan"
                      type="button"
                      size="md"
                      variant={isInputDisabled ? 'primary' : 'gray'}
                      onClick={() => setIsInputDisabled(!isInputDisabled)}
                    >
                      {isInputDisabled ? 'Edit' : 'Cancel'}
                    </BaseButton>
                  </div>
                )}
                {!isInputDisabled && (
                  <div>
                    <BaseButton
                      id="button-tambah-diagnosis-awal-simpan"
                      type="button"
                      size="md"
                      variant="primary"
                      isDisabled={validateSubmitButton()}
                      onClick={async () =>
                        query.type === 'edit'
                          ? await handleEditExamination()
                          : await handleAddExamination()
                      }
                    >
                      Simpan
                    </BaseButton>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t-2 border-b-slate-200">
              <div className="grid grid-cols-2 py-4">
                <div className="col-span-1">
                  <label className="block px-4 w-full">
                    <div className="grid grid-cols-3 items-center">
                      <span className="text-neutral-400">
                        Tanggal Pemeriksaan
                      </span>
                      <div className="col-span-2 flex items-center gap-x-5">
                        <div className="w-64 text-gray-500">
                          <CustomInput
                            id="input-tambah-pemeriksaan-tanggal-diagnosis"
                            placeholder="tanggal diagnosis"
                            type="date"
                            name="examinationDate"
                            isDisabled={isInputDisabled}
                            value={state.examinationDate}
                            onChangeInput={handleOnChange}
                          />
                        </div>
                        <div className="w-24 text-gray-500">
                          <CustomInput
                            id="input-tambah-jam-gula-pemeriksaan"
                            placeholder="jam"
                            name="examinationTime"
                            type="time"
                            isDisabled={isInputDisabled}
                            value={state.examinationTime}
                            onChangeInput={handleOnChange}
                          />
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="px-12 mb-6">
        <p className="text-xl font-bold">Pilih Data yang ingin ditambahkan</p>
      </div>
      <div className="ml-[40px] mr-[79px] space-y-5">
        <Accordion title="Keluhan">
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <label className="block pt-3 pb-4 w-full">
                <div className="grid grid-cols-2 items-center">
                  <span className="text-neutral-400">
                    Keluhan yang dirasakan
                  </span>
                  <div className="w-64 text-gray-500">
                    <textarea
                      id="complaint"
                      name="complaint"
                      className={clsx(
                        'w-full rounded-md border-neutral-300 text-gray-500',
                        isInputDisabled ? 'bg-gray-200' : ''
                      )}
                      value={state.complaint}
                      disabled={isInputDisabled}
                      onChange={handleOnChangeTextarea}
                    />
                  </div>
                </div>
              </label>
            </div>
          </div>
        </Accordion>
        <Accordion title="Pemeriksaan Fisik">
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <label className="block pt-3 pb-4 w-full">
                <div className="grid grid-cols-2 items-center">
                  <span className="text-neutral-400">Berat Badan (kg)</span>
                  <div className="w-64 text-gray-500">
                    <CustomInput
                      id="input-tambah-berat-pemeriksaan"
                      placeholder="Berat badan"
                      name="weight"
                      type="number"
                      isDisabled={isInputDisabled}
                      value={state.weight}
                      onChangeInput={handleOnChange}
                    />
                  </div>
                </div>
              </label>
              <label className="block pb-4 w-full">
                <div className="grid grid-cols-2 items-center">
                  <span className="text-neutral-400">Tinggi Badan (cm)</span>
                  <div className="w-64 text-gray-500">
                    <CustomInput
                      id="input-tambah-tinggi-pemeriksaan"
                      placeholder="Tinggi badan"
                      name="height"
                      type="number"
                      isDisabled={isInputDisabled}
                      value={state.height}
                      onChangeInput={handleOnChange}
                    />
                  </div>
                </div>
              </label>
              <label className="block pb-4 w-full">
                <div className="grid grid-cols-2 items-center">
                  <span className="text-neutral-400">
                    Indeks Masa Tubuh (kg/m2)
                  </span>
                  <div className="w-64 text-gray-500">
                    <CustomInput
                      id="input-tambah-indeks-masa-tubuh-pemeriksaan"
                      placeholder="Indeks Masa Tubuh"
                      name="indeks"
                      isDisabled={true}
                      value={bmi.toFixed(1)}
                    />
                  </div>
                </div>
              </label>
              <label className="block pb-4 w-full">
                <div className="grid grid-cols-2 items-center">
                  <span className="text-neutral-400">Hasil PF Lainnya</span>
                  <div className="w-64 text-gray-500">
                    <textarea
                      id="otherPhysicalExamination"
                      className={clsx(
                        'w-full rounded-md border-neutral-300 text-gray-500',
                        isInputDisabled ? 'bg-gray-200' : ''
                      )}
                      name="otherPhysicalExamination"
                      value={state.otherPhysicalExamination}
                      onChange={handleOnChangeTextarea}
                    />
                  </div>
                </div>
              </label>
            </div>
          </div>
        </Accordion>
        <Accordion title="Gula Darah">
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <label className="block pt-3 pb-4 w-full">
                <div className="grid grid-cols-2 items-center">
                  <span className="text-neutral-400">Jam</span>
                  <div className="w-64 text-gray-500">
                    <CustomInput
                      id="input-tambah-jam-gula-pemeriksaan"
                      placeholder="jam"
                      name="bloodSugarTime"
                      type="time"
                      isDisabled={isInputDisabled}
                      value={state.bloodSugarTime}
                      onChangeInput={handleOnChange}
                    />
                  </div>
                </div>
              </label>
              <label className="block pb-4 w-full">
                <div className="grid grid-cols-2 items-center">
                  <span className="text-neutral-400">Jenis</span>
                  <div className="w-64 text-gray-500">
                    <select
                      id="select-bloodSugarType"
                      name="bloodSugarType"
                      className={clsx(
                        'rounded-md border border-neutral-300 text-gray-500 w-full lg:text-xs xl:text-base',
                        isInputDisabled
                          ? 'bg-gray-200 border-2 border-neutral-400'
                          : ''
                      )}
                      disabled={isInputDisabled}
                      value={state.bloodSugarType}
                      onChange={handleOnChangeSelect}
                    >
                      <option value="Puasa" defaultValue="Puasa">
                        Gula Darah Puasa
                      </option>
                      <option value="Sewaktu">Gula Darah Sewaktu</option>
                      <option value="GD2PP">
                        Gula Darah 2 Jam Postprandial
                      </option>
                    </select>
                  </div>
                </div>
              </label>
              <label className="block pb-4 w-full">
                <div className="grid grid-cols-2 items-center">
                  <span className="text-neutral-400">Hasil (mg/dL)</span>
                  <div className="w-64 text-gray-500">
                    <CustomInput
                      id="bloodSugarResult"
                      name="bloodSugarResult"
                      placeholder="hasil"
                      isDisabled={isInputDisabled}
                      value={state.bloodSugarResult}
                      onChangeInput={handleOnChange}
                    />
                  </div>
                </div>
              </label>
            </div>
          </div>
        </Accordion>
        <Accordion title="HbA1C">
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <label className="block pt-3 pb-4 w-full">
                <div className="grid grid-cols-2 items-center">
                  <span className="text-neutral-400">Hasil</span>
                  <div className="w-64 text-gray-500">
                    <CustomInput
                      id="hba1cResult"
                      name="hba1cResult"
                      placeholder="hasil HbA1C"
                      isDisabled={isInputDisabled}
                      value={state.hba1cResult}
                      onChangeInput={handleOnChange}
                    />
                  </div>
                </div>
              </label>
            </div>
          </div>
        </Accordion>
        <Accordion title="Temuan Lainnya">
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <label className="block pt-3 pb-4 w-full">
                <div className="grid grid-cols-2 items-center">
                  <span className="text-neutral-400">Temuan Lainnya</span>
                  <div className="w-64 text-gray-500">
                    <textarea
                      id="otherFindings"
                      name="otherFindings"
                      className={clsx(
                        'w-full rounded-md border-neutral-300 text-gray-500',
                        isInputDisabled ? 'bg-gray-200' : ''
                      )}
                      value={state.otherFindings}
                      onChange={handleOnChangeTextarea}
                    />
                  </div>
                </div>
              </label>
            </div>
          </div>
        </Accordion>
        <Accordion title="Diagnosis">
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <label className="block pt-3 pb-4 w-full">
                <div className="grid grid-cols-2 items-center">
                  <span className="text-neutral-400">Hasil Diagnosis</span>
                  <div className="w-64 text-gray-500">
                    <textarea
                      id="examinationResult"
                      name="examinationResult"
                      className={clsx(
                        'w-full rounded-md border-neutral-300 text-gray-500',
                        isInputDisabled ? 'bg-gray-200' : ''
                      )}
                      value={state.examinationResult}
                      onChange={handleOnChangeTextarea}
                    />
                  </div>
                </div>
              </label>
            </div>
          </div>
        </Accordion>
      </div>
    </>
  )
}

export default TambahDataPemeriksaan
