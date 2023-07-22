import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import Header from '@/src/components/Header/Header'
import BaseButton from '@/src/components/Button/BaseButton'
import Datatable from '@/src/components/Datatable'
import Card from '@/src/components/Card'
import Modal from '@/src/components/Modal'
import Icon from '@/src/components/Icons'
import { iconVariants } from '@/src/constants/constants'
import { useAppDispatch, useAppSelector } from '@/src/hooks/useStore'
import { getPatientsList } from './patientsSlice'

const tableColumn = [
  'REGISTRY ID',
  'NAMA PASIEN',
  'JENIS KELAMIN',
  'TANGGAL LAHIR',
  'NAMA ORANG TUA',
  'ACTION'
]

const DataPasien = () => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showModalBarcode, setShowModalBarcode] = useState<boolean>(false)
  const [srcQRCode, setSrcQRCode] = useState<string>('')
  const { patients, loading } = useAppSelector((state) => state.patients)
  const { search, limit, page } = useAppSelector((state) => state.paginations)

  const { auth } = useAppSelector((state) => state.auth)
  useEffect(() => {
    if (auth.name !== '') {
      void dispatch(getPatientsList({ search, limit, page }))
    }
  }, [dispatch, page, limit, auth])

  const handleShowQRCode = (): void => {
    setShowModalBarcode(true)
    const data = {
      id: auth.id,
      name: auth.name
    }
    void QRCode.toDataURL(JSON.stringify(data)).then((res: string) => {
      setSrcQRCode(res)
    })
    setTimeout(() => {
      setShowModalBarcode(false)
      void dispatch(getPatientsList({ search, limit, page }))
    }, 4000)
  }

  return (
    <>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        yOffset="200px"
        maxWidth="max-w-xs"
      >
        <div className="flex justify-between px-2">
          <p className="text-lg font-bold">Tambah Pasien</p>
          <span
            className="cursor-pointer"
            onClick={() => setShowModal(!showModal)}
          >
            &#x2715;
          </span>
        </div>
        <div
          className="mt-3 flex justify-center items-center gap-x-2"
          onClick={() => handleShowQRCode()}
        >
          <div className="py-5 px-11 bg-secondary flex flex-col items-center rounded-md">
            <div>
              <Icon
                select={iconVariants.qr}
                onClick={() => handleShowQRCode()}
              />
            </div>
            <p className="mt-3 w-36 text-base font-semibold">
              Tambah dengan QR CODE
            </p>
          </div>
          {/* <div className="py-5 px-11 bg-secondary flex flex-col items-center rounded-md">
            <div>
              <Icon select={iconVariants.phone} />
            </div>
            <p className="mt-3 w-36 text-base font-semibold">
              Tambah dengan No handphone
            </p>
          </div> */}
        </div>
      </Modal>
      <Modal
        showModal={showModalBarcode}
        setShowModal={setShowModalBarcode}
        yOffset="10vh"
      >
        <div className="mb-10">
          <div className="px-2 flex justify-between items-center">
            <div className="flex items-center gap-x-3">
              <Icon
                select={iconVariants.arrow}
                size="18"
                onClick={() => setShowModal(true)}
              />
              <p className="text-lg font-bold">Tambah dengan QR CODE</p>
            </div>
            <span
              className="cursor-pointer"
              onClick={() => setShowModalBarcode(!showModalBarcode)}
            >
              &#x2715;
            </span>
          </div>
          <div className="mt-12 flex flex-col items-center gap-y-3">
            <img src={srcQRCode} alt="barcode" width={280} height={280} />
            <p className="w-64 text-base font-semibold">
              Tunjukkan QR Code kepada calon pasien untuk menghubungkan akun
              pasien
            </p>
          </div>
        </div>
      </Modal>
      <Header>
        <div className="md:pt-[18px] lg:pt-[35px] xl:pt-[57px] flex justify-between">
          <h1 className="lg:text-[35px] xl:text-[40px] text-white font-bold">
            Daftar Pasien
          </h1>
          <div className="mt-10">
            <BaseButton
              id="button-tambah-pasien"
              type="button"
              size="lg"
              variant="secondary"
              onClick={() => setShowModal(true)}
            >
              + Tambah Pasien
            </BaseButton>
          </div>
        </div>
      </Header>
      <Card>
        <Datatable
          link="/data-pasien/detail-pasien"
          tableData={patients.data}
          tableColumn={tableColumn}
          loading={loading}
          tableCategory="daftar-pasien"
          actions="apply, search"
          dataCount={patients.count}
        />
      </Card>
    </>
  )
}

export default DataPasien
