import type { NextPage } from 'next'
import LayoutAuthenticated from '@/src/layouts/authenticated/LayoutAuthenticated'
import TambahDiagnosisAwal from '@/src/features/tambah_diagnosis_awal'
import useGetAuth from '@/src/hooks/useGetAuth'

const PageTambahDiagnosisAwal: NextPage = () => {
  useGetAuth()
  return (
    <LayoutAuthenticated>
      <TambahDiagnosisAwal />
    </LayoutAuthenticated>
  )
}

export default PageTambahDiagnosisAwal
