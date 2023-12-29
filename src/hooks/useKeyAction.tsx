import keycode from 'keycode'
import { useCallback, useEffect } from 'react'

export type KeyAction = {
  key: string
  description: string
  action: ((e: KeyboardEvent) => void) | (() => void)
  shift?: boolean
}

const useKeyAction = (
  keyActions: KeyAction[],
  event: 'keydown' | 'keyup' = 'keydown'
) => {
  const callback = useCallback(
    (e: KeyboardEvent) => {
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
          keycode(kA.key) === e.which &&
          (kA.shift === undefined || kA.shift === e.shiftKey)
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
