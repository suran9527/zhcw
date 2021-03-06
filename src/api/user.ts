import request from '@/utils/request';

export function login(data) {
return request({
  method: 'post',
  url: '/login',
  data: {
    user:data.account,
    pas:data.password
  }
});
}
export function getUserList(params) {
  return request({
    method: 'get',
    url: '/get_user_list',
    params
  });
}
export function searchUserList(params) {
  return request({
    method: 'get',
    url: '/get_user_list',
    params:{
      pages:1,
      limit:9999,
      words:params
    }
  });
}
export function setUserAuth(data) {
  return request({
    method: 'post',
    url: '/set_user_auth',
    data
  });
}

