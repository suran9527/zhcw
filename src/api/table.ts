
import request from '@/utils/request';
export function excelOut(data) {
  return request({
    method: 'post',
    url: '/excel_out_villager',
    data
  });
}
export function excelAdd(data) {
  return request({
    method: 'post',
    url: '/excel_add_villager',
    data
  });
}
