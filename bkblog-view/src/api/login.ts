import request from '@/utils/axios'

export function login (data: object):object {
  return request({
    url: '/signin',
    method: 'post',
    data: data
  })
}
