import { IconProps } from '@/src/utils/types/globals'

const ArrowIcon: React.FC<IconProps> = ({ size, rotate, onClick }) => {
  return (
    <svg
      width={size}
      height={size}
      className="cursor-pointer"
      style={{
        transform: `rotate(${rotate}deg)`,
        WebkitTransform: `rotate(${rotate}deg)`
      }}
      viewBox="0 0 18 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <path
        d="M1.25 7.27429L16.25 7.27429"
        stroke="#252525"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.2998 13.2987L1.2498 7.27469L7.2998 1.24969"
        stroke="#252525"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ArrowIcon
