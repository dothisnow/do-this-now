import keycode from 'keycode'
import { useCallback, useEffect } from 'react'

export type KeyAction = {
  key: string
  description: string
  action: ((e: KeyboardEvent) => void) | (() => void)
}

const useKeyAction = (
  keyActions: KeyAction[],
  event: 'keydown' | 'keyup' = 'keydown'
) => {
  const callback = useCallback(
    (e: KeyboardEvent) => {
      console.log(e)
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return
      for (const kA of keyActions)
        if (
          !e.altKey &&
          !e.ctrlKey &&
          !e.metaKey &&
          keycode(kA.key) === e.which
        ) {
          e.preventDefault()
          kA.action(e)
        }
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
