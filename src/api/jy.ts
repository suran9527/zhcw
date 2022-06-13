
import request from '@/utils/request';

export function getSpeakList(params) {
  return request({
    method: 'get',
    url: '/get_speak_list',
    params
  });
}
export function delSpeak(data) {
  return request({
    method: 'post',
    url: '/del_speak',
    data
  });
}

