import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

interface IModalProps {
  showModal: boolean
  setShowModal?: (showModal: boolean) => void
  children?: React.ReactNode
  yOffset?: string
  maxWidth?: string
}

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
}

const Modal: React.FC<IModalProps> = ({
  children,
  showModal,
  setShowModal,
  maxWidth,
  yOffset
}) => {
  const modal = {
    hidden: {
      y: '-100vh',
      opacity: 0
    },
    visible: {
      y: yOffset,
      opacity: 1,
      transition: {
        delay: 0.5
      }
    }
  }
  return (
    <AnimatePresence exitBeforeEnter>
      {showModal && (
        <motion.div
          className="backdrop bg-black/50 fixed inset-0 top-[83px] w-full h-full z-10 no-scrollbar"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={() => setShowModal(!setShowModal)}
        >
          <motion.div
            className={clsx(
              'mx-auto bg-white pt-4 pb-5 px-2 rounded-xl text-center',
              maxWidth || 'max-w-lg'
            )}
            variants={modal}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
