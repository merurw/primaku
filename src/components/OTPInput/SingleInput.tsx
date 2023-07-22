import { memo, useRef, useEffect, ReactElement } from 'react'
import usePrevious from '../../hooks/usePrevious'

export interface SingleOTPInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  focus?: boolean
}

export function SingleOTPInputComponent(
  props: SingleOTPInputProps
): ReactElement {
  const { focus, autoFocus, ...rest } = props
  const inputRef = useRef<HTMLInputElement>(null)
  const prevFocus = usePrevious(!!focus)
  useEffect(() => {
    if (inputRef.current != null) {
      if (focus && autoFocus) {
        inputRef.current.focus()
      }
      if (focus && autoFocus && focus !== prevFocus) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    }
  }, [autoFocus, focus, prevFocus])

  return <input ref={inputRef} {...rest} />
}

const SingleOTPInput = memo(SingleOTPInputComponent)
export default SingleOTPInput
