import clsx from 'clsx'
import { useState } from 'react'

const ToggleSwitch: React.FC = () => {
  const [isToggleStatus, setIsToggleStatus] = useState<boolean>(false)
  return (
    <div
      className="flex lg:flex-col xl:flex-row xl:items-center gap-2"
      onClick={() => setIsToggleStatus(!isToggleStatus)}
    >
      <div
        className={clsx(
          'lg:w-7 lg:h-4 xl:w-12 xl:h-7 flex items-center rounded-full p-1 duration-300 ease-in-out',
          !isToggleStatus ? 'bg-gray-300' : 'bg-semantic-green'
        )}
      >
        <div
          className={clsx(
            'bg-white lg:w-3 lg:h-3 xl:w-5 xl:h-5 rounded-full shadow-md transform duration-300 ease-in-out',
            isToggleStatus ? 'lg:translate-x-[9px] xl:translate-x-5' : ''
          )}
        />
      </div>
    </div>
  )
}

export default ToggleSwitch
