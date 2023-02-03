import { FC } from 'react'

type ButtonProps = {
  icon: FC<{ className: string }>
  onClick: () => void
  text: string
}

const Button = ({ icon, onClick, text }: ButtonProps) => {
  const Icon = icon
  return (
    <button
      onClick={onClick}
      className='ml-2 mb-2 block rounded border border-gray-700 bg-gray-800 p-2 text-sm text-white hover:border-gray-600 hover:bg-gray-700'>
      <span>{text}</span>
      <Icon className='ml-1 inline-block h-5 w-5' />
    </button>
  )
}

export default Button
