import clsx from 'clsx'
import { useRouter } from 'next/router'
import Icon from '@/src/components/Icons'

interface IMenuProps {
  text: string
  icon: string
  active: boolean
  link: string
  id: string
}

const Menu: React.FC<IMenuProps> = ({ text, icon, active, link, id }) => {
  const router = useRouter()
  const handleClick = () => {
    void router.push(link)
  }
  return (
    <div className="cursor-pointer" onClick={handleClick}>
      <div
        className={clsx(
          'bg-primary flex items-center pl-5 rounded-md h-10 gap-x-3',
          active ? 'text-white' : ''
        )}
      >
        <Icon select={icon} size="18" />
        <div>{text}</div>
      </div>
    </div>
  )
}

export default Menu
