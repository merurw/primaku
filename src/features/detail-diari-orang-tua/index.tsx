import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import AlertModal from '@/src/components/AlertModal'
import Header from '@/src/components/Header/Header'
import useBreadcrumbs from '@/src/hooks/useBreadcrumbs'
import Card from '@/src/components/Card'
import CustomInput from '@/src/components/CustomInput'
import { iconVariants } from '@/src/constants/constants'
import { IDiariOrtuResponse } from '../api/medical_history/types'
import { fetchMedicalDetailHistory } from '../api/medical_history'
import { handleErrorTracking } from '@/src/utils/error-tracking-handler/errorTracking'
import { useAppSelector, useAppDispatch } from '@/src/hooks/useStore'
import { setAlertData } from '@/src/components/AlertModal/alertSlice'
import { formatDate } from '@/src/utils/formaters/dateFormat'
import Modal from '@/src/components/Modal'
import { setSelectedTab } from '@/src/components/Modal/modalSlice'
import Cookies from 'js-cookie'

const DetailParentDiary = () => {
  const dispatch = useAppDispatch()
  const { query } = useRouter()
  const router = useRouter()
  const idMedical = +query.id
  const group = query.group
  const { auth } = useAppSelector((state) => state.auth)

  const [state, setState] = useState<IDiariOrtuResponse>({
    entryDate: '',
    entryTime: '',
    bloodSugarType: '',
    bloodSugarResult: '',
    hbA1CResult: '',
    notes: '',
    foods: '',
    childImage1: '',
    labImage1: ''
  })

  interface ILoader {
    src?: string
    width?: number
    quality?: number
  }
  const myLoader = ({ src, width, quality }: ILoader) => {
    return `https://s3.ap-southeast-3.amazonaws.com/assets.staging.primaku.com/${src}?w=${width}&q=${
      quality || 75
    }`
  }

  const handleGetParentDiary = async () => {
    try {
      const response: IDiariOrtuResponse = await fetchMedicalDetailHistory({
        id: +idMedical,
        type: group
      })
      if (response) {
        setState((prevState) => ({
          ...prevState,
          entryDate: formatDate(response?.entryDate),
          entryTime: response?.entryTime,
          hbA1CResult:
            response?.hbA1CResult !== null ? response?.hbA1CResult : '',
          bloodSugarResult: response?.bloodSugarResult,
          notes: response?.notes,
          foods: response?.foods,
          childImage1: response?.childImage1 ? response?.childImage1 : '',
          labImage1: response?.labImage1 ? response?.labImage1 : ''
        }))
      }
    } catch (error) {
      const { message } = error as Error
      handleErrorTracking(auth.name, message)
      dispatch(
        setAlertData({
          isShow: true,
          type: 'error',
          message: 'Gagal menampilkan Data Diari Orang Tua'
        })
      )
    }
  }

  const [showModalImage, setShowModalImage] = useState<boolean>(false)
  const [modalDetailImageType, setModalDetailImageType] = useState<string>('')
  const handleShowModalImage = (type: string) => {
    setShowModalImage(true)
    setModalDetailImageType(type)
  }

  useEffect(() => {
    if (query.group === 'Diari Orang Tua') void handleGetParentDiary()
    void dispatch(setSelectedTab(+Cookies.get('_recentTab')))
  }, [query.group])

  const [breadcrumbs] = useBreadcrumbs(router)

  return (
    <>
      <AlertModal />
      <Modal
        showModal={showModalImage}
        setShowModal={setShowModalImage}
        yOffset="100px"
      >
        <div className="px-2 flex justify-between items-center">
          <div className="flex items-center gap-x-3">
            <p className="text-lg font-bold">Detail Foto</p>
          </div>
          <span
            className="cursor-pointer"
            onClick={() => setShowModalImage(!showModalImage)}
          >
            &#x2715;
          </span>
        </div>
        <div className="p-5">
          <Image
            loader={myLoader}
            src={
              modalDetailImageType === 'Foto Anak'
                ? state.childImage1
                : state.labImage1
            }
            width={400}
            height={400}
            objectFit="cover"
          />
        </div>
      </Modal>
      <Header showBreadcrumb={true} dataBreadcrumbs={breadcrumbs}>
        <div className="md:pt-[18px] lg:pt-[20] xl:pt-[30px] flex flex-col">
          <h1 className="lg:text-[35px] xl:text-[40px] text-white font-bold">
            Detail Diari Orang Tua
          </h1>
        </div>
      </Header>
      <div className="mb-16">
        <Card>
          <div className="py-6">
            <div className="px-5 pb-3">
              <h3 className="text-xl font-bold">Detail</h3>
            </div>
            <div className="border-t-2 border-b-slate-200">
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 py-4">
                <div className="col-span-1">
                  <label className="block px-5 w-full">
                    <div className="grid grid-cols-2 items-center">
                      <span className="text-neutral-400">
                        Tanggal Diagnosis
                      </span>
                      <div className="w-64 text-gray-500">
                        <CustomInput
                          id="input-tambah-pemeriksaan-tanggal-diagnosis"
                          placeholder="tanggal diagnosis"
                          type="text"
                          name="examinationDate"
                          iconVariant={iconVariants.calendar}
                          isDisabled={true}
                          value={state.entryDate}
                          readOnly={true}
                        />
                      </div>
                    </div>
                  </label>
                  <label className="block pt-4 px-5 w-full">
                    <div className="grid grid-cols-2 items-center">
                      <span className="text-neutral-400">Jam</span>
                      <div className="w-64 text-gray-500">
                        <CustomInput
                          id="input-tambah-jam-gula-pemeriksaan"
                          placeholder="jam"
                          name="bloodSugarTime"
                          type="time"
                          isDisabled={true}
                          value={state.entryTime}
                          readOnly={true}
                        />
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="mb-16">
        <Card>
          <div className="py-6">
            <div className="px-5 pb-3">
              <h3 className="text-xl font-bold">Gula Darah</h3>
            </div>
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 py-4">
              <div className="col-span-1">
                <label className="block pb-4 px-5 w-full">
                  <div className="grid grid-cols-2 items-center">
                    <span className="text-neutral-400">Jenis</span>
                    <div className="w-64 text-gray-500">
                      <select
                        id="select-bloodSugarType"
                        name="bloodSugarType"
                        disabled
                        className="rounded-md border border-neutral-400 text-gray-500 w-full lg:text-xs xl:text-base bg-gray-200 placeholder:text-neutral-400"
                      >
                        <option value="GDP" defaultValue="Gula Darah Puasa">
                          Gula Darah Puasa
                        </option>
                        <option value="GDS">Gula Darah Sewaktu</option>
                        <option value="GD2PP">
                          Gula Darah 2 Jam Postprandial
                        </option>
                      </select>
                    </div>
                  </div>
                </label>
                <label className="block px-5 w-full">
                  <div className="grid grid-cols-2 items-center">
                    <span className="text-neutral-400">Hasil (mg/dL)</span>
                    <div className="w-64 text-gray-500">
                      <CustomInput
                        id="bloodSugarResult"
                        name="bloodSugarResult"
                        placeholder="hasil"
                        isDisabled={true}
                        value={state.bloodSugarResult}
                        readOnly={true}
                      />
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="mb-16">
        <Card>
          <div className="py-6">
            <div className="px-5 pb-3">
              <h3 className="text-xl font-bold">HbA1C</h3>
            </div>
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 py-4">
              <div className="col-span-1">
                <label className="block px-5 w-full">
                  <div className="grid grid-cols-2 items-center">
                    <span className="text-neutral-400">Hasil</span>
                    <div className="w-64 text-gray-500">
                      <CustomInput
                        id="hba1cResult"
                        name="hba1cResult"
                        placeholder="hasil HbA1C"
                        isDisabled={true}
                        value={state.hbA1CResult}
                        readOnly={true}
                      />
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="mb-16">
        <Card>
          <div className="py-6">
            <div className="px-5 pb-3">
              <h3 className="text-xl font-bold">Catatan Diari</h3>
            </div>
            <div className="grid lg:grid-cols-2 xl:grid-cols-3">
              <div className="col-span-1">
                <label className="block pt-3 px-5 w-full">
                  <div className="grid grid-cols-2 items-center">
                    <span className="text-neutral-400">Catatan</span>
                    <div className="w-64 text-gray-500">
                      <textarea
                        id="otherFindings"
                        name="otherFindings"
                        className="w-full rounded-md border-neutral-300 bg-gray-200 text-gray-500"
                        value={state.notes}
                        readOnly
                      />
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="mb-16">
        <Card>
          <div className="py-6">
            <div className="px-5 pb-3">
              <h3 className="text-xl font-bold">Makanan</h3>
            </div>
            <div className="grid lg:grid-cols-2 xl:grid-cols-3">
              <div className="col-span-1">
                <label className="block pt-3 px-5 w-full">
                  <div className="grid grid-cols-2 items-center">
                    <span className="text-neutral-400">Catatan</span>
                    <div className="w-64 text-gray-500">
                      <textarea
                        id="otherFindings"
                        name="otherFindings"
                        className="w-full rounded-md border-neutral-300 bg-gray-200 text-gray-500"
                        value={state.foods}
                        readOnly
                      />
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="mb-16">
        <Card>
          <div className="py-6">
            <div className="px-5 pb-3">
              <h3 className="text-xl font-bold">Foto Anak / Lab / Lainnya</h3>
            </div>
            <div className="flex px-5 gap-x-3">
              <div className="flex flex-col items-center gap-y-2">
                {state.childImage1 !== '' ? (
                  <Image
                    loader={myLoader}
                    src={state.childImage1}
                    width={100}
                    height={100}
                    objectFit="cover"
                    onClick={() => handleShowModalImage('Foto Anak')}
                  />
                ) : (
                  <div className="bg-gray-300 rounded-sm w-28 h-28 text-sm text-gray-500 flex justify-center items-center">
                    no image
                  </div>
                )}
                <span>Foto Anak</span>
              </div>
              <div className="flex flex-col items-center gap-y-2">
                {state.childImage1 !== '' ? (
                  <Image
                    loader={myLoader}
                    src={state.labImage1}
                    width={100}
                    height={100}
                    objectFit="cover"
                    onClick={() => handleShowModalImage('Foto Lab')}
                  />
                ) : (
                  <div className="bg-gray-300 rounded-sm w-28 h-28 text-sm text-gray-500 flex justify-center items-center">
                    no image
                  </div>
                )}
                <span>Foto Lab</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}

export default DetailParentDiary
