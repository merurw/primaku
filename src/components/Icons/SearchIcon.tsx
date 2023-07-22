import { IconProps } from '@/src/utils/types/globals'

const SearchIcon: React.FC<IconProps> = ({ size, color, rotate, onClick }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.7669 20.7552C16.7311 20.7552 20.7555 16.7309 20.7555 11.7666C20.7555 6.80239 16.7311 2.77808 11.7669 2.77808C6.80265 2.77808 2.77834 6.80239 2.77834 11.7666C2.77834 16.7309 6.80265 20.7552 11.7669 20.7552Z"
        stroke="#BEBFC3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.0186 18.4851L21.5426 22"
        stroke="#BEBFC3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default SearchIcon
