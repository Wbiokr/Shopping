import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/order/list',
    method: 'get',
    params: query
  })
}

export function exportOrders(query) {
  return request({
    url: '/order/export',
    method: 'get',
    params: query,
    headers: {
      responseType: 'blob',
    },
  })
}

export function fetchOrder(id) {
  return request({
    url: '/order/'+id,
    method: 'get'
  })
}

export function updateOrderStatus(json) {
  return request({
    url: '/order/status',
    method: 'post',
    data:json
  })
}

export function delOrder(id) {
  return request({
    url: '/order/'+id,
    method: 'delete',
  })
}


