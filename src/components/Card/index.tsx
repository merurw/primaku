interface ICardProps {
  children?: React.ReactNode
}

const Card: React.FC<ICardProps> = ({ children }) => {
  return (
    <div className="lg:-mt-7 xl:-mt-10 ml-[40px] mr-[79px] bg-white rounded-md shadow-lg">
      {children}
    </div>
  )
}

export default Card
