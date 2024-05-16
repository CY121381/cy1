import request from '@/utils/request'

// 查询车辆信息列表
export function listCar(query) {
  return request({
    url: '/carpool/car/list',
    method: 'get',
    params: query
  })
}

// 查询车辆信息详细
export function getCar(id) {
  return request({
    url: '/carpool/car/' + id,
    method: 'get'
  })
}

// 新增车辆信息

export function addCar(data) {
  return request({
    url: '/carpool/car',
    method: 'post',
    data: data
  })
}

// 修改车辆信息

export function updateCar(data) {
  return request({
    url: '/carpool/car',
    method: 'put',
    data: data
  })
}

// 删除车辆信息

export function delCar(id) {
  return request({
    url: '/carpool/car/' + id,
    method: 'delete'
  })
}
