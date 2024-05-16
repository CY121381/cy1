import request from '@/utils/request'

// 查询拼车用户列表
export function listUser(query) {
  return request({
    url: '/carpool/user/list',
    method: 'get',
    params: query
  })
}


// 查询拼车用户列表
export function getUsers(query) {
  return request({
    url: '/carpool/user/userList',
    method: 'get',
    params: query
  })
}


// 查询拼车用户详细
export function getUser(id) {
  return request({
    url: '/carpool/user/' + id,
    method: 'get'
  })
}

// 新增拼车用户

export function addUser(data) {
  return request({
    url: '/carpool/user',
    method: 'post',
    data: data
  })
}

// 修改拼车用户

export function updateUser(data) {
  return request({
    url: '/carpool/user',
    method: 'put',
    data: data
  })
}

// 删除拼车用户

export function delUser(id) {
  return request({
    url: '/carpool/user/' + id,
    method: 'delete'
  })
}
