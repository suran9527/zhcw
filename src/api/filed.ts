import request from '@/utils/request';

export function addField(data) {
  return request({
    method: 'post',
    url: '/add_field',
    data
  });
}
export function delField(data) {
  return request({
    method: 'post',
    url: '/del_feild',
    data
  });
}
