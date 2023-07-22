/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@/src/hooks/useStore'
import Cookies from 'js-cookie'

interface IData {
  id?: number
  href?: string
  isSelected?: boolean
  title?: string
}
interface ITabsProps {
  data?: IData[]
  onClick?: (activeTab: number) => void
}

const Tabs: React.FC<ITabsProps> = ({ data, onClick }) => {
  const [activeTab, setActiveTab] = useState<number>(1)

  const handleClick = (tab: number) => {
    setActiveTab(tab)
    onClick(activeTab)
    Cookies.set('_recentTab', String(tab))
  }

  const { selectedTab } = useAppSelector((state) => state.dataModals)

  useEffect(() => {
    onClick(activeTab)
    Cookies.set('_recentTab', JSON.stringify(activeTab))
  }, [activeTab, onClick])

  useEffect(() => {
    if (selectedTab) {
      setActiveTab(selectedTab)
    }
  }, [selectedTab])

  return (
    <div className="border-b-2 border-b-slate-200">
      <div className="pl-6 pt-4 pr-6 flex justify-between items-center flex-wrap">
        <ul
          className={clsx('flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row')}
          role="tablist"
        >
          {data?.map((tab, index) => (
            <li
              key={`tab-${tab.title}-${tab.id}`}
              className="-mb-px mr-2 last:mr-0 flex-auto text-center"
            >
              <a
                data-toggle="tab"
                role="tablist"
                className={clsx(
                  'text-base px-5 py-3 rounded block leading-normal cursor-pointer',
                  activeTab !== index + 1
                    ? 'text-neutral-500 bg-white'
                    : 'text-white bg-primary font-semibold'
                )}
                onClick={() => handleClick(index + 1)}
              >
                {tab.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Tabs
