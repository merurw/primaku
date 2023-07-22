import { ChangeEvent } from 'react'

interface ICheckboxProps {
  value?: string | ''
  label: string
  onChangeCheckbox?: (val: ChangeEvent<HTMLInputElement>) => void
  checked?: boolean
  isDisabled?: boolean
}

const CustomCheckbox: React.FC<ICheckboxProps> = ({
  value,
  label,
  onChangeCheckbox,
  checked,
  isDisabled
}) => {
  return (
    <div className="flex items-center">
      <input
        id={`filter-diagnosis-${value}`}
        name={value}
        value={value}
        checked={checked}
        disabled={isDisabled}
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-0 checked:transition-transform"
        onChange={onChangeCheckbox}
      />
      <label
        htmlFor={`filter-diagnosis-${value}`}
        className="ml-3 min-w-0 flex-1 text-gray-500"
      >
        {label}
      </label>
    </div>
  )
}

export default CustomCheckbox
