import request from '@/utils/request'

// 查询论坛信息

列表
export function listForum(query) {
  return request({
    url: '/carpool/forum/list',
    method: 'get',
    params: query
  })
}

// 查询论坛信息

详细
export function getForum(id) {
  return request({
    url: '/carpool/forum/' + id,
    method: 'get'
  })
}

// 新增论坛信息


export function addForum(data) {
  return request({
    url: '/carpool/forum',
    method: 'post',
    data: data
  })
}

// 修改论坛信息


export function updateForum(data) {
  return request({
    url: '/carpool/forum',
    method: 'put',
    data: data
  })
}

// 删除论坛信息


export function delForum(id) {
  return request({
    url: '/carpool/forum/' + id,
    method: 'delete'
  })
}
