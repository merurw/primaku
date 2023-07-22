import { NextRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { IBreadcrumbs } from '@/src/utils/types/globals'

const useBreadcrumbs = (router: NextRouter) => {
  const [breadcrumbs, setBreadcrumbs] = useState<IBreadcrumbs[]>()
  useEffect(() => {
    const pathWithoutQuery = router.asPath.split('?')[0]
    const pathWithQuery = router.asPath.split('?')[1]
    let pathArray = pathWithoutQuery.split('/')
    pathArray.shift()

    pathArray = pathArray.filter((path) => path !== '')

    const breadcrumbs = pathArray.map((path, index) => {
      const href = `/${pathArray.slice(0, index + 1).join('/')}${
        index > 0 ? '?' + pathWithQuery : ''
      }`
      return {
        href,
        label: path.charAt(0).toUpperCase() + path.slice(1),
        isCurrent: index === pathArray.length - 1
      }
    })

    setBreadcrumbs(breadcrumbs)
  }, [router.asPath])

  return [breadcrumbs]
}

export default useBreadcrumbs
