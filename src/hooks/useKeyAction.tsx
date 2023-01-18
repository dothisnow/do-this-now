import { useCallback, useEffect } from 'react'

export type KeyAction = [string, string, (e?: KeyboardEvent) => void]

const useKeyAction = (
    keyActions: KeyAction[],
    event: 'keydown' | 'keyup' = 'keydown'
) => {
    const callback = useCallback(
        (e: KeyboardEvent) => {
            for (const kA of keyActions) if (kA[0] === e.key) kA[2](e)
        },
        [keyActions]
    )
    return useEffect(() => {
        document.addEventListener(event, callback)
        return () => {
            document.removeEventListener(event, callback)
        }
    }, [keyActions, event, callback])
}

export default useKeyAction
