import clsx from 'clsx'
import React from 'react'

type Variants = 'primary' | 'secondary' | 'disabled' | 'gray'
type Sizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type ButtonTypes = 'button' | 'submit' | 'reset' | undefined

const variantStyle: { [key in Variants]: string } = {
  primary:
    'text-white bg-primary hover:bg-blue-600 focus:border-blue-700 active:bg-blue-700',
  secondary:
    'text-primary bg-white hover:bg-blue-600 hover:text-white focus:border-blue-700 active:bg-blue-700',
  disabled: 'text-gray-400 bg-gray-200 border-[1px] border-gray-400',
  gray: 'text-white bg-neutral-400 border-[1px] border-gray-300 hover:bg-neutral-500'
}

const sizeStyle: { [key in Sizes]: string } = {
  xs: 'text-xs px-2.5 py-1.5 leading-4',
  sm: 'text-sm px-3 py-2 leading-4',
  md: 'text-base px-4 py-2 leading-6',
  lg: 'text-base px-6 py-2 leading-6',
  xl: 'text-base px-16 py-2 leading-6 font-bold rounded-md'
}

interface ButtonProps {
  children?: React.ReactNode
  variant?: Variants
  size?: Sizes
  isLoading?: boolean
  isBlock?: boolean
  isDisabled?: boolean
  id: string
  type: ButtonTypes
  onClick?: () => void
}

type Ref = HTMLButtonElement

const BaseButton = React.forwardRef<Ref, ButtonProps>(
  (
    {
      id,
      variant,
      size,
      isLoading,
      isBlock,
      isDisabled,
      type,
      onClick,
      children
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        id={id}
        type={type}
        className={clsx(
          'border border-transparent font-medium rounded-md focus:outline-none focus:shadow-outline-blue transition ease-in-out duration-150',
          isDisabled
            ? 'text-gray-400 bg-gray-200 border-[1px] border-gray-400'
            : variantStyle[variant],
          sizeStyle[size]
        )}
        disabled={isDisabled}
        onClick={onClick}
      >
        {isLoading ? (
          <div className="flex justify-center items-center space-x-2">
            <svg
              className="animate-spin px-0 mx-0 my-1 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm">Processing</span>
          </div>
        ) : (
          children
        )}
      </button>
    )
  }
)

export default BaseButton
