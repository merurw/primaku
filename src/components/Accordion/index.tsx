import { useState, useRef } from 'react'
import clsx from 'clsx'

interface IAccordionProps {
  title: string
  children?: React.ReactNode
}

const Accordion: React.FC<IAccordionProps> = ({ title, children }) => {
  const [isOpened, setOpened] = useState<boolean>(false)
  const [height, setHeight] = useState<string>('0px')
  const contentElement = useRef(null)

  const handleOpening = () => {
    setOpened(!isOpened)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    setHeight(!isOpened ? `${contentElement?.current?.scrollHeight}px` : '0px')
  }

  return (
    <div className="">
      <div
        className={clsx(
          'bg-white p-4 flex justify-between items-center cursor-pointer',
          isOpened ? 'rounded-tr-lg rounded-tl-lg' : 'rounded-lg'
        )}
        onClick={handleOpening}
      >
        <h4 className="text-xl font-bold">{title}</h4>
        <div
          className={clsx(
            'p-0 m-0 rounded-full w-8 h-8 text-white inline-flex items-center justify-center font-extrabold text-2xl',
            isOpened ? 'bg-red-500' : 'bg-primary'
          )}
        >
          {isOpened ? '-' : '+'}
        </div>
      </div>
      <div
        className="bg-white rounded-br-lg rounded-bl-lg overflow-hidden transition-all duration-200 px-4"
        ref={contentElement}
        style={{ height }}
      >
        {children}
      </div>
    </div>
  )
}

export default Accordion
