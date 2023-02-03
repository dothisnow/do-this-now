import { useState } from 'react'
import useKeyAction, { KeyAction } from '../hooks/useKeyAction'

type HintProps = {
    letter: string
    text: string
}

const Hint = ({ letter, text }: HintProps) => (
    <li>
        <kbd className="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm text-white font-medium leading-5 text-white mr-2 mb-1">
            {letter}
        </kbd>
        {text}
    </li>
)

const Hints = ({ keyActions }: { keyActions: KeyAction[] }) => {
    const [show, setShow] = useState(false)

    const hintKeyActions: KeyAction[] = [
        ['h', 'Show hints', () => setShow(true)],
    ]
    useKeyAction(hintKeyActions)
    const hintKeyUpActions: KeyAction[] = [
        ['h', 'Show hints', () => setShow(false)],
    ]
    useKeyAction(hintKeyUpActions, 'keyup')

    return (
        <>
            {show && (
                <>
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 bg-gray-800 border border-gray-700 rounded px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6 text-white">
                        <div>
                            <div className="text-left">
                                <ul className="list-disc list-inside pt-1">
                                    {keyActions.map(([letter, text]) => (
                                        <Hint
                                            key={letter}
                                            {...{ letter, text }}
                                        />
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <div
                onClick={() => setShow(x => !x)}
                className="fixed text-gray-400 top-0 right-0 text-sm p-2">
                (<i>h</i> for hint)
            </div>
        </>
    )
}

export default Hints
