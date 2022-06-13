import request from '@/utils/request';

export function getPublicKey() {
  return request({
    method: 'get',
    url: '/get_public_key'
  });
}
export function getPrivateKey() {
  return request({
    method: 'get',
    url: '/get_private_key'
  });
}
export function getFieldList(params) {
  return request({
    method: 'get',
    url: '/get_field_list',
    params
  });
}
export function getVillagerList(params) {
  return request({
    method: 'get',
    url: '/get_villager_list',
    params
  });
}
export function getVillagerInfo(data) {
  return request({
    method: 'post',
    url: '/get_villager_info',
    data
  });
}

export function addVillager(data) {
  return request({
    method: 'post',
    url: '/add_villager',
    data
  });
}

export function editVillager(data) {
  return request({
    method: 'post',
    url: '/edit_villager',
    data
  });
}
export function delVillager(data) {
  return request({
    method: 'post',
    url: '/del_villager',
    data
  });
}
export function delVillagerBatch(data) {
  return request({
    method: 'post',
    url: '/del_villager_batch',
    data
  });
}
export function createQrcode() {
  return request({
    method: 'POST',
    url: '/create_qrcode'
  });
}




