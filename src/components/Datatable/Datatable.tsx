/* eslint-disable prettier/prettier */
// import Image from 'next/image'
import { useState, useEffect, useMemo, ChangeEvent, FormEvent } from 'react'
import ReactPaginate from 'react-paginate'
import clsx from 'clsx'
import Link from 'next/link'
import Image from 'next/image'
import BaseButton from '@/src/components/Button/'
import Icon from '@/src/components/Icons/Icon'
import CustomInput from '@/src/components/CustomInput'
import Modal from '@/src/components/Modal'
import { iconVariants } from '@/src/constants/constants'
import { useAppDispatch, useAppSelector } from '@/src/hooks/useStore'
import {
  setPageCount,
  setLimit,
  setSearch,
  setCurrentPage
} from './paginationSlice'
import {
  formatDateLong,
  formatDateOption
} from '@/src/utils/formaters/dateFormat'
import {
  getPatientsList,
  Datum
} from '@/src/features/data_pasien/patientsSlice'
import { fetchLaboratoryDetail } from '@/src/features/api/laboratory'
import { ILaboratoryDetailResponse } from '@/src/features/api/laboratory/types'
import { handleErrorTracking } from '@/src/utils/error-tracking-handler/errorTracking'

interface IEvent {
  selected?: number
}
interface IDatatableProps {
  link?: string
  tableCategory?: string
  tableData?: Datum[]
  tableColumn?: string[]
  actions?: string
  tableName?: string
  dataCount?: number
  loading?: boolean
}

