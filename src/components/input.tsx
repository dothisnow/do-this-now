import { ComponentProps, RefObject } from 'react'
import { twMerge as tw } from 'tailwind-merge'

export const Input = ({
  innerRef,
  className,
  ...props
}: ComponentProps<'input'> & { innerRef?: RefObject<HTMLInputElement> }) => (
  <input
    {...props}
    ref={innerRef}
    className={tw(
      'block w-96 min-w-0 flex-1 rounded border border-gray-800 bg-black p-2.5 text-white placeholder-gray-400 outline-none ring-white ring-offset-0 ring-offset-black hover:bg-gray-900 focus:border-gray-700 focus:border-blue-500 focus:bg-gray-900 focus:ring sm:text-sm',
      className
    )}
  />
)
