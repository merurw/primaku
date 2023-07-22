import { captureException, setContext } from '@sentry/nextjs'

export const handleErrorTracking = (
  doctorName?: string,
  message?: string,
  type?: string | string[]
) => {
  setContext('Error Details', {
    name: doctorName,
    message
  })
  captureException(new Error(`${message} ${type || ''}`))
}
