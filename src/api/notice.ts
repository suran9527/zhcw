import request from '@/utils/request';

export function getNoticeList(params) {
  return request({
    method: 'get',
    url: '/get_notice_list',
    params
  });
}
export function addNotice(data) {
  return request({
    method: 'post',
    url: '/add_notice',
    data
  });
}
export function editNotice(data) {
  return request({
    method: 'post',
    url: '/edit_notice',
    data
  });
}

export function delNotice(data) {
  return request({
    method: 'post',
    url: '/del_notice',
    data
  });
}

