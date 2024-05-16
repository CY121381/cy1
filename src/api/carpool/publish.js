import request from '@/utils/request'

// 查询拼车发布信息列表
export function listPublish(query) {
  return request({
    url: '/carpool/publish/list',
    method: 'get',
    params: query
  })
}

// 查询拼车发布信息详细
export function getPublish(id) {
  return request({
    url: '/carpool/publish/' + id,
    method: 'get'
  })
}

// 新增拼车发布信息
export function addPublish(data) {
  return request({
    url: '/carpool/publish',
    method: 'post',
    data: data
  })
}

// 修改拼车发布信息
export function updatePublish(data) {
  return request({
    url: '/carpool/publish',
    method: 'put',
    data: data
  })
}

// 删除拼车发布信息
export function delPublish(id) {
  return request({
    url: '/carpool/publish/' + id,
    method: 'delete'
  })
}
