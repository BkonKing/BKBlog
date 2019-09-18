import request from '../axios'

export function login (params: object) {
  return request({
    url: '/basic/login',
    method: 'get',
    params: params
  })
}
