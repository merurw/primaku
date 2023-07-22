import satelite from '../../../services/axios'

export const fetchSendOTP = async (payload: unknown) => {
  return await satelite({
    url: '/pediatrician-auth/send-otp',
    method: 'post',
    data: JSON.stringify(payload)
  })
}

export const verifyOTP = async (payload: unknown) => {
  return await satelite({
    url: '/pediatrician-auth/verify-otp',
    method: 'post',
    data: JSON.stringify(payload)
  })
}
