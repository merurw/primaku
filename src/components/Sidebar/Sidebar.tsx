import { ReactElement } from 'react'
import PrimakuLogo from '../../components/Logo/PrimakuLogo'
import Menu from '@/src/components/Menu'
import { useRouter } from 'next/router'

export default function Sidebar(): ReactElement {
  const router = useRouter()
  const menu = [
    {
      text: 'Data Pasien',
      link: '/data-pasien',
      param: 'data-pasien',
      icon: 'user',
      id: 'button-menu-data-pasien'
    }
  ]

  return (
    <aside className="bg-secondary md:w-[185px] lg:w-[200px] xl:w-[235px] h-screen sticky top-0 z-10 ">
      <div className="py-[23px] pl-8 pr-5 mb-5 border-b-2 border-blue-100 md:w-[185px] lg:w-[200px] xl:w-[235px]">
        <PrimakuLogo />
      </div>
      <div className="grid grid-cols-[1fr] gap-y-6 h-10 m-3">
        {menu.map((item, index) => (
          <Menu
            key={`menu-${index}`}
            id={item.id}
            text={item.text}
            icon={item.icon}
            active={router.pathname.toLowerCase().includes(item.param)}
            link={item.link}
          />
        ))}
      </div>
    </aside>
  )
}
