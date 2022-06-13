import request from '@/utils/request';

export function getNewsList(params) {
  return request({
    method: 'get',
    url: '/get_news_list',
    params
  });
}
export function addNews(data) {
  return request({
    method: 'post',
    url: '/add_news',
    data
  });
}
export function editNews(data) {
  return request({
    method: 'post',
    url: '/edit_news',
    data
  });
}

export function delNews(data) {
  return request({
    method: 'post',
    url: '/del_news',
    data
  });
}

