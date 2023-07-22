import dynamic from 'next/dynamic'
import clsx from 'clsx'
import { IconProps, BoxIconProps } from './types'
import { iconVariants } from '@/src/constants/constants'

const ArrowIcon = dynamic(
  async () => await import('@/src/components/Icons/ArrowIcon')
)
const DangerIcon = dynamic(
  async () => await import('@/src/components/Icons/DangerIcon')
)
const UsersIcon = dynamic(
  async () => await import('@/src/components/Icons/UsersIcon')
)
const PhoneIcon = dynamic(
  async () => await import('@/src/components/Icons/PhoneIcon')
)
const QRIcon = dynamic(
  async () => await import('@/src/components/Icons/QRIcon')
)
const SearchIcon = dynamic(
  async () => await import('@/src/components/Icons/SearchIcon')
)
const EditIcon = dynamic(
  async () => await import('@/src/components/Icons/EditIcon')
)
const CalendarIcon = dynamic(
  async () => await import('@/src/components/Icons/CalendarIcon')
)
const DoctorIcon = dynamic(
  async () => await import('@/src/components/Icons/DoctorIcon')
)

const Icon: React.FC<IconProps> = ({
  select,
  size,
  color,
  rotate,
  onClick
}) => {
  const elementProperty = {
    size,
    color,
    rotate,
    onClick
  }

  if (select === iconVariants.arrow) {
    return <ArrowIcon {...elementProperty} onClick={onClick} />
  } else if (select === iconVariants.danger) {
    return <DangerIcon {...elementProperty} />
  } else if (select === iconVariants.user) {
    return <UsersIcon {...elementProperty} />
  } else if (select === iconVariants.phone) {
    return <PhoneIcon {...elementProperty} />
  } else if (select === iconVariants.qr) {
    return <QRIcon {...elementProperty} />
  } else if (select === iconVariants.search) {
    return <SearchIcon {...elementProperty} />
  } else if (select === iconVariants.edit) {
    return <EditIcon {...elementProperty} />
  } else if (select === iconVariants.calendar) {
    return <CalendarIcon {...elementProperty} />
  } else if (select === iconVariants.doctor) {
    return <DoctorIcon {...elementProperty} />
  }
}

Icon.defaultProps = {
  size: '12',
  color: '#252525',
  rotate: '0',
  select: 'arrow'
}

const Icons: React.FC<BoxIconProps> = ({
  size = '12',
  color = '#252525',
  rotate = '0',
  mode = 'none',
  backgroundColor = 'none',
  select,
  onClick
}) => {
  const iconProperty = {
    select,
    size,
    color,
    rotate,
    onClick
  }
  return (
    <div
      className={clsx(
        'flex justify-center items-center box-border',
        backgroundColor !== 'none' ? `bg-${backgroundColor}` : ''
      )}
    >
      <Icon {...iconProperty} onClick={onClick} />
    </div>
  )
}

Icons.defaultProps = {
  mode: 'none',
  backgroundColor: 'none',
  size: '12',
  color: '#F36F21',
  rotate: '0',
  select: 'arrow'
}

export default Icons
