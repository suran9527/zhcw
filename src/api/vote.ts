import request from '@/utils/request';

export function getVoteList(params) {
  return request({
    method: 'get',
    url: '/get_vote_list',
    params
  });
}
export function addVote(data) {
  return request({
    method: 'post',
    url: '/add_vote',
    data
  });
}
export function delVote(data) {
  return request({
    method: 'post',
    url: '/del_vote',
    data
  });
}
