import clsx from 'clsx'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { formatDateOption } from '@/src/utils/formaters/dateFormat'

interface ISnackbardProps {
  textDate?: string
  textTitle?: string
  textMessage?: string
  pediatricianId?: string
  id?: string
}

const pemeriksaan = 'Pemeriksaan Dokter'
const terapi = 'Terapi'

const Snackbar: React.FC<ISnackbardProps> = ({
  textDate,
  textTitle,
  textMessage,
  id
}) => {
  const { query } = useRouter()
  const href = (type: string): string => {
    let url
    switch (type) {
      case pemeriksaan:
        url = `/data-pasien/detail-pasien/tambah-data-pemeriksaan?cdicId=${query.cdicId}&parentId=${query.parentId}&childId=${query.childId}&type=edit&id=${id}&group=${textTitle}`
        break
      case terapi:
        url = `/data-pasien/detail-pasien/tambah-data-terapi?cdicId=${query.cdicId}&parentId=${query.parentId}&childId=${query.childId}&type=edit&id=${id}&group=${textTitle}`
        break
      default:
        url = `/data-pasien/detail-pasien/detail-diari-orang-tua?cdicId=${query.cdicId}&parentId=${query.parentId}&childId=${query.childId}&id=${id}&group=${textTitle}`
        break
    }

    return url
  }

  return (
    <div className="mx-12 flex items-center text-center gap-x-4">
      <div
        className={clsx(
          'rounded-full w-5 h-5',
          textTitle === pemeriksaan
            ? 'bg-primary'
            : textTitle === terapi
            ? 'bg-green-500'
            : 'bg-orange-400'
        )}
      />
      <Link href={href(textTitle)}>
        <a className="w-full">
          <div className="py-5 pr-5 rounded-2xl w-full bg-white grid grid-cols-[250px,_200px,_1fr] items-center gap-x-4 divide-x-2">
            <p className="text-base">{formatDateOption(textDate)}</p>
            <div className="">
              <p className="pl-4 text-base font-bold text-left">{textTitle}</p>
            </div>
            <div className="pl-4 flex">
              <p className="text-sm text-left lg:w-24 lg:truncate xl:w-full">
                {textMessage}
              </p>
              <div className="grow" />
              <span className="inline-block"> {'>'} </span>
            </div>
          </div>
        </a>
      </Link>
    </div>
  )
}

export default Snackbar
