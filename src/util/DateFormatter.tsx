import React from 'react'

interface DateString {
  dateString: Date
}

const FormatSmallNum = (value: string) => {
  if (value.length < 2) {
    let valueNum: Number = +value
    if (valueNum < 10 && valueNum > 0) {
      value = '0' + value
    }

    if (value === '0') {
      value = '00'
    }
  }
  return value
}

const FormatDateNum = (value: string) => {
  let valueNum: Number = +value
  if (valueNum < 10) {
    value = '0' + value
  }

  if (value === '0') {
    value = '00'
  }

  return value
}

const DateFormatter: React.FC<DateString> = ({ dateString }) => {
  //let userTimezoneOffset =  new Date(dateString).getTimezoneOffset() * 60000;
  let noTimeZoneDate = new Date(new Date(dateString).getTime())
  let da = noTimeZoneDate.toLocaleString('en-GB', { day: 'numeric' })
  let mo = noTimeZoneDate.toLocaleString('en-GB', { month: 'numeric' })
  let ho = noTimeZoneDate.toLocaleString('en-GB', { hour: '2-digit' })
  let mi = noTimeZoneDate.toLocaleString('en-GB', { minute: '2-digit' })
  let se = noTimeZoneDate.toLocaleString('en-GB', { second: '2-digit' })
  da = FormatDateNum(da)
  mo = FormatDateNum(mo)
  ho = FormatSmallNum(ho)
  mi = FormatSmallNum(mi)
  se = FormatSmallNum(se)
  let output = ''
  if (ho === '23' && mi === '59' && se === '59') {
    output = da + '/' + mo
  } else {
    output = da + '/' + mo + ' , ' + ho + ':' + mi
  }
  return <>{output}</>
}

export default DateFormatter
