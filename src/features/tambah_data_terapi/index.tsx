import { ChangeEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import Header from '@/src/components/Header/Header'
import Card from '@/src/components/Card'
import BaseButton from '@/src/components/Button/BaseButton'
import CustomInput from '@/src/components/CustomInput'
import Accordion from '@/src/components/Accordion'
import { ITherapy } from '../api/therapy/types'
import { postAddTherapy, postEditTherapy } from '@/src/features/api/therapy'
import useBreadcrumbs from '@/src/hooks/useBreadcrumbs'
import { useAppDispatch, useAppSelector } from '@/src/hooks/useStore'
import {
  setIsShowModal,
  setDataModal,
  setSelectedTab
} from '@/src/components/Modal/modalSlice'
import { handleErrorTracking } from '@/src/utils/error-tracking-handler/errorTracking'
import { IMedicalDetailHistoryTerapiResponse } from '../api/medical_history/types'
import { fetchMedicalDetailHistory } from '../api/medical_history'
import { formatDate, timeSplit } from '@/src/utils/formaters/dateFormat'
import AlertModal from '@/src/components/AlertModal'
import { setAlertData } from '@/src/components/AlertModal/alertSlice'
import { insulinType } from '@/src/constants/constants'
import Cookies from 'js-cookie'

const TambahDataTerapi = () => {
  const { query } = useRouter()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const cdicId = +query.cdicId
  const childId = +query.childId
  const parentId = +query.parentId
  const idMedical = +query.id
  const group = query.group
  const [isBreakfast, setIsBreakfast] = useState<boolean>(true)
  const [isLunch, setIsLunch] = useState<boolean>(true)
  const [isDinner, setIsDinner] = useState<boolean>(true)
  const [isBeforeSleep, setIsBeforeSleep] = useState<boolean>(true)
  const { auth } = useAppSelector((state) => state.auth)

  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false)
  const [state, setState] = useState<ITherapy>({
    id: 0,
    cdicId: 0,
    therapyDate: '',
    therapyTime: '',
    dailyCalorieCount: null,
    dietNote: '',
    insulinTypeBreakfast: '',
    insulinTypeBreakfastDosis: '',
    insulinTypeLunch: 'Testing',
    insulinTypeLunchDosis: '',
    insulinTypeDinner: 'Coba',
    insulinTypeDinnerDosis: '',
    insulinTypeBeforeSleep: 'Coba',
    insulinTypeBeforeSleepDosis: '',
    regimenInsulinNote: '',
    doctorNote: '',
    nextVisitSchedule: null
  })

  const handleOnChange = (val: HTMLInputElement) => {
    setState((prevState) => ({
      ...prevState,
      [val.name]: val.type === 'number' ? val.valueAsNumber : val.value
    }))
  }

  const validateSubmitButton = (): boolean => {
    return (
      state.therapyDate === '' ||
      (state.dailyCalorieCount === null &&
        state.nextVisitSchedule === null &&
        state.doctorNote === '' &&
        state.regimenInsulinNote === '')
    )
  }

  const handleOnChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleOnChangeTextarea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value, name } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleAddTherapy = async () => {
    try {
      const response = await postAddTherapy(state)
      const href = `/data-pasien/detail-pasien/tambah-data-pemeriksaan?cdicId=${cdicId}&parentId=${parentId}&childId=${childId}`
      if (response) {
        void dispatch(setIsShowModal(true))
        void dispatch(setDataModal({ message: 'Data Terapi', href }))
        void dispatch(setSelectedTab(+Cookies.get('_recentTab')))
        void router.push(
          `/data-pasien/detail-pasien?cdicId=${cdicId}&parentId=${parentId}&childId=${childId}`
        )
      }
    } catch (error) {
      const { message } = error as Error
      handleErrorTracking(auth.name, message)
      dispatch(
        setAlertData({
          isShow: true,
          type: 'error',
          message: 'Gagal tambah Data Terapi'
        })
      )
    }
  }

  const handleGetTherapy = async () => {
    try {
      const response: IMedicalDetailHistoryTerapiResponse =
        await fetchMedicalDetailHistory({
          id: +idMedical,
          type: group
        })
      if (response) {
        setState((prevState) => ({
          ...prevState,
          therapyDate: formatDate(response?.therapyDate),
          therapyTime: timeSplit(response?.therapyDate),
          dailyCalorieCount: response?.dailyCalorieCount,
          dietNote: response?.dietNote,
          regimenInsulinNote: response?.regimenInsulinNote,
          doctorNote: response?.doctorNote,
          nextVisitSchedule: formatDate(response?.nextVisitSchedule)
        }))
      }
    } catch (error) {
      const { message } = error as Error
      handleErrorTracking(auth.name, message)
      dispatch(
        setAlertData({
          isShow: true,
          type: 'error',
          message: 'Gagal Menampilkan Data Terapi'
        })
      )
    }
  }

  const handleEditTherapy = async () => {
    try {
      const response = await postEditTherapy(state)
      if (response) {
        void dispatch(
          setAlertData({
            isShow: true,
            type: 'success',
            message: 'Sukses Edit Data Terapi'
          })
        )
        setTimeout(() => {
          void router.push(
            `/data-pasien/detail-pasien?cdicId=${cdicId}&parentId=${parentId}&childId=${childId}`
          )
        }, 5000)
      }
    } catch (error) {
      const { message } = error as Error
      handleErrorTracking(auth.name, message)
      void dispatch(
        setAlertData({
          isShow: true,
          type: 'error',
          message: 'Gagal Edit Data Terapi'
        })
      )
    }
  }

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      cdicId: +query.cdicId
    }))
    void dispatch(setSelectedTab(+Cookies.get('_recentTab')))
  }, [query.cdicId])

  useEffect(() => {
    if (query.type === 'edit') {
      void handleGetTherapy()
      setIsInputDisabled(true)
      setState((prevState) => ({
        ...prevState,
        id: idMedical
      }))
    }
  }, [query.type])

  const [breadcrumbs] = useBreadcrumbs(router)

  return (
    <>
      <AlertModal />
      <Header showBreadcrumb={true} dataBreadcrumbs={breadcrumbs}>
        <div className="md:pt-[18px] lg:pt-[30px] flex flex-col">
          <h1 className="lg:text-[35px] xl:text-[40px] text-white font-bold">
            Tambah Data Terapi
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
                          ? await handleEditTherapy()
                          : await handleAddTherapy()
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
                  <label className="block pl-6 pb-6 w-full">
                    <div className="grid grid-cols-3 items-center">
                      <span className="text-neutral-400">Tanggal Terapi</span>
                      <div className="col-span-2 flex items-center gap-x-5">
                        <div className="w-64 text-gray-500">
                          <CustomInput
                            id="input-tambah-therapy-tanggal-diagnosis"
                            placeholder="tanggal diagnosis"
                            type="date"
                            name="therapyDate"
                            value={state.therapyDate}
                            isDisabled={isInputDisabled}
                            onChangeInput={handleOnChange}
                          />
                        </div>
                        <div className="w-24 text-gray-500">
                          <CustomInput
                            id="input-tambah-jam-gula-pemeriksaan"
                            placeholder="jam"
                            name="therapyTime"
                            type="time"
                            isDisabled={isInputDisabled}
                            value={state.therapyTime}
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
        <Accordion title="Diet">
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <label className="block pt-3 pb-4 w-full">
                <div className="grid grid-cols-2 items-center">
                  <span className="text-neutral-400">
                    Jumlah kalori harian (kcal)
                  </span>
                  <div className="w-64 text-gray-500">
                    <CustomInput
                      id="input-tambah-jumlah-kalori-terapi"
                      placeholder="jumlah kalori harian"
                      type="number"
                      name="dailyCalorieCount"
                      isDisabled={isInputDisabled}
                      value={state.dailyCalorieCount}
                      onChangeInput={handleOnChange}
                    />
                  </div>
                </div>
              </label>
              <label className="block pt-3 pb-4 w-full">
                <div className="grid grid-cols-2 items-center">
                  <span className="text-neutral-400">Catatan</span>
                  <div className="w-64 text-gray-500">
                    <textarea
                      id="dietNote"
                      className={clsx(
                        'w-full rounded-md border-neutral-300 text-gray-500',
                        isInputDisabled ? 'bg-gray-200' : ''
                      )}
                      value={state.dietNote}
                      name="dietNote"
                      onChange={handleOnChangeTextarea}
                    />
                  </div>
                </div>
              </label>
              <label className="block pt-3 pb-4 w-full">
                <div className="grid grid-cols-2 items-center">
                  <span className="text-neutral-400">
                    Rasio per gram karbohidrat
                  </span>
                  <div className="w-64 text-gray-500">
                    <CustomInput
                      id="input-tambah-jumlah-kalori-terapi"
                      placeholder="rasio per gram karbohidrat"
                      type="number"
                      name="dailyCalorieCount"
                      isDisabled={isInputDisabled}
                      value={state.dailyCalorieCount}
                      onChangeInput={handleOnChange}
                    />
                  </div>
                </div>
              </label>
            </div>
          </div>
        </Accordion>
        <Accordion title="Regimen Insulin">
          <div className="grid grid-cols-4 gap-x-3">
            <div className="col-span-2">
              <label className="block pt-3 w-full"></label>
            </div>
            <div className="col-span-3">
              <label className="block pt-3 w-full">
                <div className="grid grid-cols-4 items-center gap-x-2">
                  <span className="text-neutral-400">Timing</span>
                  <span className="text-neutral-400">Jenis Injeksi</span>
                  <span className="text-neutral-400">Dosis (IU)</span>
                </div>
              </label>
            </div>
            <div className="col-span-3">
              <label className="block pt-3 w-full">
                <div className="grid grid-cols-4 items-center gap-x-2">
                  <div className="w-full text-gray-500">
                    <CustomInput
                      id="input-tambah-insulin-pagi"
                      value="Makan Pagi"
                      name="input-tambah-insulin-pagi"
                      isDisabled={true}
                    />
                  </div>
                  <div className="w-full text-gray-500">
                    <select
                      id="insulinTypeBreakfast"
                      name="insulinTypeBreakfast"
                      className={clsx(
                        'rounded-md border border-neutral-300 text-gray-500 w-full',
                        isBreakfast
                          ? 'bg-gray-200 border-2 border-neutral-300'
                          : ''
                      )}
                      disabled={isBreakfast}
                      value={state.insulinTypeBreakfast}
                      onChange={handleOnChangeSelect}
                    >
                      <option defaultValue="pilih insulin">
                        Pilih Insulin
                      </option>
                      {insulinType.map((item, idx) => (
                        <option key={`${item}${idx}`} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full text-gray-500">
                    <CustomInput
                      id="insulinTypeBreakfastDosis"
                      name="insulinTypeBreakfastDosis"
                      isDisabled={isBreakfast}
                      value={state.insulinTypeBreakfastDosis}
                      onChangeInput={handleOnChange}
                    />
                  </div>
                  <div
                    className="w-full cursor-pointer"
                    onClick={() => setIsBreakfast(!isBreakfast)}
                  >
                    <div
                      className={clsx(
                        'p-0 m-0 rounded-full lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-white inline-flex items-center justify-center font-extrabold text-2xl',
                        isBreakfast ? ' bg-primary' : 'bg-red-500'
                      )}
                    >
                      {isBreakfast ? '+' : '-'}
                    </div>
                  </div>
                </div>
              </label>
              <label className="block pt-3 w-full">
                <div className="grid grid-cols-4 items-center gap-x-2">
                  <div className="w-full text-gray-500">
                    <CustomInput
                      id="insulinTypeLunchDosis"
                      value="Makan Siang"
                      name="insulinTypeLunchDosis"
                      isDisabled={true}
                    />
                  </div>
                  <div className="w-full text-gray-500">
                    <select
                      id="insulinTypeLunch"
                      name="insulinTypeLunch"
                      className={clsx(
                        'rounded-md border border-neutral-300 text-gray-500 w-full',
                        isLunch ? 'bg-gray-200 border-2 border-neutral-300' : ''
                      )}
                      disabled={isLunch}
                      value={state.insulinTypeLunch}
                      onChange={handleOnChangeSelect}
                    >
                      <option selected>Pilih Insulin</option>
                      {insulinType.map((item, idx) => (
                        <option key={`${item}${idx}`} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full text-gray-500">
                    <CustomInput
                      id="insulinTypeLunchDosis"
                      name="insulinTypeLunchDosis"
                      value={state.insulinTypeLunchDosis}
                      isDisabled={isLunch}
                      onChangeInput={handleOnChange}
                    />
                  </div>
                  <div
                    className="w-full cursor-pointer"
                    onClick={() => setIsLunch(!isLunch)}
                  >
                    <div
                      className={clsx(
                        'p-0 m-0 rounded-full lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-white inline-flex items-center justify-center font-extrabold text-2xl',
                        isLunch ? ' bg-primary' : 'bg-red-500'
                      )}
                    >
                      {isLunch ? '+' : '-'}
                    </div>
                  </div>
                </div>
              </label>
              <label className="block pt-3 w-full">
                <div className="grid grid-cols-4 items-center gap-x-2">
                  <div className="w-full text-gray-500">
                    <CustomInput
                      id="input-tambah-insulin-malam"
                      value="Makan Malam"
                      name="input-tambah-insulin-malam"
                      isDisabled={true}
                    />
                  </div>
                  <div className="w-full text-gray-500">
                    <select
                      id="insulinTypeDinner"
                      name="insulinTypeDinner"
                      className={clsx(
                        'rounded-md border border-neutral-300 text-gray-500 w-full',
                        isDinner
                          ? 'bg-gray-200 border-2 border-neutral-300'
                          : ''
                      )}
                      disabled={isDinner}
                      value={state.insulinTypeDinner}
                      onChange={handleOnChangeSelect}
                    >
                      <option selected>Pilih Insulin</option>
                      {insulinType.map((item, idx) => (
                        <option key={`${item}${idx}`} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full text-gray-500">
                    <CustomInput
                      id="insulinTypeDinnerDosis"
                      name="insulinTypeDinnerDosis"
                      value={state.insulinTypeDinnerDosis}
                      isDisabled={isDinner}
                      onChangeInput={handleOnChange}
                    />
                  </div>
                  <div
                    className="w-full cursor-pointer"
                    onClick={() => setIsDinner(!isDinner)}
                  >
                    <div
                      className={clsx(
                        'p-0 m-0 rounded-full lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-white inline-flex items-center justify-center font-extrabold text-2xl',
                        isDinner ? ' bg-primary' : 'bg-red-500'
                      )}
                    >
                      {isDinner ? '+' : '-'}
                    </div>
                  </div>
                </div>
              </label>
              <label className="block pt-3 w-full">
                <div className="grid grid-cols-4 items-center gap-x-2">
                  <div className="w-full text-gray-500">
                    <CustomInput
                      id="input-tambah-insulin-sebelum-tidur"
                      value="Sebelum Tidur"
                      name="input-tambah-insulin-sebelum-tidur"
                      isDisabled={true}
                    />
                  </div>
                  <div className="w-full text-gray-500">
                    <select
                      id="insulinTypeBeforeSleep"
                      name="insulinTypeBeforeSleep"
                      className={clsx(
                        'rounded-md border border-neutral-300 text-gray-500 w-full',
                        isBeforeSleep
                          ? 'bg-gray-200 border-2 border-neutral-300'
                          : ''
                      )}
                      disabled={isBeforeSleep}
                      value={state.insulinTypeBeforeSleep}
                      onChange={handleOnChangeSelect}
                    >
                      <option selected>Pilih Insulin</option>
                      {insulinType.map((item, idx) => (
                        <option key={`${item}${idx}`} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full text-gray-500">
                    <CustomInput
                      id="insulinTypeBeforeSleepDosis"
                      name="insulinTypeBeforeSleepDosis"
                      value={state.insulinTypeBeforeSleepDosis}
                      isDisabled={isBeforeSleep}
                      onChangeInput={handleOnChange}
                    />
                  </div>
                  <div
                    className="w-full cursor-pointer"
                    onClick={() => setIsBeforeSleep(!isBeforeSleep)}
                  >
                    <div
                      className={clsx(
                        'p-0 m-0 rounded-full lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-white inline-flex items-center justify-center font-extrabold text-2xl',
                        isBeforeSleep ? ' bg-primary' : 'bg-red-500'
                      )}
                    >
                      {isBeforeSleep ? '+' : '-'}
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <label className="block pt-3 pb-4 w-full">
                <div className="grid grid-cols-2 items-center">
                  <span className="text-neutral-400">Catatan</span>
                  <div className="w-64 text-gray-500">
                    <textarea
                      id="regimenInsulinNote"
                      name="regimenInsulinNote"
                      className={clsx(
                        'w-full rounded-md border-neutral-300 text-gray-500',
                        isInputDisabled ? 'bg-gray-200' : ''
                      )}
                      value={state.regimenInsulinNote}
                      onChange={handleOnChangeTextarea}
                    />
                  </div>
                </div>
              </label>
            </div>
          </div>
        </Accordion>
        <Accordion title="Catatan Dokter">
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <label className="block pt-3 pb-4 w-full">
                <div className="grid grid-cols-2 items-center">
                  <span className="text-neutral-400">Catatan</span>
                  <div className="w-64 text-gray-500">
                    <textarea
                      id="doctorNote"
                      name="doctorNote"
                      className={clsx(
                        'w-full rounded-md border-neutral-300 text-gray-500',
                        isInputDisabled ? 'bg-gray-200' : ''
                      )}
                      value={state.doctorNote}
                      onChange={handleOnChangeTextarea}
                    />
                  </div>
                </div>
              </label>
            </div>
          </div>
        </Accordion>
        <Accordion title="Jadwal Kunjungan Berikutnya">
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <label className="block pt-3 pb-4 w-full">
                <div className="grid grid-cols-2 items-center">
                  <span className="text-neutral-400">Jadwal Kunjungan</span>
                  <div className="w-64 text-gray-500">
                    <CustomInput
                      id="input-tambah-jadwal-kunjungan-terapi"
                      placeholder="jadwal kunjungan"
                      type="date"
                      name="nextVisitSchedule"
                      isDisabled={isInputDisabled}
                      value={state.nextVisitSchedule}
                      onChangeInput={handleOnChange}
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

export default TambahDataTerapi
