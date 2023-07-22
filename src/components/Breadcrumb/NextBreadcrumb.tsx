import { Children, Fragment } from 'react'

interface IBreadcrumbProps {
  children?: React.ReactNode
}

const Breadcrumb: React.FC<IBreadcrumbProps> = ({ children }) => {
  const childrenArray = Children.toArray(children)

  const childrenWtihSeperator = childrenArray.map((child, index) => {
    if (index !== childrenArray.length - 1) {
      return (
        <Fragment key={index}>
          {child}
          <span className="text-white">/</span>
        </Fragment>
      )
    }
    return child
  })

  return (
    <nav className="pt-7" aria-label="breadcrumb">
      <ol className="flex items-center space-x-4">{childrenWtihSeperator}</ol>
    </nav>
  )
}

export default Breadcrumb
