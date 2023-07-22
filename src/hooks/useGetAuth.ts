import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { token } from '../constants/constants'
import { useAppDispatch } from '@/src/hooks/useStore'
import { initAuth } from '@/src/features/login/authSlice'

const useGetAuth = (data?: string): void => {
  const dispatch = useAppDispatch()
  const [cookieAuth, getCookieAuth] = useState<string>(null)

  useEffect(() => {
    if (typeof window !== undefined) {
      if (Cookies.get(token)) {
        getCookieAuth(Cookies.get(token))
        dispatch(initAuth(JSON.parse(Cookies.get(token))))
      }
    }
  }, [data, dispatch, cookieAuth])
}

export default useGetAuth
