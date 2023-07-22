import { useEffect, useState } from 'react'

const useElementOnScreen = (
  options: IntersectionObserverInit,
  containerRef: HTMLDivElement
) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const cb = (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => {
    const [entry] = entries
    setIsVisible(entry?.isIntersecting)
    if (entry?.isIntersecting) {
      observer.unobserve(containerRef)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(cb, options)
    if (containerRef) observer.observe(containerRef)

    return () => {
      if (containerRef) observer.unobserve(containerRef)
    }
  }, [containerRef, options])

  return [isVisible]
}

export default useElementOnScreen
