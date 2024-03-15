import { Switch as UnwrappedSwitch } from '@headlessui/react'

export const Switch = ({
  checked,
  onChange,
  className,
  id,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
  id?: string
}) => (
  <UnwrappedSwitch
    id={id}
    checked={checked}
    onChange={onChange}
    className={
      (checked
        ? 'justify-end border-gray-500 bg-gray-700'
        : 'justify-start border-gray-800 bg-black') +
      ' flex w-12 cursor-pointer rounded-full border p-0.5 outline-none ring-white ring-offset-0 ring-offset-black transition-colors duration-200 ease-in-out focus:ring ' +
      className
    }>
    <span className='sr-only'>Use setting</span>
    <span
      aria-hidden='true'
      className='pointer-events-none h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-all duration-200 ease-in-out'></span>
  </UnwrappedSwitch>
)
