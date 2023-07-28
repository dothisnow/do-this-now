import { AcademicCapIcon } from '@heroicons/react/20/solid'

const Button = ({
  icon,
  onClick,
  text,
}: {
  icon: typeof AcademicCapIcon
  onClick: () => void
  text?: string
}) => {
  const Icon = icon
  return (
    <button
      onClick={onClick}
      className='ml-1 mb-1 block flex rounded-full border border-gray-700 bg-gray-800 py-2 px-2.5 text-sm text-white outline-none ring-white ring-offset-0 ring-offset-black hover:border-gray-600 hover:bg-gray-700 focus:z-10 focus:ring'>
      {!!text && <div className='mr-1'>{text}</div>}
      <Icon className='block h-5 w-5' />
    </button>
  )
}

export default Button
