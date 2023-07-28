import { Switch as UnwrappedSwitch } from '@headlessui/react'

export const Switch = ({
  checked,
  onChange,
  className,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}) => (
  <UnwrappedSwitch
    checked={checked}
    onChange={onChange}
    className={
      (checked ? 'bg-blue-600' : 'bg-gray-200') +
      ' relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent outline-none ring-white ring-offset-0 ring-offset-black transition-colors duration-200 ease-in-out focus:z-10 focus:ring ' +
      className
    }>
    <span className='sr-only'>Use setting</span>
    <span
      aria-hidden='true'
      className={
        (checked ? 'translate-x-5' : 'translate-x-0') +
        ' pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
      }></span>
  </UnwrappedSwitch>
)
