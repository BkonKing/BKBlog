import request from '../axios'

export function login (data: object) {
  return request({
    url: '/signin',
    method: 'post',
    data: data
  })
}
