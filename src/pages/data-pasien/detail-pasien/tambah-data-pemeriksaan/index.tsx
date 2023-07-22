import type { NextPage } from 'next'
import LayoutAuthenticated from '@/src/layouts/authenticated/LayoutAuthenticated'
import TambahDataPemeriksaan from '@/src/features/tambah_data_pemeriksaan'
import useGetAuth from '@/src/hooks/useGetAuth'

const PageTambahDataPemeriksaan: NextPage = () => {
  useGetAuth()
  return (
    <LayoutAuthenticated>
      <TambahDataPemeriksaan />
    </LayoutAuthenticated>
  )
}

export default PageTambahDataPemeriksaan