const Datatable: React.FC<IDatatableProps> = ({
  link,
  tableCategory,
  tableData,
  tableColumn,
  actions,
  tableName,
  dataCount,
  loading
}) => {
  const dispatch = useAppDispatch()
  const { search, limit, totalPage, page } = useAppSelector(
    (state) => state.paginations
  )
  const [startNumber, setStartNumber] = useState<number>(0)
  const handlePageClick = (event: IEvent): void => {
    setStartNumber((page - 1) * limit)
    dispatch(setCurrentPage(event.selected))
  }

  const handlePageLimit = (e: ChangeEvent<HTMLSelectElement>): void => {
    dispatch(setLimit(+e.target.value))
    dispatch(setCurrentPage(0))
  }

  const handleSearchInput = (val: HTMLInputElement): void => {
    if (val.value.length === 0) {
      dispatch(setSearch(''))
      dispatch(setCurrentPage(0))
      void dispatch(getPatientsList({ search, limit, page }))
    } else {
      dispatch(setCurrentPage(0))
      dispatch(setSearch(val.value))
    }
  }

  const actionsArray = useMemo(() => {
    return actions.split(',').map((action) => action.trim().toLowerCase())
  }, [actions])

  const showAction = (action: string): boolean => {
    if (!action) {
      return false
    }
    return actionsArray.includes(action)
  }

  const handleEndNumber = (): number => {
    const end = startNumber + limit
    return dataCount < end ? dataCount : end
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void dispatch(getPatientsList({ search, limit, page }))
  }

  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalDate, setModalDate] = useState<string>('')
  const [childImage, setChildImage] = useState<string>('')
  const [labImage, setLabImage] = useState<string>('')
  const [modalName, setModalName] = useState<string>('')
  const [showModalImage, setShowModalImage] = useState<boolean>(false)
  const [examinationResult, setExaminationResult] = useState<string>('')
  const handleClickAction = async (id: number, type: string, data: Datum) => {
    await handleGetLaboratoryDetail(id, type)
    setModalDate(formatDateOption(data.entryDate))
    setShowModal(true)
  }

  const [modalDetailImageType, setModalDetailImageType] = useState<string>('')
  const handleShowModalImage = (type: string) => {
    setShowModalImage(true)
    setModalDetailImageType(type)
  }

  const handleGetLaboratoryDetail = async (id: number, type: string) => {
    try {
      const response: ILaboratoryDetailResponse = await fetchLaboratoryDetail({
        id,
        type
      })
      if (response) {
        if (response.childImage1) {
          setChildImage(response.childImage1)
          setLabImage(response.labImage1)
        } else if (response.examinationResult) {
          setExaminationResult(response.examinationResult)
        }
        setModalName(type)
      }
    } catch (error) {
      const { message } = error as Error
      handleErrorTracking('', message)
    }
  }

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

  useEffect(() => {
    setStartNumber(page * limit)
    dispatch(setPageCount(dataCount))
  }, [dataCount, page, limit])

  return (
    <>
      {tableCategory === 'penunjang-lain' && (
        <>
          <Modal
            showModal={showModal}
            setShowModal={setShowModal}
            yOffset="200px"
            maxWidth="max-w-lg"
          >
            <div className="flex justify-between px-2 pb-2">
              <span className="text-lg font-bold">{modalName}</span>
              <div className="flex gap-x-5">
                <p>{modalDate}</p>
                <span
                  className="cursor-pointer"
                  onClick={() => setShowModal(!showModal)}
                >
                  &#x2715;
                </span>
              </div>
            </div>
            {modalName === 'Foto Lab' && (
              <div className="py-4 flex px-5 gap-x-3">
                <div className="flex flex-col items-center gap-y-2">
                  <figure className="h-[100px] w-[100px] overflow-hidden">
                    {childImage !== null ? (
                      <Image
                        loader={myLoader}
                        src={childImage}
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
                  </figure>
                  <span>Foto Anak</span>
                </div>
                <div className="flex flex-col items-center gap-y-2">
                  <figure className="h-[100px] w-[100px] overflow-hidden">
                    {labImage !== null ? (
                      <Image
                        loader={myLoader}
                        src={labImage}
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
                  </figure>
                  <span>Foto Lab</span>
                </div>
              </div>
            )}
            {modalName === 'Temuan Lainnya' && (
              <p className="text-left px-2">{examinationResult}</p>
            )}
          </Modal>
          <Modal
            showModal={showModalImage}
            setShowModal={setShowModalImage}
            yOffset="100px"
          >
            <div className="px-2 flex justify-between items-center">
              <div className="flex items-center gap-x-3">
                <Icon
                  select={iconVariants.arrow}
                  size="18"
                  onClick={() => setShowModal(true)}
                />
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
                  modalDetailImageType === 'Foto Anak' ? childImage : labImage
                }
                width={400}
                height={400}
                objectFit="cover"
              />
            </div>
          </Modal>
        </>
      )}
      <div className="px-6 py-5">
        <div className="">
          {tableName && <h1 className="text-2xl font-bold">{tableName}</h1>}
          <form
            className="flex justify-between items-center"
            onSubmit={(e) => handleSubmit(e)}
          >
            {showAction('search') && (
              <div className="flex flex-wrap items-center gap-x-3">
                <label htmlFor="input-search" className="block">
                  <div className="relative px-2 md:w-24 lg:w-40 xl:w-48">
                    <CustomInput
                      id="input-search-data"
                      placeholder="search data"
                      iconVariant={iconVariants.search}
                      onChangeInput={handleSearchInput}
                    />
                  </div>
                </label>
              </div>
            )}
            {showAction('apply') && (
              <div className="flex flex-wrap justify-center items-center gap-3">
                <BaseButton
                  id="button-apply"
                  type="submit"
                  size="lg"
                  variant="primary"
                >
                  Apply
                </BaseButton>
              </div>
            )}
          </form>
        </div>
      </div>
      <div className="flex flex-col">
        <div
          className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative z-0"
          style={{ maxHeight: 'calc(100vh - 200px)' }}
        >
          <table className="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative">
            <thead>
              <tr className="text-left">
                {tableColumn?.map((column, index) => (
                  <th
                    key={index}
                    className="bg-secondary sticky top-0 border-b border-gray-200 px-6 py-2 text-gray-400 font-bold tracking-wider uppercase lg:text-[10px] xl:text-xs z-10"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading &&
                tableData?.map((data, indx) => (
                  <tr
                    key={`loading-${indx}`}
                    className={clsx(
                      'animate-pulse',
                      indx % 2 !== 0 ? 'bg-gray-100' : 'bg-white'
                    )}
                  >
                    {tableColumn?.map((item, inxx) => (
                      <td
                        key={`fields-${inxx}`}
                        id={`fields-${inxx}`}
                        className="border-solid border-t border-gray-200"
                      >
                        <span className="text-gray-700 px-6 py-3 flex items-center">
                          <div
                            className={clsx(
                              'h-3 bg-slate-400 rounded-md',
                              tableColumn.length - 1 === inxx
                                ? 'w-5 h-5'
                                : 'w-28'
                            )}
                          />
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              {tableCategory === 'daftar-pasien' && !loading && (
                <>
                  {tableData?.map((data: Datum, index: number) => (
                    <tr
                      key={`pasien-${index}`}
                      className={clsx(
                        'lg:text-xs xl:text-[15px]',
                        index % 2 !== 0 ? 'bg-gray-100' : 'bg-white'
                      )}
                    >
                      <td className="border-solid border-t border-gray-200">
                        <p className="text-gray-700 px-6 py-3 items-center">
                          {data.cdic.child.id}
                        </p>
                      </td>
                      <td className="border-solid border-t border-gray-200">
                        <p className="text-gray-700 px-6 py-3 flex items-center">
                          {data.cdic.child.name}
                        </p>
                      </td>
                      <td className="border-solid border-t border-gray-200">
                        <p className="text-gray-700 px-6 py-3 flex items-center">
                          {data.cdic.child.gender}
                        </p>
                      </td>
                      <td className="border-solid border-t border-gray-200">
                        <p className="text-gray-700 px-6 py-3 flex items-center">
                          {formatDateLong(data.cdic.child.dateOfBirth)}
                        </p>
                      </td>
                      <td className="border-solid border-t border-gray-200">
                        <p className="text-gray-700 px-6 py-3 flex items-center">
                          {data.cdic.fatherName !== ''
                            ? data.cdic.fatherName
                            : data.cdic.motherName}
                        </p>
                      </td>
                      <td className="border-solid border-t border-gray-200 phoneNumber">
                        <span className="text-gray-700 px-6 py-3 flex items-center">
                          <Link
                            href={{
                              pathname: link,
                              query: {
                                cdicId: data.cdicId,
                                parentId: data.cdic.parent.id,
                                childId: data.cdic.child.id
                              }
                            }}
                            passHref
                          >
                            <BaseButton
                              id={`btn-edit-${data.id}`}
                              type="button"
                              key={`btn-${data.id}`}
                            >
                              <Icon select={iconVariants.edit} size="18" />
                            </BaseButton>
                          </Link>
                        </span>
                      </td>
                    </tr>
                  ))}
                </>
              )}
              {tableCategory === 'penunjang-lain' && !loading && (
                <>
                  {tableData?.map((data, index) => (
                    <tr
                      key={`pasien-${index}`}
                      className={clsx(
                        'lg:text-xs xl:text-[15px]',
                        index % 2 !== 0 ? 'bg-gray-100' : 'bg-white'
                      )}
                    >
                      <td className="border-solid border-t border-gray-200">
                        <p className="text-gray-700 px-6 py-3 flex items-center">
                          {formatDateOption(data.entryDate)}
                        </p>
                      </td>
                      <td className="border-solid border-t border-gray-200">
                        <p className="text-gray-700 px-6 py-3 flex items-center">
                          {data.type}
                        </p>
                      </td>
                      <td className="border-solid border-t border-gray-200">
                        <p className="text-gray-700 px-6 py-3 flex items-center">
                          {data.uploadedBy}
                        </p>
                      </td>
                      <td className="border-solid border-t border-gray-200 phoneNumber">
                        <span className="text-gray-700 px-6 py-3 flex items-center">
                          <BaseButton
                            id={`btn-edit-${data.id}`}
                            type="button"
                            key={`btn-${data.id}`}
                            onClick={async () =>
                              await handleClickAction(+data.id, data.type, data)
                            }
                          >
                            <Icon select={iconVariants.edit} size="18" />
                          </BaseButton>
                        </span>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8 pb-5 mx-0 px-[17px] flex justify-between items-center">
        <div className="flex items-center gap-x-4">
          <span className="lg:text-xs xl:text-base text-gray-400">
            Showing {startNumber + 1 < dataCount ? startNumber + 1 : dataCount}{' '}
            to {handleEndNumber()} of {dataCount} entries
          </span>
          <div>
            <span className="lg:text-xs xl:text-base text-gray-400 mr-2">
              Limit :
            </span>
            <select
              id="perPage"
              name="perPage"
              className="rounded-md border-gray-400 text-gray-500 lg:text-xs xl:text-base"
              value={limit}
              onChange={(event) => handlePageLimit(event)}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </div>
        </div>
        <div>
          <ReactPaginate
            className="flex items-center"
            forcePage={page}
            previousClassName="rounded-l-md border-r-0 border border-gray-400 text-primary px-4 py-1"
            nextClassName="rounded-r-md border-l-0 border border-gray-400 text-primary px-4 py-1"
            pageClassName="border border-gray-400 text-primary px-4 py-1"
            activeClassName="bg-primary"
            activeLinkClassName="text-white"
            breakLabel="..."
            nextLabel="Next"
            onPageChange={handlePageClick}
            pageRangeDisplayed={limit}
            pageCount={totalPage}
            previousLabel="Previous"
            renderOnZeroPageCount={null}
          />
        </div>
      </div>
    </>
  )
}

export default Datatable
