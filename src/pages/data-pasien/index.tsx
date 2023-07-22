import type { NextPage } from 'next'
import LayoutAuthenticated from '@/src/layouts/authenticated/LayoutAuthenticated'
import DataPasien from '@/src/features/data_pasien'
import useGetAuth from '@/src/hooks/useGetAuth'

const PageDataPasien: NextPage = () => {
  useGetAuth()
  return (
    <LayoutAuthenticated>
      <DataPasien />
    </LayoutAuthenticated>
  )
}

export default PageDataPasien
