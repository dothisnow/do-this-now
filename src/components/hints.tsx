import { useState } from 'react'
import useKeyAction, { KeyAction } from '../hooks/useKeyAction'

type HintProps = {
  letter: string
  text: string
}

const Hint = ({ letter, text }: HintProps) => (
  <li>
    <kbd className='mr-2 mb-1 inline-block rounded-full bg-gray-700 px-3 py-1 text-sm font-medium leading-5 text-white text-white'>
      {letter}
    </kbd>
    {text}
  </li>
)

const Hints = ({ keyActions }: { keyActions: KeyAction[] }) => {
  const [show, setShow] = useState(false)

  const hintKeyActions: KeyAction[] = [['h', 'Show hints', () => setShow(true)]]
  useKeyAction(hintKeyActions)
  const hintKeyUpActions: KeyAction[] = [
    ['h', 'Show hints', () => setShow(false)],
  ]
  useKeyAction(hintKeyUpActions, 'keyup')

  return (
    <>
      {show && (
        <>
          <div className='fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity' />
          <div className='absolute top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 transform overflow-hidden rounded border border-gray-700 bg-gray-800 px-4 pt-5 pb-4 text-left text-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6'>
            <div>
              <div className='text-left'>
                <ul className='list-inside list-disc pt-1'>
                  {keyActions.map(([letter, text]) => (
                    <Hint key={letter} {...{ letter, text }} />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
      <div
        onClick={() => setShow(x => !x)}
        className='fixed top-0 right-0 p-2 text-sm text-gray-400'>
        (<i>h</i> for hint)
      </div>
    </>
  )
}

export default Hints
