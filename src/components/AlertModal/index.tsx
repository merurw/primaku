import clsx from 'clsx'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/src/hooks/useStore'
import { setAlertData } from './alertSlice'

const AlertModal: React.FC = () => {
  const dispatch = useAppDispatch()
  const { alertData } = useAppSelector((state) => state.dataAlert)

  const closeAlert = (): void => {
    dispatch(
      setAlertData({
        isShow: false,
        type: '',
        message: ''
      })
    )
  }

  const backdrop = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 }
  }

  const alert = {
    hidden: {
      y: '-100vh',
      opacity: 0
    },
    visible: {
      y: '120px',
      opacity: 1,
      transition: {
        delay: 0.5
      }
    }
  }

  useEffect(() => {
    return () => {
      setTimeout(() => {
        closeAlert()
      }, 7000)
    }
  }, [alertData.isShow])

  return (
    <>
      <AnimatePresence exitBeforeEnter>
        {alertData.isShow && (
          <motion.div
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative inset-0 top-10 mx-auto flex justify-center"
          >
            <motion.div
              variants={alert}
              className={clsx(
                'rounded-md px-4 py-3 absolute -top-14 w-2/4 z-10 shadow-md',
                alertData.type === 'success'
                  ? 'bg-[#EBF9F6] border-2 border-[#2FBB9B]'
                  : alertData.type === 'warning'
                  ? 'bg-[#F9F6EF] border-2 border-[#ffca4f]'
                  : 'bg-[#f9e4e4] border-2 border-[#ff4141]'
              )}
              role="alert"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <svg
                    className={clsx(
                      'fill-semantic-green w-4 h-4 mr-2',
                      alertData.type === 'success'
                        ? 'fill-[#2FBB9B]'
                        : alertData.type === 'warning'
                        ? 'fill-[#ffca4f]'
                        : 'fill-[#ff4141]'
                    )}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
                  </svg>
                  <div
                    className={clsx(
                      'font-bold',
                      alertData.type === 'success'
                        ? 'text-semantic-green'
                        : alertData.type === 'warning'
                        ? 'text-[#ffca4f]'
                        : 'text-[#ff4141]'
                    )}
                  >
                    {alertData.message instanceof Array ? (
                      <ul className="list-disc">
                        {alertData.message?.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{alertData.message}</p>
                    )}
                  </div>
                </div>
                <span
                  v-if="isShow"
                  className="text-lg text-gray-500 cursor-pointer"
                  onClick={() => closeAlert()}
                >
                  &times;
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AlertModal
