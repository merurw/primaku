import type { NextPage } from 'next'
import LayoutAuthenticated from '@/src/layouts/authenticated/LayoutAuthenticated'
import DetailPasien from '@/src/features/detail_data_pasien'
import useGetAuth from '@/src/hooks/useGetAuth'

const PageDetailPasien: NextPage = () => {
  useGetAuth()
  return (
    <LayoutAuthenticated>
      <DetailPasien />
    </LayoutAuthenticated>
  )
}

export default PageDetailPasien
