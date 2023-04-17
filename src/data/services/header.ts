import { AxiosHeaders, RawAxiosRequestHeaders } from 'axios'

const ServiceHeader = () => {
  const headers: RawAxiosRequestHeaders | AxiosHeaders = {
    'Content-Type': 'application/json',
  }

  return headers
}

export default ServiceHeader
