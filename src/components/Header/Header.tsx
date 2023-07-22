import Breadcrumb from '@/src/components/Breadcrumb/NextBreadcrumb'
import BreadcrumbItem from '@/src/components/Breadcrumb/NextBreadcrumbItem'
import { IBreadcrumbs } from '@/src/utils/types/globals'

interface IHeaderProps {
  children?: React.ReactNode
  showBreadcrumb?: boolean
  dataBreadcrumbs?: IBreadcrumbs[]
}

const Header: React.FC<IHeaderProps> = ({
  children,
  dataBreadcrumbs,
  showBreadcrumb
}) => {
  return (
    <div className="bg-primary w-full md:h-[150px] lg:h-[160px] xl:h-[200px] rounded-b-2xl">
      <div className="pl-[40px] pr-[79px]">
        {showBreadcrumb && (
          <Breadcrumb>
            {dataBreadcrumbs?.map((breadcrumb) => (
              <BreadcrumbItem
                key={breadcrumb.href}
                href={breadcrumb.href}
                isCurrent={breadcrumb.isCurrent}
              >
                {breadcrumb.label}
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
        )}
        <div className="">{children}</div>
      </div>
    </div>
  )
}

export default Header
