import { IconProps } from '@/src/utils/types/globals'

const DangerIcon: React.FC<IconProps> = ({ size, rotate, onClick }) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.00006 0.833374C10.4054 0.833374 13.1667 3.59404 13.1667 7.00004C13.1667 10.4054 10.4054 13.1667 7.00006 13.1667C3.59406 13.1667 0.833397 10.4054 0.833397 7.00004C0.833397 3.59404 3.59406 0.833374 7.00006 0.833374Z"
        stroke="#FF6A55"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.9968 4.46942V7.41542"
        stroke="#FF6A55"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.99666 9.53072H7.00333"
        stroke="#FF6A55"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default DangerIcon
