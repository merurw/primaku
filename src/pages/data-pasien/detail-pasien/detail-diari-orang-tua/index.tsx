import { NextPage } from 'next'
import LayoutAuthenticated from '@/src/layouts/authenticated/LayoutAuthenticated'
import DetailParentDiary from '@/src/features/detail-diari-orang-tua'
import useGetAuth from '@/src/hooks/useGetAuth'

const PageDetailParentDiary: NextPage = () => {
  useGetAuth()
  return (
    <LayoutAuthenticated>
      <DetailParentDiary />
    </LayoutAuthenticated>
  )
}

export default PageDetailParentDiary
