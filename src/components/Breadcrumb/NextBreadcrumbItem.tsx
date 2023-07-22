import Link from 'next/link'
import clsx from 'clsx'

interface IBreadcrumbItemProps {
  children?: React.ReactNode
  href?: string
  isCurrent?: boolean
}

const BreadcrumbItem: React.FC<IBreadcrumbItemProps> = ({
  children,
  href,
  isCurrent,
  ...props
}) => {
  return (
    <li {...props}>
      <Link href={href} passHref>
        <a
          className={clsx(
            'text-base font-bold text-white',
            isCurrent && 'font-extralight text-gray-300 pointer-events-none'
          )}
          aria-current={isCurrent ? 'page' : 'false'}
        >
          {children}
        </a>
      </Link>
    </li>
  )
}

export default BreadcrumbItem
