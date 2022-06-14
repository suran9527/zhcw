import request from '@/utils/request';

export function getList(params) {
  return request({
    method: 'get',
    url: '/get_del_site_list',
    params
  });
}
