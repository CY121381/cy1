import request from '@/utils/request'

// 查询文章咨询
列表
export function listCmsArticle(query) {
  return request({
    url: '/system/cmsArticle/list',
    method: 'get',
    params: query
  })
}

// 查询文章咨询
详细
export function getCmsArticle(id) {
  return request({
    url: '/system/cmsArticle/' + id,
    method: 'get'
  })
}

// 新增文章咨询

export function addCmsArticle(data) {
  return request({
    url: '/system/cmsArticle',
    method: 'post',
    data: data
  })
}

// 修改文章咨询

export function updateCmsArticle(data) {
  return request({
    url: '/system/cmsArticle',
    method: 'put',
    data: data
  })
}

// 删除文章咨询

export function delCmsArticle(id) {
  return request({
    url: '/system/cmsArticle/' + id,
    method: 'delete'
  })
}
