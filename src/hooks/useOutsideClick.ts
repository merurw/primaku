import { useEffect, useRef } from 'react'

type cb = () => void

const useOutsideClick = (callback: cb) => {
  const ref = useRef<HTMLDivElement>()

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Element)) {
        callback()
      }
    }

    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [ref])

  return ref
}

export default useOutsideClick
