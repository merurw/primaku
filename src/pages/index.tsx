import type { NextPage } from 'next'
import Cookies from 'js-cookie'
import LoginPage from '../features/login'
import { token } from '../constants/constants'

const App: NextPage = () => {
  const session = Cookies.get(token) !== undefined
  const routeToDashboard = () => {
    window.location.assign('/data-pasien')
  }

  if (!session) {
    return (
      <>
        <LoginPage />
      </>
    )
  } else {
    routeToDashboard()
  }
}

export default App
