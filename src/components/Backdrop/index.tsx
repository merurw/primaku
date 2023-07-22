interface IBackdropProps {
  isShow: boolean
}

const Backdrop: React.FC<IBackdropProps> = ({ isShow }) => {
  return (
    <>
      {isShow && (
        <div className="backdrop bg-black/50 fixed inset-0 top-[83px] w-full h-full z-10 no-scrollbar" />
      )}
    </>
  )
}

export default Backdrop
