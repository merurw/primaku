// import Image from 'next/image'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import clsx from 'clsx'
import Header from '@/src/components/Header/Header'
import Card from '@/src/components/Card'
import Tabs from '@/src/components/Tabs'
import Modal from '@/src/components/Modal'
import BaseButton from '@/src/components/Button/BaseButton'
import Datatable from '@/src/components/Datatable'
import Snackbar from '@/src/components/Datatable/Snackbar'
import { useAppDispatch, useAppSelector } from '@/src/hooks/useStore'
import useOutsideClick from '@/src/hooks/useOutsideClick'
import CustomCheckbox from '@/src/components/Checkbox'
import { formatDateLong, monthDiff } from '@/src/utils/formaters/dateFormat'
import {
  getPatientProfile,
  getPatientDiagnosis,
  getMedicalHistory,
  getLaboratoryData
} from './patientDetailSlice'
import { setIsShowModal } from '@/src/components/Modal/modalSlice'
import useBreadcrumbs from '@/src/hooks/useBreadcrumbs'
import { IMedicalHistoryParamReq } from '../api/medical_history/types'
import { filterMedicalHistory } from '@/src/constants/constants'
import { setSearch, setLimit } from '@/src/components/Datatable/paginationSlice'

const tableColumn = ['TANGGAL', 'JENIS DATA', 'UPLOADED BY', 'ACTION']

