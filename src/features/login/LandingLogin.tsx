import { useState, useEffect, ReactElement, FormEvent } from 'react'
import { useRouter } from 'next/router'
import type { NextPage } from 'next'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import NumberFormat from 'react-number-format'
import PrimakuLogo from '../../components/Logo/PrimakuLogo'
import BaseButton from '../../components/Button'
import OTPInput from '@/src/components/OTPInput'
import Icon from '@/src/components/Icons'
import { iconVariants } from '@/src/constants/constants'
import { fetchSendOTP } from '../api/auth'
import { useAppDispatch, useAppSelector } from '@/src/hooks/useStore'
import { fetchVerifyOTP } from './authSlice'
import { AxiosError } from 'axios'

interface IOTP {
  value?: string
}

const backgroundStyle = {
  backgroundImage: 'url("/images/Vector-6.svg"), url("/images/Vector-7.svg")',
  backgroundPosition: 'left 350px, right 250px',
  backgroundSize: 'contain, contain',
  backgroundRepeat: 'no-repeat'
}

const variantCardAuth = {
  hidden: {
    scale: 0.8,
    opacity: 0
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.4
    }
  }
}

const LandingLogin: NextPage = (): ReactElement => {
  // const useStateLabel = (initialValue: boolean | string | number, name: string) => {
  //   const [value, setValue] = useState(initialValue)
  //   useDebugValue(`${name}: ${JSON.stringify(value)}`)
  //   return [value, setValue]
  // }
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [otpNumber, setOTPNumber] = useState<string>('')
  const [isInputPhoneVisible, setIsInputPhoneVisible] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [countDown, setCountDown] = useState<number>(0)
  const [isRunTimer, setIsRunTimer] = useState<boolean>(false)
  const { loading, auth, error } = useAppSelector((state) => state.auth)

  const resetErrorMessage = (): void => {
    setErrorMessage('')
  }

  const handleChangePhoneNumber = (values: IOTP): void => {
    const val = values.value.replace(/^0+/, '')
    setPhoneNumber(val)
  }

  const validatePhoneInput = !!(phoneNumber.length < 10 || !phoneNumber)
  const validateOTPInput = !!(otpNumber.length <= 3 || !otpNumber)

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>,
    phoneNumber: string
  ): void => {
    const prefix = '+62'
    const phone = prefix + phoneNumber
    const data = {
      phone,
      resend: false
    }
    e.preventDefault()
    setIsLoading(true)
    fetchSendOTP(data)
      .then((res) => {
        setIsLoading(false)
        setIsInputPhoneVisible(false)
        resetErrorMessage()
      })
      .catch((err: AxiosError) => {
        setIsLoading(false)
        setErrorMessage(err.message)
      })
    startCountDown()
    // setTimeout(() => {
    //   setIsInputPhoneVisible(false)
    //   setIsLoading(false)
    //   setIsInputPinVisible(true)
    // }, 3000)
  }

  const handlePreviousBtn = (): void => {
    if (!isRunTimer) {
      setIsInputPhoneVisible(true)
      setOTPNumber('')
      setIsRunTimer(false)
    }
  }

  const handleChangeOTP = (payload: string): void => {
    const prefix = '+62'
    const phone = prefix + phoneNumber
    if (payload.length === 4) {
      setOTPNumber(payload)
      void dispatch(
        fetchVerifyOTP({
          phone,
          otpCode: payload
        })
      )
    }
  }

  useEffect(() => {
    if (auth) {
      void router.replace('/data-pasien')
    }
  }, [auth])

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval>

    if (isRunTimer) {
      setCountDown(60 * 5)
      timerId = setInterval(() => {
        setCountDown((countDown: number) => countDown - 1)
      }, 1000)
    } else {
      clearInterval(timerId)
    }
    return () => clearInterval(timerId)
  }, [isRunTimer, setCountDown])

  useEffect(() => {
    if (countDown < 0 && isRunTimer) {
      setIsRunTimer(false)
      setCountDown(0)
    }
  }, [countDown, isRunTimer])

  const startCountDown = () => setIsRunTimer((t: unknown) => !t)

  const seconds = String(countDown % 60).padStart(2, '0')
  const minutes = String(Math.floor(countDown / 60)).padStart(2, '0')

  const replaceAt = (
    phoneNumber: string,
    index: number,
    replacement: string
  ) => {
    return replacement + phoneNumber.substring(index + 8)
  }

  return (
    <div
      className="bg-primary h-screen flex justify-center items-center"
      style={backgroundStyle}
    >
      <AnimatePresence>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variantCardAuth}
        >
          <div className="bg-white rounded-lg w-auto h-auto py-10 px-14 flex flex-col justify-center items-center z-10">
            {isInputPhoneVisible ? (
              <div className="space-y-9">
                <div className="space-y-5 flex flex-col justify-center items-center">
                  <PrimakuLogo />
                  <p className="text-neutral-400 text-xl">
                    Changing Diabetes in Children (CDIC)
                  </p>
                </div>
                <div className="w-[436px]">
                  <form
                    onSubmit={
                      !validatePhoneInput
                        ? (e: FormEvent<HTMLFormElement>) =>
                            handleSubmit(e, phoneNumber)
                        : (e) => e.preventDefault()
                    }
                  >
                    <label className="block">
                      <span className="text-neutral-400 text-base">
                        Nomor Handphone
                      </span>
                      <div
                        className={clsx(
                          'mt-2 flex rounded-md border border-gray-300 p-1',
                          errorMessage && 'border-red-600 animate-shake'
                        )}
                      >
                        <span className="bg-secondary inline-flex items-center rounded-md px-3">
                          +62
                        </span>
                        <NumberFormat
                          className="border-none w-full rounded-sm ml-2 px-1 border-transparent focus:border-transparent focus:ring-0"
                          format="#### #### ####"
                          mask=""
                          name="phoneNumberInput"
                          allowLeadingZeros={false}
                          placeholder="8xxx xxxx xxxx"
                          onValueChange={handleChangePhoneNumber}
                          value={phoneNumber.replace(/^0+/, '')}
                          renderText={(value) => (
                            <span>{value.replace(/^0+/, '')}</span>
                          )}
                        />
                      </div>
                      {errorMessage && (
                        <span className="flex mt-2 text-red-500 text-sm gap-x-2">
                          <Icon select={iconVariants.danger} size="15" />{' '}
                          {errorMessage}
                        </span>
                      )}
                    </label>
                    <div className="text-center mt-10">
                      <BaseButton
                        id="button-submit-lanjutkan"
                        type="submit"
                        size="xl"
                        variant="primary"
                        isLoading={isLoading}
                        isDisabled={validatePhoneInput}
                      >
                        Lanjutkan
                      </BaseButton>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="w-[436px] flex flex-col justify-center items-center space-y-10">
                <div className="flex self-start items-center space-x-4">
                  <Icon
                    select={iconVariants.arrow}
                    size="18"
                    onClick={() => handlePreviousBtn()}
                  />
                  <p className="text-primaku-grey text-lg font-bold">
                    Verifikasi Nomor HP
                  </p>
                </div>
                <p className="text-base text-primaku-grey text-center">
                  Masukkan Kode Verifikasi yang telah dikirim melalui SMS di 62{' '}
                  {replaceAt(phoneNumber, 0, '******** ')}
                </p>
                <div className="w-96">
                  <span className="text-sm text-gray-400 text-left pl-7">
                    Kode Verifikasi
                  </span>
                  <OTPInput
                    autoFocus
                    isNumberInput
                    length={4}
                    className="mt-4 text-center"
                    inputClassName={clsx(
                      'text-center text-2xl font-bold w-16 h-16 mx-3 border-2 border-gray-300 rounded-xl',
                      otpNumber.length > 3 ? 'bg-secondary border-none' : '',
                      error ? 'border-2 border-red-700 bg-red-100' : ''
                    )}
                    onChangeOTP={(otp) => handleChangeOTP(otp)}
                  />
                  {error && (
                    <span className="flex mt-3 text-red-500 text-sm gap-x-2 justify-center items-center">
                      <Icon select={iconVariants.danger} size="15" /> {error}
                    </span>
                  )}
                  <p className="mt-4 text-sm text-primaku-grey text-center">
                    TIdak menerima Kode Verifikasi?{' '}
                    {isRunTimer ? (
                      <span className="font-semibold">
                        Tunggu {minutes}:{seconds}
                      </span>
                    ) : (
                      <span
                        className="text-primary cursor-pointer font-semibold"
                        onClick={() => startCountDown()}
                      >
                        Kirim ulang
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-center mt-10">
                  <BaseButton
                    id="button-submit-verifikasi"
                    type="button"
                    size="xl"
                    variant="primary"
                    isLoading={loading}
                    isDisabled={validateOTPInput}
                    onClick={() => handleChangeOTP(otpNumber)}
                  >
                    Verifikasi
                  </BaseButton>
                </div>
              </div>
            )}
            <div></div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default LandingLogin
