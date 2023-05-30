import { FC } from 'react'

const Button = ({
  icon,
  onClick,
  text,
}: {
  icon: FC<{ className: string }>
  onClick: () => void
  text?: string
}) => {
  const Icon = icon
  return (
    <button
      onClick={onClick}
      className='ml-1 mb-1 block rounded-full border border-gray-700 bg-gray-800 py-2 px-2.5 text-sm text-white hover:border-gray-600 hover:bg-gray-700'>
      {!!text && <span className='mr-1'>{text}</span>}
      <Icon className='inline-block h-5 w-5' />
    </button>
  )
}

export default Button
