import { ChangeEvent } from 'react'
import Icon from '@/src/components/Icons'
import clsx from 'clsx'

interface ICustomInputProps {
  children?: React.ReactNode
  iconVariant?: string
  size?: string
  isLoading?: boolean
  isBlock?: boolean
  isDisabled?: boolean
  id: string
  placeholder?: string
  onChangeInput?: (text: string | HTMLInputElement) => void
  type?: string
  value?: string | number
  name?: string
  readOnly?: boolean
}

const CustomInput: React.FC<ICustomInputProps> = ({
  placeholder,
  children,
  iconVariant,
  isDisabled,
  type,
  onChangeInput,
  value,
  name,
  readOnly
}) => {
  const handleOnchangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeInput(e.target)
  }

  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        className={clsx(
          'input-text p-2 lg:text-xs xl:text-base',
          isDisabled ? 'bg-gray-200 border-2 border-gray-200' : '',
          iconVariant ? 'pr-10' : ''
        )}
        disabled={isDisabled}
        placeholder={placeholder}
        onChange={handleOnchangeInput}
        readOnly={readOnly}
        value={value}
      />
      <span className="pointer-events-none w-8 h-8 absolute top-1/2 transform -translate-y-[10px] right-2">
        {iconVariant && <Icon select={iconVariant} size="18" />}
      </span>
    </div>
  )
}

export default CustomInput
