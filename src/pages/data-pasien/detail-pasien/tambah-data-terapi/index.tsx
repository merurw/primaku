import type { NextPage } from 'next'
import LayoutAuthenticated from '@/src/layouts/authenticated/LayoutAuthenticated'
import TambahDataTerapi from '@/src/features/tambah_data_terapi'
import useGetAuth from '@/src/hooks/useGetAuth'

const PageTambahDataTerapi: NextPage = () => {
  useGetAuth()
  return (
    <LayoutAuthenticated>
      <TambahDataTerapi />
    </LayoutAuthenticated>
  )
}

export default PageTambahDataTerapi
