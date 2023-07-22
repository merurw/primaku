import { ReactElement, useState, MouseEvent } from 'react'
import clsx from 'clsx'
import Cookies from 'js-cookie'
import { useAppSelector } from '@/src/hooks/useStore'
import Icon from '@/src/components/Icons'
import { iconVariants } from '@/src/constants/constants'
import useOutsideClick from '@/src/hooks/useOutsideClick'
import { handleErrorTracking } from '@/src/utils/error-tracking-handler/errorTracking'

export default function Appbar(): ReactElement {
  const { loading, auth } = useAppSelector((state) => state.auth)
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false)

  const handleClickOutside = () => {
    setIsShowMenu(false)
  }

  const ref = useOutsideClick(handleClickOutside)

  const handleToggleClick = (): void => {
    setIsShowMenu(!isShowMenu)
  }

  const handleLogoutClick = (e: MouseEvent<HTMLDivElement>): void => {
    e.preventDefault()
    try {
      Cookies.remove('autkn')
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      const { message } = error as Error
      handleErrorTracking('', message)
    }
  }

  return (
    <nav className="sticky top-0 backdrop-blur-sm py-[17px] shadow-b-lg shadow-lg z-20">
      <div className="relative flex items-center gap-3">
        <div className="grow" />
        <div className="relative">
          <div
            ref={ref}
            className="rounded-full w-11 h-11 flex items-center justify-center bg-neutral-200 font-extrabold cursor-default"
            onClick={() => handleToggleClick()}
          >
            <Icon select={iconVariants.doctor} />
            <div
              className={clsx(
                'origin-top-right absolute right-0 mt-24 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none',
                isShowMenu ? '' : 'hidden'
              )}
            >
              <div
                className="block px-4 py-2 text-sm text-gray-600 font-bold hover:bg-slate-200 cursor-pointer"
                onClick={(e) => handleLogoutClick(e)}
              >
                Logout
              </div>
            </div>
          </div>
        </div>
        <div className="mr-11">
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className={clsx('h-3 bg-slate-400 rounded-md w-20')} />
              <div className={clsx('h-3 bg-slate-400 rounded-md w-14')} />
            </div>
          ) : (
            <>
              <div className="font-extrabold">{auth.name}</div>
              <div className="text-gray-400">{auth.phone}</div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
