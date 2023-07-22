import Sidebar from '@/src/components/Sidebar'
import Appbar from '@/src/components/Appbar'

interface ILayoutAuthenticatedProps {
  children: React.ReactNode
}

const LayoutAuthenticated: React.FC<ILayoutAuthenticatedProps> = ({
  children
}) => {
  return (
    <div className="grid grid-cols-[auto,_1fr]">
      <Sidebar />
      <div className="grid grid-rows-[auto,_1fr]">
        <Appbar />
        <div className="box-border w-full bg-[#E9ECEF] pb-10">{children}</div>
      </div>
    </div>
  )
}

export default LayoutAuthenticated
