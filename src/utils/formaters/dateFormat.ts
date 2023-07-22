export const formatDate = (date: Date | string | number) => {
  const d = new Date(date)
  let month = `${d.getMonth() + 1}`
  let day = `${d.getDate()}`
  const year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

export const formatDateLong = (date: Date | string | number) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  }
  const d = new Date(date)
  return d.toLocaleDateString('id-ID', options)
}

export const timeSplit = (date: Date) => {
  const datess = new Date(date)
  datess.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  })
  const d = String(datess)
  const time = d.split('T')[1]
  console.log(time)
  return time
}

interface IDateOptions {
  year?: 'numeric'
  month?: 'short'
  day?: 'numeric'
  weekday?: 'long'
  timeZone?: 'UTC'
}
export const formatDateOption = (date: string) => {
  if (date) {
    const dates = new Date(date)
    const dateOptions: IDateOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
    const options: IDateOptions = { weekday: 'long' }
    return `${new Intl.DateTimeFormat('id-ID', options).format(dates)},  
      ${dates.toLocaleDateString(
        'id-ID',
        dateOptions
      )} - ${dates.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })}`
  } else {
    return ''
  }
}

interface IWord {
  one?: string
  other?: string
}

const getPlural = (number: number, word: IWord): string => {
  return (number === 1 && word.one) || word.other
}

export const getWords = (monthCount: number): string => {
  const months = { one: 'bulan', other: 'bulan' }
  const years = { one: 'tahun', other: 'tahun' }
  const m = monthCount % 12
  const y = Math.floor(monthCount / 12)
  const result = []

  y && result.push(`${y} ${getPlural(y, years)}`)
  m && result.push(`${m} ${getPlural(m, months)}`)
  return result.join(' ')
}

export const monthDiff = (date: Date | string): string => {
  if (date) {
    const start = new Date()
    const end = new Date(date)
    const startY = start.getFullYear()
    const endY = end.getFullYear()
    const startM = start.getMonth()
    const endM = end.getMonth()
    const month = startM + 12 * startY - (endM + 12 * endY)
    const dDiff = start.getTime() - end.getTime()
    const days = Math.ceil(dDiff / (1000 * 3600 * 24))
    return getWords(month) !== '' ? getWords(month) : `${days} days`
  } else {
    return ''
  }
}
