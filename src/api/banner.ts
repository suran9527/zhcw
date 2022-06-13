
import request from '@/utils/request';

export function addBanner(data) {
  return request({
    method: 'post',
    url: '/add_banner',
    data
  });
}
export function delBanner(data) {
  return request({
    method: 'post',
    url: '/del_banner',
    data
  });
}
export function getBannerList(params) {
  return request({
    method: 'get',
    url: '/get_banner_list',
    params
  });
}
