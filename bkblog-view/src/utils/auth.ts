import Cookies from 'js-cookie'
const tokenTypeKey: string = 'access-token'

export function getToken() {
  return Cookies.get(tokenTypeKey)
}

export function setToken(token: string, time: number) {
  return Cookies.set(tokenTypeKey, token,  { expires: time/86400, path: '' })
}

export function removeToken() {
  return Cookies.remove(tokenTypeKey)
}