const DetailPasien = () => {
  const { query } = useRouter()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const isTabOneSelected = !!query.tabOne
  const isTabTwoSelected = !!query.tabTwo
  const isTabThreeSelected = !!query.tabThree
  const childId = +query.childId
  const cdicId = +query.cdicId
  const parentId = +query.parentId
  const tabsData = [
    {
      id: 1,
      href: '?#tabOne=true',
      isSelected: isTabOneSelected,
      title: 'PROFIL'
    },
    {
      id: 2,
      href: '?#tabTwo=true',
      isSelected: isTabTwoSelected,
      title: 'CATATAN MEDIS'
    },
    {
      id: 3,
      href: '?#tabThree=true',
      isSelected: isTabThreeSelected,
      title: 'DATA LABORATORIUM'
    }
  ]

  const tabsChildData = [
    {
      id: 1,
      href: '?#tabTwo=semua',
      isSelected: isTabOneSelected,
      title: 'Semua'
    },
    {
      id: 2,
      href: '?#tabTwo=catatan-dokter',
      isSelected: isTabTwoSelected,
      title: 'Catatan Dokter'
    },
    {
      id: 3,
      href: '?#tabTwo=diari-orang-tua',
      isSelected: isTabThreeSelected,
      title: 'Diari Orang Tua'
    }
  ]
  const handleClickOutside = () => {
    setIsShowSubmenu(false)
  }

  const [ousideContent, setOutsideContent] = useState<boolean>(false)
  const handleClickOutsideContent = () => {
    setOutsideContent(true)
    dispatch(setSearch(''))
    dispatch(setLimit(5))
  }

  const ref = useOutsideClick(handleClickOutside)
  const contentRef = useOutsideClick(handleClickOutsideContent)
  const { isShowModal, message, href } = useAppSelector(
    (state) => state.dataModals
  )
  const [activeTab, setActiveTab] = useState<number>(1)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [activeChildTab, setActiveChildTab] = useState<number>(1)
  const [isShowSubmenu, setIsShowSubmenu] = useState<boolean>(false)
  const { patientProfile, patientDiagnosis, medicalHistory, laboratoryData } =
    useAppSelector((state) => state.patientDetail)
  const lastVisit = patientProfile?.cdic?.lastVisit?.split(',')
  const { auth } = useAppSelector((state) => state.auth)
  const { search, limit, page } = useAppSelector((state) => state.paginations)
  const getActiveTab = (activeTab: number) => {
    setActiveTab(activeTab)
    if (activeTab === 2) {
      setShowModal(isShowModal)
    }
  }
  const getActiveChildTab = (tab: number) => {
    setActiveChildTab(tab)
    if (tab === 2) {
      dispatch(setSearch(filterMedicalHistory.doctorNote))
    } else if (tab === 3) {
      dispatch(setSearch(filterMedicalHistory.parentDiary))
    } else {
      dispatch(setSearch(''))
    }
  }

  const dobDiff = useMemo(
    () => monthDiff(patientProfile?.cdic?.child?.dateOfBirth),
    [patientProfile?.cdic?.child?.dateOfBirth]
  )

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const options: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0
  }

  const cb = (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => {
    const [entry] = entries
    setIsVisible(entry?.isIntersecting)
    if (entry?.isIntersecting && activeTab === 1) {
      observer.unobserve(containerRef.current)
    }
  }

  const paramFilterMedicalHistory: IMedicalHistoryParamReq = {
    search,
    limit,
    page
  }

  const bodyReq = {
    childId,
    parentId
  }

  useEffect(() => {
    const observer = new IntersectionObserver(cb, options)
    if (containerRef.current) observer.observe(containerRef.current)

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current)
      // void dispatch(resetPatientDiagnosis())
    }
  }, [containerRef])

  useEffect(() => {
    if (activeTab === 1) {
      if (!router.isReady) return
      setOutsideContent(false)
      void dispatch(getPatientProfile(childId))
    } else if (activeTab === 2 && !ousideContent) {
      dispatch(setLimit(50))
      void dispatch(getMedicalHistory({ paramFilterMedicalHistory, bodyReq }))
    } else if (activeTab === 3) {
      setOutsideContent(false)
      dispatch(setSearch(''))
      void dispatch(getLaboratoryData({ paramFilterMedicalHistory, bodyReq }))
    }
  }, [dispatch, childId, activeTab, search, limit, page, ousideContent])

  useEffect(() => {
    if (isVisible) {
      void dispatch(getPatientDiagnosis(cdicId))
    }
  }, [isVisible, cdicId])

  const [breadcrumbs] = useBreadcrumbs(router)

  return (
    <>
      <Header showBreadcrumb={true} dataBreadcrumbs={breadcrumbs}>
        <div className="pt-[10px] flex flex-col">
          <h1 className="lg:text-[35px] xl:text-[40px] text-white font-bold">
            {patientProfile?.cdic?.child?.name}
          </h1>
          <p className="text-base text-white font-normal -mt-1">
            {patientProfile?.cdic?.child?.gender} - {dobDiff}
          </p>
        </div>
      </Header>
      <div className="mb-20">
        <Card>
          <Tabs data={tabsData} onClick={getActiveTab} />
          {activeTab === 1 && (
            <div className="py-6">
              {patientProfile?.loading ? (
                <div className="flex items-center justify-center">
                  <div className="flex justify-center items-center px-4 py-2 font-semibold text-sm text-primary transition ease-in-out duration-150 cursor-not-allowed h-[850px] w-[512px]">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </div>
                </div>
              ) : (
                <>
                  <div className="border-b-2 border-b-slate-200">
                    <div className="grid lg:grid-cols-2 xl:grid-cols-3 items-center">
                      <div className="col-span-1">
                        <label className="block pl-6 pb-6 w-full">
                          <div className="grid grid-cols-2 items-center xl:gap-10">
                            <span className="text-neutral-400">
                              Tanggal Terhubung
                            </span>
                            <div className="w-64 text-gray-500">
                              <span>
                                {formatDateLong(patientProfile?.createdAt)}
                              </span>
                            </div>
                          </div>
                        </label>
                        <label className="block pl-6 pb-6 w-full">
                          <div className="grid grid-cols-2 items-center xl:gap-10">
                            <span className="text-neutral-400">
                              Registry ID
                            </span>
                            <div className="w-64 text-gray-500">
                              <span>{patientProfile?.id}</span>
                            </div>
                          </div>
                        </label>
                        <label className="block pl-6 pb-6 w-full">
                          <div className="grid grid-cols-2 items-center xl:gap-10">
                            <span className="text-neutral-400">
                              Pemilik Akun PrimaKu
                            </span>
                            <div className="w-64 text-gray-500">
                              <span>{patientProfile?.cdic?.parent?.name}</span>
                            </div>
                          </div>
                        </label>
                        <label className="block pl-6 pb-6 w-full">
                          <div className="grid grid-cols-2 items-center xl:gap-10">
                            <span className="text-neutral-400">
                              No Handphone
                            </span>
                            <div className="w-64 text-gray-500">
                              <span>
                                {patientProfile?.cdic?.fatherPhone !== ''
                                  ? patientProfile?.cdic?.fatherPhone
                                  : patientProfile?.cdic?.motherPhone}
                              </span>
                            </div>
                          </div>
                        </label>
                        <label className="block pl-6 pb-6 w-full">
                          <div className="grid grid-cols-2 items-center xl:gap-10">
                            <span className="text-neutral-400">Email</span>
                            <div className="w-64 text-gray-500">
                              <span>{patientProfile?.cdic?.parent?.email}</span>
                            </div>
                          </div>
                        </label>
                        <label className="block pl-6 pb-6 w-full">
                          <div className="grid grid-cols-2 items-center xl:gap-10">
                            <span className="text-neutral-400">Alamat</span>
                            <div className="w-64 text-gray-500">
                              <span>{patientProfile?.cdic?.address}</span>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="border-b-2 border-b-slate-200">
                    <div className="p-6 flex justify-between items-center">
                      <h3 className="text-xl font-bold">Detail Pasien</h3>
                    </div>
                    <div className="grid lg:grid-cols-2 xl:grid-cols-3">
                      <div className="col-span-1">
                        <label className="block pl-6 pb-6 w-full">
                          <div className="grid grid-cols-2 items-center xl:gap-10">
                            <span className="text-neutral-400">
                              Nama Pasien
                            </span>
                            <div className="w-64 text-gray-500">
                              <span>{patientProfile?.cdic?.child?.name}</span>
                            </div>
                          </div>
                        </label>
                        <label className="block pl-6 pb-6 w-full">
                          <div className="grid grid-cols-2 items-center xl:gap-10">
                            <span className="text-neutral-400">
                              Tanggal Lahir
                            </span>
                            <div className="w-64 text-gray-500">
                              <span>
                                {formatDateLong(
                                  patientProfile?.cdic?.child?.dateOfBirth
                                )}
                              </span>
                            </div>
                          </div>
                        </label>
                        <label className="block pl-6 pb-6 w-full">
                          <div className="grid grid-cols-2 items-center xl:gap-10">
                            <span className="text-neutral-400">
                              Jenis Kelamin
                            </span>
                            <div className="w-64 text-gray-500">
                              <span>{patientProfile?.cdic?.child?.gender}</span>
                            </div>
                          </div>
                        </label>
                        <label className="block pl-6 pb-6 w-full">
                          <div className="grid grid-cols-2 items-center xl:gap-10">
                            <span className="text-neutral-400">
                              Usia Terdiagnosis
                            </span>
                            <div className="w-64 text-gray-500">
                              <span>{dobDiff}</span>
                            </div>
                          </div>
                        </label>
                        <label className="block pl-6 pb-6 w-full">
                          <div className="grid grid-cols-2 items-center xl:gap-10">
                            <span className="text-neutral-400">
                              No Handphone Anak
                            </span>
                            <div className="w-64 text-gray-500">
                              <span>{patientProfile?.cdic?.child?.gender}</span>
                            </div>
                          </div>
                        </label>
                        <label className="block pl-6 pb-6 w-full">
                          <div className="grid grid-cols-2 items-center xl:gap-10">
                            <span className="text-neutral-400">
                              Jenis Pembiayaan
                            </span>
                            <div className="w-64 text-gray-500">
                              <span>{patientProfile?.cdic?.financingType}</span>
                            </div>
                          </div>
                        </label>
                        <label className="block pl-6 pb-6 w-full">
                          <div className="grid grid-cols-2 items-center xl:gap-10">
                            <span className="text-neutral-400">
                              Riwayat Diabetes Melitus
                            </span>
                            <div className="w-64 text-gray-500">
                              <span>Ya</span>
                            </div>
                          </div>
                        </label>
                        <label className="block pl-6 pb-6 w-full">
                          <div className="grid grid-cols-2 items-center xl:gap-10">
                            <span className="text-neutral-400">
                              Yang Memiliki Riwayat
                            </span>
                            <div className="w-64 text-gray-500">
                              <span>Ayah</span>
                            </div>
                          </div>
                        </label>
                      </div>
                      {/* <div className="col-span-1">
                        <label className="block pl-6 pb-6 w-full">
                          <div className="grid grid-cols-3">
                            <span className="text-neutral-400">
                              Kunjungan 12 Bulan Terakhir
                            </span>
                            <label className="col-span-2 block pl-6 pb-6 w-full">
                              {lastVisit?.map((value, index) => (
                                <CustomCheckbox
                                  key={index}
                                  value={value}
                                  label={value}
                                  checked={true}
                                  isDisabled={true}
                                />
                              ))}
                            </label>
                          </div>
                        </label>
                      </div> */}
                    </div>
                  </div>
                  <div className="grid lg:grid-cols-2 xl:grid-cols-3">
                    <div className="col-span-1">
                      <div className="p-6 flex justify-between items-center">
                        <h3 className="text-base font-bold">Profil Ayah</h3>
                      </div>
                      <label className="block pl-6 pb-6 w-full">
                        <div className="grid grid-cols-2 items-center xl:gap-10">
                          <span className="text-neutral-400">Nama Ayah</span>
                          <div className="w-64 text-gray-500">
                            <p className="w-44 truncate">
                              {patientProfile?.cdic?.fatherName}
                            </p>
                          </div>
                        </div>
                      </label>
                      <label className="block pl-6 pb-6 w-full">
                        <div className="grid grid-cols-2 items-center xl:gap-10">
                          <span className="text-neutral-400">Etnis</span>
                          <div className="w-64 text-gray-500">
                            <p className="w-44 truncate">
                              {patientProfile?.cdic?.fatherEthnic}
                            </p>
                          </div>
                        </div>
                      </label>
                      <label className="block pl-6 pb-6 w-full">
                        <div className="grid grid-cols-2 items-center xl:gap-10">
                          <span className="text-neutral-400">
                            Pendidikan Akhir
                          </span>
                          <div className="w-64 text-gray-500">
                            <span>
                              {patientProfile?.cdic?.fatherLastEducation}
                            </span>
                          </div>
                        </div>
                      </label>
                      <label className="block pl-6 pb-6 w-full">
                        <div className="grid grid-cols-2 items-center xl:gap-10">
                          <span className="text-neutral-400">No Handphone</span>
                          <div className="w-64 text-gray-500">
                            <span>{patientProfile?.cdic?.fatherPhone}</span>
                          </div>
                        </div>
                      </label>
                    </div>
                    <div className="col-span-1">
                      <div className="p-6 flex justify-between items-center">
                        <h3 className="text-base font-bold">Profil Ibu</h3>
                      </div>
                      <label className="block pl-6 pb-6 w-full">
                        <div className="grid grid-cols-2 items-center xl:gap-10">
                          <span className="text-neutral-400">Nama Ibu</span>
                          <div className="w-64 text-gray-500">
                            <span>{patientProfile?.cdic?.motherName}</span>
                          </div>
                        </div>
                      </label>
                      <label className="block pl-6 pb-6 w-full">
                        <div className="grid grid-cols-2 items-center xl:gap-10">
                          <span className="text-neutral-400">Etnis</span>
                          <div className="w-64 text-gray-500">
                            <span>{patientProfile?.cdic?.motherEthnic}</span>
                          </div>
                        </div>
                      </label>
                      <label className="block pl-6 pb-6 w-full">
                        <div className="grid grid-cols-2 items-center xl:gap-10">
                          <span className="text-neutral-400">
                            Pendidikan Akhir
                          </span>
                          <div className="w-64 text-gray-500">
                            <span>
                              {patientProfile?.cdic?.motherLastEducation}
                            </span>
                          </div>
                        </div>
                      </label>
                      <label className="block pl-6 pb-6 w-full">
                        <div className="grid grid-cols-2 items-center xl:gap-10">
                          <span className="text-neutral-400">No Handphone</span>
                          <div className="w-64 text-gray-500">
                            <span>{patientProfile?.cdic?.motherPhone}</span>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          {activeTab === 2 && (
            <>
              <div className="bg-[#E9ECEF]">
                <div className="pt-4 flex justify-between items-baseline mx-5">
                  <div
                    className="flex justify-between items-baseline gap-x-4"
                    ref={contentRef}
                  >
                    {tabsChildData?.map((tab, idx) => (
                      <li
                        key={`tab-${tab.title}-${tab.id}-${idx}`}
                        className="-mb-px mr-2 last:mr-0 flex-auto text-center list-none"
                      >
                        <a
                          data-toggle="tab"
                          role="tablist"
                          className={clsx(
                            'text-base lg:w-36 xl:w-44 py-3 rounded-lg block leading-normal cursor-pointer',
                            activeChildTab !== idx + 1
                              ? 'text-neutral-500 bg-white border-2 border-gray-300'
                              : 'text-primary bg-secondary border-2 border-primary font-semibold'
                          )}
                          onClick={() => getActiveChildTab(idx + 1)}
                        >
                          {tab.title}
                        </a>
                      </li>
                    ))}
                  </div>
                  <div ref={ref} className="relative">
                    <BaseButton
                      id="button-tambah-data"
                      type="button"
                      size="md"
                      variant="primary"
                      onClick={() => setIsShowSubmenu(!isShowSubmenu)}
                    >
                      + Tambah Data
                    </BaseButton>
                    {isShowSubmenu && (
                      <div className="absolute right-0 mt-3 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y">
                        <Link
                          href={{
                            pathname:
                              '/data-pasien/detail-pasien/tambah-data-pemeriksaan',
                            query: {
                              cdicId: query.cdicId,
                              parentId: query.parentId,
                              childId: query.childId,
                              type: 'add'
                            }
                          }}
                          passHref
                        >
                          <div className="block px-4 py-2 text-sm text-gray-600 font-bold hover:bg-slate-200 cursor-pointer">
                            Data Pemeriksaan
                          </div>
                        </Link>
                        <Link
                          href={{
                            pathname:
                              '/data-pasien/detail-pasien/tambah-data-terapi',
                            query: {
                              cdicId: query.cdicId,
                              parentId: query.parentId,
                              childId: query.childId,
                              type: 'add'
                            }
                          }}
                          passHref
                        >
                          <div className="block px-4 py-2 text-sm text-gray-600 font-bold hover:bg-slate-200 cursor-pointer">
                            Data Terapi
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                {medicalHistory?.loading ? (
                  <div className="bg-white flex items-center justify-center">
                    <div className="flex justify-center items-center px-4 py-2 font-semibold text-sm text-primary transition ease-in-out duration-150 cursor-not-allowed h-96 w-96">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </div>
                  </div>
                ) : (
                  <>
                    {medicalHistory?.data?.length === 0 && (
                      <div className="my-16 text-center text-primaku-grey">
                        <p>Belum ada Data yang ditambahkan</p>
                      </div>
                    )}
                    <div className="mt-8 pb-20 flex flex-col gap-y-5">
                      {medicalHistory?.data?.map((item, index) => (
                        <Snackbar
                          key={index}
                          id={item.id}
                          pediatricianId={item.pediatricianId}
                          textDate={item.date}
                          textTitle={item.type}
                          textMessage={item.result}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </Card>
      </div>
      {activeTab === 1 && (
        <div ref={containerRef as React.RefObject<HTMLDivElement>}>
          <Card>
            <div className="py-6">
              <div className="pb-6 px-5 flex justify-between items-center">
                <h3 className="text-xl font-bold">Diagnosis Awal</h3>
                {!patientDiagnosis?.loading && (
                  <div>
                    <Link
                      href={{
                        pathname:
                          '/data-pasien/detail-pasien/tambah-diagnosis-awal',
                        query: {
                          cdicId: query.cdicId,
                          parentId: query.parentId,
                          childId: query.childId,
                          dob: patientProfile?.cdic?.child?.dateOfBirth,
                          type: patientDiagnosis.errorMessage ? 'add' : 'edit'
                        }
                      }}
                      passHref
                    >
                      <BaseButton
                        id="button-tambah-diagnosis"
                        type="button"
                        size="md"
                        variant="primary"
                      >
                        {patientDiagnosis.errorMessage
                          ? '+ Tambah Diagnosis'
                          : 'Edit'}
                      </BaseButton>
                    </Link>
                  </div>
                )}
              </div>
              {patientDiagnosis?.loading && (
                <div className="flex items-center justify-center">
                  <div className="flex justify-center items-center px-4 py-2 font-semibold text-sm text-primary transition ease-in-out duration-150 cursor-not-allowed h-40 w-40">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </div>
                </div>
              )}
              {patientDiagnosis?.diagnosisDate && !patientDiagnosis?.loading && (
                <div className="grid grid-cols-3">
                  <div className="col-span-1">
                    <label className="block pl-6 pb-6 w-full">
                      <div className="grid grid-cols-2 items-center xl:gap-10">
                        <span className="text-neutral-400">
                          Tanggal Diagnosis
                        </span>
                        <div className="w-64 text-gray-500">
                          <span>
                            {formatDateLong(patientDiagnosis?.diagnosisDate)}
                          </span>
                        </div>
                      </div>
                    </label>
                    <label className="block pl-6 pb-6 w-full">
                      <div className="grid grid-cols-2 items-center xl:gap-10">
                        <span className="text-neutral-400">
                          Usia saat Terdiagnosis
                        </span>
                        <div className="w-64 text-gray-500">
                          <span>{dobDiff}</span>
                        </div>
                      </div>
                    </label>
                    <label className="block pl-6 pb-6 w-full">
                      <div className="grid grid-cols-2 items-center xl:gap-10">
                        <span className="text-neutral-400">Nama Dokter</span>
                        <div className="w-64 text-gray-500">
                          <span>{auth.name}</span>
                        </div>
                      </div>
                    </label>
                    <label className="block pl-6 pb-6 w-full">
                      <div className="grid grid-cols-2 items-center xl:gap-10">
                        <span className="text-neutral-400">
                          Faskes untuk Kontrol
                        </span>
                        <div className="w-full text-gray-500">
                          <p className="break-words">
                            {patientDiagnosis?.faskes
                              ? patientDiagnosis?.faskes
                              : '-'}
                          </p>
                        </div>
                      </div>
                    </label>
                    <label className="block pl-6 pb-6 w-full">
                      <div className="grid grid-cols-2 items-center xl:gap-10">
                        <span className="text-neutral-400">
                          Komorbid Lainnya
                        </span>
                        <div className="w-64 text-gray-500">
                          <p className="break-words">
                            {patientDiagnosis?.othersKomorbid
                              ? patientDiagnosis?.othersKomorbid
                              : '-'}
                          </p>
                        </div>
                      </div>
                    </label>
                    <label className="block pl-6 pb-6 w-full">
                      <div className="grid grid-cols-2 items-center xl:gap-10">
                        <span className="text-neutral-400">
                          Catatan Dasar Diagnosis
                        </span>
                        <div className="w-64 text-gray-500">
                          <span>
                            {patientDiagnosis?.diagnosisBasicNote
                              ? patientDiagnosis?.diagnosisBasicNote
                              : '-'}
                          </span>
                        </div>
                      </div>
                    </label>
                  </div>
                  <div className="col-span-2">
                    <label className="block pl-16 pb-6 w-full">
                      <div className="grid grid-cols-5">
                        <span className="col-span-2 text-neutral-400">
                          HbA1C Awal
                        </span>
                        <div className="col-span-3 w-64 text-gray-500">
                          <span>
                            {patientDiagnosis?.diagnosisBasicNote
                              ? patientDiagnosis?.diagnosisBasicNote
                              : '-'}
                          </span>
                        </div>
                      </div>
                    </label>
                    {lastVisit?.length > 0 && (
                      <label className="block pl-16 pb-6 w-full">
                        <div className="grid grid-cols-5">
                          <span className="col-span-2 text-neutral-400">
                            Kunjungan 12 Bulan Terakhir
                          </span>
                          <label className="col-span-3 block pb-6 w-full">
                            {lastVisit?.map((value, index) => (
                              <CustomCheckbox
                                key={index}
                                value={value}
                                label={value}
                                checked={true}
                                isDisabled={true}
                              />
                            ))}
                          </label>
                        </div>
                      </label>
                    )}
                    {patientDiagnosis?.clinicalDiagnosisBasic.length > 0 && (
                      <label className="block pl-16 pb-6 w-full">
                        <div className="grid grid-cols-5">
                          <span className="col-span-2 text-neutral-400">
                            Dasar Diagnosis Klinis
                          </span>
                          <label className="block col-span-3 pb-6 w-full">
                            {patientDiagnosis?.clinicalDiagnosisBasic.map(
                              (item, index) => (
                                <CustomCheckbox
                                  key={`clinical-diagnosis-${index}`}
                                  value={item}
                                  label={item}
                                  checked={true}
                                  isDisabled={true}
                                />
                              )
                            )}
                          </label>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              )}
              {patientDiagnosis?.errorMessage && !patientDiagnosis?.loading && (
                <div className="my-16 text-center text-primaku-grey">
                  <p>Belum ada Data diagnosis awal yang ditambahkan</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
      {activeTab === 3 && (
        <div>
          <Card>
            <Datatable
              link="/data-pasien/detail-pasien"
              tableData={laboratoryData.data}
              tableColumn={tableColumn}
              loading={laboratoryData.loading}
              tableCategory="penunjang-lain"
              tableName="Data Penunjang Lain"
              actions=""
              dataCount={laboratoryData.count}
            />
          </Card>
        </div>
      )}
      {activeTab === 2 && (
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          yOffset="200px"
          maxWidth="max-w-xs"
        >
          <div className="">
            <h3 className="text-lg font-bold">{message} Berhasil Ditambah</h3>
            <p className="pt-2 text-base">
              Apakah anda ingin melanjutkan menambah{' '}
              {message === 'Data Pemeriksaan'
                ? 'Data Terapi'
                : 'Data Pemeriksaan'}
              ?
            </p>
            <div className="pt-5 space-x-2">
              <BaseButton
                id="later-button"
                type="button"
                size="lg"
                variant="gray"
                onClick={() => dispatch(setIsShowModal())}
              >
                Nanti Saja
              </BaseButton>
              <Link href={href} passHref>
                <BaseButton
                  id="continue-button"
                  type="button"
                  size="lg"
                  variant="primary"
                >
                  Iya, Lanjutkan
                </BaseButton>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default DetailPasien
